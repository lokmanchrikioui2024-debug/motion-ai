from fastapi import FastAPI
from app.api.api_v1 import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine

app = FastAPI(title=settings.PROJECT_NAME)


@app.on_event("startup")
async def startup():
    # create tables for development (Alembic is preferred for migrations)
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception:
        # if DB not available at startup, continue; migrations or later retry will handle
        pass


app.include_router(api_router, prefix="/api")


@app.get("/")
async def root():
    return {"status": "ok", "project": settings.PROJECT_NAME}
