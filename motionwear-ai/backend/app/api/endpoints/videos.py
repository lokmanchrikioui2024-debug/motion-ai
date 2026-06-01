from fastapi import APIRouter, Depends, HTTPException
from app.api.dependencies import get_current_user
from app.db.session import async_session
from app.models import Video, Project, Asset
import sqlalchemy
from pydantic import BaseModel
from app.tasks.video_tasks import process_video
import os
import socket
import threading

router = APIRouter()


@router.get("/")
async def list_videos(current_user=Depends(get_current_user)):
    async with async_session() as session:
        result = await session.execute(sqlalchemy.select(Video).join(Project).where(Project.owner_id == current_user.id))
        vids = result.scalars().all()
        return {"videos": [{"id": v.id, "path": v.path, "status": v.status} for v in vids]}


@router.get("/{video_id}")
async def get_video_status(video_id: int, current_user=Depends(get_current_user)):
    async with async_session() as session:
        result = await session.execute(sqlalchemy.select(Video).where(Video.id == video_id))
        v = result.scalars().first()
        if not v:
            raise HTTPException(status_code=404, detail="Video not found")
        return {"id": v.id, "path": v.path, "status": v.status}


class GenerateIn(BaseModel):
    asset_id: int
    project_id: int
    template: str = "default"


@router.post("/generate")
async def generate_video(payload: GenerateIn, current_user=Depends(get_current_user)):
    # Validate asset and project
    async with async_session() as session:
        res = await session.execute(sqlalchemy.select(Asset).where(Asset.id == payload.asset_id))
        asset = res.scalars().first()
        if not asset:
            raise HTTPException(status_code=404, detail="Asset not found")
        res = await session.execute(sqlalchemy.select(Project).where(Project.id == payload.project_id))
        project = res.scalars().first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        video = Video(project_id=project.id, path="", status="queued")
        session.add(video)
        await session.commit()
        await session.refresh(video)
        # enqueue Celery task; if broker/broker host is unreachable, run processing in a background thread
        broker_url = os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0")
        try:
            # parse host and port from broker_url (simple parse for redis://host:port)
            host = "redis"
            port = 6379
            if broker_url.startswith("redis://"):
                try:
                    hostport = broker_url.split("//", 1)[1].split("/", 1)[0]
                    if ":" in hostport:
                        host, port = hostport.split(":", 1)
                        port = int(port)
                    else:
                        host = hostport
                except Exception:
                    pass

            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1.0)
            try:
                sock.connect((host, port))
                sock.close()
                # broker reachable — dispatch to Celery
                process_video.delay(video.id)
            except Exception:
                # broker not reachable — run processing in background thread (non-blocking)
                t = threading.Thread(target=process_video, args=(video.id,))
                t.daemon = True
                t.start()
        except Exception:
            # As a last resort, run synchronously (should be rare)
            process_video(video.id)
        return {"video_id": video.id, "status": "queued"}


@router.get("/{video_id}/download")
async def download_video(video_id: int, current_user=Depends(get_current_user)):
    # return presigned URL or local path for the generated video
    from app.services.s3 import generate_presigned_url
    async with async_session() as session:
        result = await session.execute(sqlalchemy.select(Video).where(Video.id == video_id))
        v = result.scalars().first()
        if not v:
            raise HTTPException(status_code=404, detail="Video not found")
        # ensure user owns the video via project
        result = await session.execute(sqlalchemy.select(Project).where(Project.id == v.project_id))
        p = result.scalars().first()
        if not p or p.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        if not v.path:
            raise HTTPException(status_code=404, detail="Video not ready")
        # expect path like s3://bucket/key or local /uploads/key
        if v.path.startswith("s3://"):
            # parse bucket and key
            try:
                _, rest = v.path.split("s3://", 1)
                bucket, key = rest.split("/", 1)
            except Exception:
                raise HTTPException(status_code=500, detail="Invalid video path")
            url = generate_presigned_url(bucket, key)
        else:
            # local path
            url = v.path
        return {"url": url}
