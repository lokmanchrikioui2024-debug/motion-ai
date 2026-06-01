import requests
import uuid
import os
import sys
import asyncio
from io import BytesIO

BASE = "http://127.0.0.1:8080"

email = f"test+{uuid.uuid4().hex}@example.com"
password = "testpassword"
print('Creating user directly in DB', email)
# create user directly (avoid bcrypt issues during script run)
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend'))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)
# ensure working directory matches backend so DB file paths align
os.chdir(backend_path)

from app.db.session import async_session
from app.models import User

import asyncio

async def create_user_db(email, pwd):
    async with async_session() as session:
        res = await session.execute(__import__('sqlalchemy').select(User).where(User.email == email))
        u = res.scalars().first()
        if u:
            return u
        user = User(email=email, hashed_password=pwd)
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

user = asyncio.get_event_loop().run_until_complete(create_user_db(email, password))
print('user id', getattr(user, 'id', None))

from app import crud
token = __import__('app.auth', fromlist=['create_access_token']).create_access_token(subject=str(user.id))
headers = {"Authorization": f"Bearer {token}"}

# presign
print('\nChecking presign...')
r = requests.get(BASE + "/api/assets/presign?filename=avatar.png", headers=headers)
print('/api/assets/presign', r.status_code, r.text)

# upload asset (multipart) - create small PNG-like content
print('\nUploading asset...')
img = BytesIO(b"\x89PNG\r\n\x1a\n" + b"0"*100)
files = {'file': ('avatar.png', img, 'image/png')}
r = requests.post(BASE + "/api/assets/upload", headers=headers, files=files)
print('/api/assets/upload', r.status_code, r.text)
if r.status_code != 200:
    print('Asset upload failed; aborting video test')
    sys.exit(1)
asset_id = r.json().get('id')

# create project directly in DB via backend package
print('\nCreating project in DB...')
# add backend to path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend'))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

import asyncio
from app.db.session import async_session
from app.models import Project, User

async def create_proj_for_user(email):
    async with async_session() as session:
        # find user
        res = await session.execute(__import__('sqlalchemy').select(User).where(User.email == email))
        user = res.scalars().first()
        if not user:
            print('User not found in DB')
            return None
        p = Project(name='AutoProject', owner_id=user.id)
        session.add(p)
        await session.commit()
        await session.refresh(p)
        return p.id

proj_id = asyncio.get_event_loop().run_until_complete(create_proj_for_user(email))
print('created project id', proj_id)

# generate video
print('\nGenerating video...')
payload = {"asset_id": asset_id, "project_id": proj_id}
r = requests.post(BASE + "/api/videos/generate", headers=headers, json=payload)
print('/api/videos/generate', r.status_code, r.text)
if r.status_code == 200:
    vid = r.json().get('video_id')
    print('Video queued id', vid)
    r2 = requests.get(BASE + f"/api/videos/{vid}", headers=headers)
    print('/api/videos/{vid}', r2.status_code, r2.text)

# analytics
print('\nAnalytics chart')
r = requests.get(BASE + '/api/analytics/chart', headers=headers)
print('/api/analytics/chart', r.status_code, r.text)

# billing create-checkout (best-effort)
print('\nAttempting create-checkout (may fail without STRIPE keys)')
try:
    r = requests.post(BASE + '/api/billing/create-checkout', headers=headers, json={"price_id": "price_test", "success_url": "https://example.com/success", "cancel_url": "https://example.com/cancel"})
    print('/api/billing/create-checkout', r.status_code, r.text)
except Exception as e:
    print('create-checkout error', e)

print('\nDone')
