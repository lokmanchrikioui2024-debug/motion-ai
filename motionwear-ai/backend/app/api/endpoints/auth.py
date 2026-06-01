from fastapi import APIRouter, HTTPException, Depends
from app import crud, auth as _auth
from app.schemas import UserCreate, UserOut, Token
from pydantic import BaseModel

router = APIRouter()


class LoginIn(BaseModel):
    email: str
    password: str


@router.post("/register", response_model=UserOut)
async def register(user_in: UserCreate):
    existing = await crud.get_user_by_email(user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = await crud.create_user(user_in.email, user_in.password)
    return user


@router.post("/login")
async def login(form_data: LoginIn):
    user = await crud.get_user_by_email(form_data.email)
    if not user or not crud.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect credentials")
    access_token = _auth.create_access_token(subject=str(user.id))
    refresh = await crud.create_refresh_token(user.id)
    return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh.token}


class RefreshIn(BaseModel):
    refresh_token: str


@router.post("/refresh")
async def refresh_token(data: RefreshIn):
    rt = await crud.validate_refresh_token(data.refresh_token)
    if not rt:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    access_token = _auth.create_access_token(subject=str(rt.user_id))
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
async def logout(data: RefreshIn):
    ok = await crud.revoke_refresh_token(data.refresh_token)
    if not ok:
        raise HTTPException(status_code=400, detail="Invalid token")
    return {"status": "ok"}


class ForgotIn(BaseModel):
    email: str


@router.post("/forgot-password")
async def forgot_password(data: ForgotIn):
    user = await crud.get_user_by_email(data.email)
    if not user:
        return {"status": "ok"}
    pr = await crud.create_password_reset_token(user.id)
    # In production send email; for now return token for testing
    return {"reset_token": pr.token}


class ResetIn(BaseModel):
    token: str
    password: str


@router.post("/reset-password")
async def reset_password(data: ResetIn):
    pr = await crud.consume_password_reset_token(data.token)
    if not pr:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    # update user password
    from app.db.session import async_session
    from app.models import User
    async with async_session() as session:
        result = await session.execute(__import__("sqlalchemy").select(User).where(User.id == pr.user_id))
        user = result.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user.hashed_password = crud.pwd_context.hash(data.password)
        session.add(user)
        await session.commit()
    return {"status": "ok"}
