from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_user
from app.db.session import async_session
from app.models import Project
import sqlalchemy
from pydantic import BaseModel
from app.api.dependencies import get_current_user


class ProjectIn(BaseModel):
    name: str

router = APIRouter()


@router.get("/")
async def list_projects(current_user=Depends(get_current_user)):
    async with async_session() as session:
        result = await session.execute(sqlalchemy.select(Project).where(Project.owner_id == current_user.id))
        projects = result.scalars().all()
        return {"projects": [{"id": p.id, "name": p.name, "thumbnail": getattr(p, 'thumbnail', ''), "status": getattr(p,'status',''), "createdAt": str(p.created_at)} for p in projects]}


@router.post("/")
async def create_project(payload: ProjectIn, current_user=Depends(get_current_user)):
    async with async_session() as session:
        p = Project(name=payload.name, owner_id=current_user.id)
        session.add(p)
        await session.commit()
        await session.refresh(p)
        return {"id": p.id, "name": p.name}
