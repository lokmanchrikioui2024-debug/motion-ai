# MotionWear AI - Backend

Quickstart (development):

1. Create a Python virtualenv and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

2. Start Postgres and Redis (docker-compose):

```bash
docker-compose up -d db redis
```

3. Run the backend:

```bash
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8080
```
