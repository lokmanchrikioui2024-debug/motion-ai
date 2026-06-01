from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_user

router = APIRouter()


@router.get("/overview")
async def overview(current_user=Depends(get_current_user)):
    # Placeholder analytics
    return {
        "videos_generated": 0,
        "generation_time_seconds": 0,
        "monthly_usage": 0,
        "credits_consumed": 0,
    }


@router.get("/chart")
async def chart(current_user=Depends(get_current_user)):
    # Return simple chart data for the dashboard
    data = [
        {"name": "Jan", "views": 1200, "conversions": 45, "videos": 12},
        {"name": "Feb", "views": 1500, "conversions": 60, "videos": 18},
        {"name": "Mar", "views": 1800, "conversions": 72, "videos": 20},
        {"name": "Apr", "views": 2100, "conversions": 95, "videos": 26},
        {"name": "May", "views": 1700, "conversions": 58, "videos": 15},
        {"name": "Jun", "views": 1900, "conversions": 80, "videos": 22},
    ]
    return {"chart": data}
