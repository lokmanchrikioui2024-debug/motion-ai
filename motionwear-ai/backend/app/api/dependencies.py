from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app import auth as _auth
from app.db.session import async_session
from app.models import User
import sqlalchemy

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = _auth.decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    user_id = int(payload.get("sub"))
    async with async_session() as session:
        result = await session.execute(sqlalchemy.select(User).where(User.id == user_id))
        user = result.scalars().first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
