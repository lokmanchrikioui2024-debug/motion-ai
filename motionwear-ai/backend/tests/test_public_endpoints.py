import asyncio
import sys
import os
import pytest
from httpx import AsyncClient


sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


@pytest.mark.asyncio
async def test_public_endpoints_return_200():
    from app.main import app
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r1 = await ac.get("/api/subscriptions/plans")
        assert r1.status_code == 200
        r2 = await ac.get("/api/testimonials")
        assert r2.status_code == 200
        r3 = await ac.get("/api/faqs")
        assert r3.status_code == 200
        r4 = await ac.get("/")
        assert r4.status_code == 200
