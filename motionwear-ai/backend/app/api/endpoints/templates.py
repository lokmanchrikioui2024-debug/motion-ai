from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_templates():
    # Placeholder templates
    return {"templates": [
        {"id": "tpl_1", "name": "Streetwear Promo", "thumbnail": "/placeholders/tpl1.jpg", "category": "streetwear", "uses": 1245, "isPremium": False, "tags": ["fast", "edgy"]},
        {"id": "tpl_2", "name": "Luxury Brand", "thumbnail": "/placeholders/tpl2.jpg", "category": "luxury", "uses": 842, "isPremium": True, "tags": ["cinematic", "clean"]},
    ]}
