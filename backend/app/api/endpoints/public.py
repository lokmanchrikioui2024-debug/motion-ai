from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_user

router = APIRouter()


@router.get("/notifications")
async def notifications(current_user=Depends(get_current_user)):
    # return user's notifications (placeholder)
    return {"notifications": [
        {"id": 1, "type": "video_done", "message": "Your video is ready", "read": False},
        {"id": 2, "type": "billing", "message": "Invoice available", "read": True},
    ]}


@router.get("/testimonials")
async def testimonials():
    return {"testimonials": [
        {"id": 1, "author": "Léa", "text": "Amazing results in hours!"},
        {"id": 2, "author": "Marc", "text": "Our best campaign ever."},
    ]}


@router.get("/faqs")
async def faqs():
    return {"faqs": [
        {"q": "How long does rendering take?", "a": "Depends on length and complexity, typically minutes."},
        {"q": "Can I self-host?", "a": "Yes — see the deployment docs."},
    ]}
