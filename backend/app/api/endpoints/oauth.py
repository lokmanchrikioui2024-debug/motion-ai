from fastapi import APIRouter, HTTPException
import requests
from app import crud
from app.auth import create_access_token

router = APIRouter()


@router.post("/google")
async def google_oauth(id_token: str):
    # Verify token against Google
    resp = requests.get("https://oauth2.googleapis.com/tokeninfo", params={"id_token": id_token})
    if resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid Google token")
    info = resp.json()
    email = info.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email not available")
    user = await crud.get_user_by_email(email)
    if not user:
        # create user without password
        user = await crud.create_user(email, "")
    token = create_access_token(subject=str(user.id))
    return {"access_token": token, "token_type": "bearer"}
