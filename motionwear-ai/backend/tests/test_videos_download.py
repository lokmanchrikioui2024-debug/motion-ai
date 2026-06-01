import asyncio
import os
import sys
import uuid
import pytest

# ensure backend package importable
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from app.db.session import async_session
from io import BytesIO
import requests

BASE = "http://127.0.0.1:8080"


@pytest.mark.asyncio
async def test_video_download_presign():
    email = f"test+{uuid.uuid4().hex}@example.com"
    password = "testpass"
    # register user via API
    r = requests.post(BASE + "/api/auth/register", json={"email": email, "password": password}, timeout=10)
    assert r.status_code == 200
    # login to get token
    r = requests.post(BASE + "/api/auth/login", json={"email": email, "password": password}, timeout=10)
    assert r.status_code == 200
    token = r.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}

    # presign and upload a small asset
    r = requests.get(BASE + "/api/assets/presign?filename=avatar.png", headers=headers, timeout=10)
    assert r.status_code == 200
    files = {'file': ('avatar.png', BytesIO(b"\x89PNG\r\n\x1a\n" + b"0"*100), 'image/png')}
    r = requests.post(BASE + "/api/assets/upload", headers=headers, files=files, timeout=10)
    assert r.status_code == 200
    asset_id = r.json().get('id')

    # create project via API
    r = requests.post(BASE + "/api/projects", headers=headers, json={"name": "DLProject"}, timeout=10)
    assert r.status_code == 200
    proj_id = r.json().get('id')

    # generate video
    r = requests.post(BASE + "/api/videos/generate", headers=headers, json={"asset_id": asset_id, "project_id": proj_id}, timeout=10)
    assert r.status_code == 200
    vid = r.json().get('video_id')

    # poll for completion
    for _ in range(10):
        r = requests.get(BASE + f"/api/videos/{vid}", headers=headers, timeout=10)
        if r.status_code == 200 and r.json().get('status') == 'done':
            break
        await asyncio.sleep(0.5)

    r = requests.get(BASE + f"/api/videos/{vid}/download", headers=headers, timeout=10)
    print('DEBUG RESPONSE:', r.status_code, r.text)
    assert r.status_code == 200
    data = r.json()
    assert "url" in data
