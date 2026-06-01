import sys
import os
import pytest
from httpx import AsyncClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


class DummyUser:
    def __init__(self, id=1, email="test@example.com"):
        self.id = id
        self.email = email


@pytest.mark.asyncio
async def test_templates_and_analytics_and_projects_and_asset_upload():
    from app.main import app
    from app.api.dependencies import get_current_user

    # Override auth dependency to return a dummy user
    app.dependency_overrides[get_current_user] = lambda: DummyUser()

    async with AsyncClient(app=app, base_url="http://test") as ac:
        # ensure DB tables exist for sqlite fallback
        from app.db.session import engine
        from app.db.base import Base
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        r_tpl = await ac.get("/api/templates/")
        assert r_tpl.status_code == 200
        r_chart = await ac.get("/api/analytics/chart")
        assert r_chart.status_code == 200
        r_projects = await ac.get("/api/projects/")
        assert r_projects.status_code == 200

        # Test asset upload (multipart)
        files = {"file": ("test.png", b"\x89PNG\r\n\x1a\n", "image/png")}
        r_up = await ac.post("/api/assets/upload", files=files)
        assert r_up.status_code == 200
        data = r_up.json()
        assert "url" in data
