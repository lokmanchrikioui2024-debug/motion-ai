import sys
import os
import pytest
from httpx import AsyncClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


@pytest.mark.asyncio
async def test_generate_and_process_video():
    from app.main import app
    from app.api.dependencies import get_current_user
    from app.db.session import engine
    from app.db.base import Base
    from app.tasks.video_tasks import process_video

    # ensure DB
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # create a user directly in DB (avoid bcrypt complexity in tests)
    import uuid
    email = f"pipeline+{uuid.uuid4().hex}@test"
    from app.db.session import async_session
    from app.models import User
    async with async_session() as session:
        user = User(email=email, hashed_password="test", credits=0)
        session.add(user)
        await session.commit()
        await session.refresh(user)

    # create project and asset
    from app.db.session import async_session
    from app.models import Project, Asset
    async with async_session() as session:
        proj = Project(name="P1", owner_id=user.id)
        session.add(proj)
        await session.commit()
        await session.refresh(proj)
        asset = Asset(owner_id=user.id, filename="a.png", url="/uploads/a.png", type="image")
        session.add(asset)
        await session.commit()
        await session.refresh(asset)

    # override auth
    class DummyUser:
        def __init__(self, id, email):
            self.id = id
            self.email = email

    from app.api.dependencies import get_current_user as get_dep
    app.dependency_overrides[get_dep] = lambda: DummyUser(user.id, user.email)

    async with AsyncClient(app=app, base_url="http://test") as ac:
        # trigger generation
        r = await ac.post('/api/videos/generate', json={"asset_id": asset.id, "project_id": proj.id})
        assert r.status_code == 200
        vid_id = r.json().get('video_id')

        # run the celery task synchronously to simulate worker
        process_video(vid_id)

        # fetch status
        r2 = await ac.get(f'/api/videos/{vid_id}')
        assert r2.status_code == 200
        assert r2.json().get('status') == 'done'
