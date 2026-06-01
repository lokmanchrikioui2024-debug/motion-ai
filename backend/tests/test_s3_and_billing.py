import sys
import os
import pytest
from httpx import AsyncClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


@pytest.mark.asyncio
async def test_presign_and_billing_webhook():
    from app.main import app
    from app.api.dependencies import get_current_user
    from app.db.session import engine
    from app.db.base import Base

    # ensure DB tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # override auth
    class DummyUser:
        def __init__(self):
            self.id = 1
            self.email = "test@example.com"

    app.dependency_overrides[get_current_user] = lambda: DummyUser()

    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.get('/api/assets/presign?filename=avatar.png')
        assert r.status_code == 200
        data = r.json()
        assert "url" in data and "fields" in data

        # Simulate a Stripe webhook payload (no signature)
        payload = {
            "type": "invoice.payment_succeeded",
            "data": {"object": {"amount_paid": 5000, "currency": "usd", "customer_email": "test@example.com"}}
        }
        r2 = await ac.post('/api/billing/webhook', json=payload)
        assert r2.status_code == 200
        assert r2.json().get('status') == 'received'
