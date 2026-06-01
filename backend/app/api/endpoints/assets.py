from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.api.dependencies import get_current_user
from app.db.session import async_session
from app.models import Asset
import sqlalchemy
from datetime import datetime
from app.services.s3 import generate_presigned_post, generate_presigned_url
import os

router = APIRouter()


@router.post("/upload")
async def upload_asset(file: UploadFile = File(...), current_user=Depends(get_current_user)):
    # Minimal validation
    if file.content_type.split('/')[0] != 'image':
        raise HTTPException(status_code=400, detail="Only image uploads allowed")
    # In production upload to S3; here create DB record and return placeholder URL
    filename = f"{int(datetime.utcnow().timestamp())}_{file.filename}"
    url = f"/uploads/{filename}"
    async with async_session() as session:
        asset = Asset(owner_id=current_user.id, filename=filename, url=url, type='image')
        session.add(asset)
        await session.commit()
        await session.refresh(asset)
        return {"id": asset.id, "url": asset.url}


@router.get("/")
async def list_assets(current_user=Depends(get_current_user)):
    async with async_session() as session:
        result = await session.execute(sqlalchemy.select(Asset).where(Asset.owner_id == current_user.id))
        assets = result.scalars().all()
        return {"assets": [{"id": a.id, "name": a.filename, "url": a.url, "type": a.type} for a in assets]}



@router.get('/presign')
async def presign_upload(filename: str, current_user=Depends(get_current_user)):
    # return presigned POST data for direct browser upload
    bucket = os.getenv('S3_BUCKET', 'motionwear-assets')
    key = f"uploads/{int(datetime.utcnow().timestamp())}_{filename}"
    try:
        post = generate_presigned_post(bucket, key)
        return {"url": post['url'], "fields": post['fields'], "key": key}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/presign-get')
async def presign_get(key: str, current_user=Depends(get_current_user)):
    bucket = os.getenv('S3_BUCKET', 'motionwear-assets')
    try:
        url = generate_presigned_url(bucket, key)
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
