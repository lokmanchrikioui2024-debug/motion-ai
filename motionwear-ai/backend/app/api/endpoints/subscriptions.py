from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_user

router = APIRouter()


@router.get("/plans")
async def plans():
    return {"plans": [
        {"id": "free", "name": "Free", "credits": 10},
        {"id": "pro", "name": "Pro", "credits": 100},
        {"id": "business", "name": "Business", "credits": 1000},
    ]}


@router.get("/me")
async def my_subscription(current_user=Depends(get_current_user)):
    # Placeholder: return free plan by default
    return {"plan": "free", "status": "active", "credits": 10}
