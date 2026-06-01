from sqlalchemy.future import select
from sqlalchemy import insert
from app.models import User
from app.db.session import async_session
from passlib.context import CryptContext
from datetime import datetime, timedelta
import secrets
from app.models import RefreshToken, PasswordResetToken
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def get_user_by_email(email: str):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.email == email))
        return result.scalars().first()


async def create_user(email: str, password: str):
    try:
        hashed = pwd_context.hash(password)
    except Exception:
        # fallback if bcrypt or other backend is unavailable (dev/test environments)
        import hashlib
        hashed = "sha256$" + hashlib.sha256(password.encode()).hexdigest()
    async with async_session() as session:
        user = User(email=email, hashed_password=hashed)
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user


def verify_password(plain_password, hashed_password):
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        # support fallback sha256$ hashing used in limited environments
        try:
            if isinstance(hashed_password, str) and hashed_password.startswith("sha256$"):
                import hashlib
                return hashed_password == "sha256$" + hashlib.sha256(plain_password.encode()).hexdigest()
        except Exception:
            return False
        return False


async def create_refresh_token(user_id: int, days: int = 30):
    token = secrets.token_urlsafe(64)
    expires_at = datetime.utcnow() + timedelta(days=days)
    async with async_session() as session:
        rt = RefreshToken(user_id=user_id, token=token, expires_at=expires_at)
        session.add(rt)
        await session.commit()
        await session.refresh(rt)
        return rt


async def revoke_refresh_token(token: str):
    async with async_session() as session:
        result = await session.execute(select(RefreshToken).where(RefreshToken.token == token))
        rt = result.scalars().first()
        if rt:
            rt.revoked = True
            session.add(rt)
            await session.commit()
            return True
    return False


async def validate_refresh_token(token: str):
    async with async_session() as session:
        result = await session.execute(select(RefreshToken).where(RefreshToken.token == token))
        rt = result.scalars().first()
        if not rt:
            return None
        if rt.revoked:
            return None
        if rt.expires_at and rt.expires_at < datetime.utcnow():
            return None
        return rt


async def create_password_reset_token(user_id: int, hours: int = 2):
    token = secrets.token_urlsafe(48)
    expires_at = datetime.utcnow() + timedelta(hours=hours)
    async with async_session() as session:
        pr = PasswordResetToken(user_id=user_id, token=token, expires_at=expires_at)
        session.add(pr)
        await session.commit()
        await session.refresh(pr)
        return pr


async def consume_password_reset_token(token: str):
    async with async_session() as session:
        result = await session.execute(select(PasswordResetToken).where(PasswordResetToken.token == token))
        pr = result.scalars().first()
        if not pr:
            return None
        if pr.expires_at and pr.expires_at < datetime.utcnow():
            return None
        # delete token
        await session.delete(pr)
        await session.commit()
        return pr


    async def create_subscription_record(user_id: int, stripe_sub_id: str, plan: str, status: str = "active"):
        from app.models import Subscription
        async with async_session() as session:
            sub = Subscription(user_id=user_id, stripe_subscription_id=stripe_sub_id, plan=plan, status=status)
            session.add(sub)
            await session.commit()
            await session.refresh(sub)
            return sub


    async def update_subscription_status(stripe_sub_id: str, status: str):
        from app.models import Subscription
        async with async_session() as session:
            result = await session.execute(select(Subscription).where(Subscription.stripe_subscription_id == stripe_sub_id))
            sub = result.scalars().first()
            if sub:
                sub.status = status
                session.add(sub)
                await session.commit()
                return sub
            return None


    async def record_transaction(user_id: int, amount: float, currency: str = "usd", stripe_charge_id: str = ""):
        from app.models import Transaction
        async with async_session() as session:
            t = Transaction(user_id=user_id, amount=amount, currency=currency, stripe_charge_id=stripe_charge_id)
            session.add(t)
            await session.commit()
            await session.refresh(t)
            return t


    async def add_credits_to_user(user_id: int, credits: int):
        async with async_session() as session:
            result = await session.execute(select(User).where(User.id == user_id))
            user = result.scalars().first()
            if not user:
                return None
            user.credits = (user.credits or 0) + credits
            session.add(user)
            await session.commit()
            await session.refresh(user)
            return user

