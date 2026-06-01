import os
from celery import Celery
from app.core.config import settings

celery = Celery(
    "motionwear",
    broker=os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0"),
)

celery.conf.update(result_backend=os.getenv("CELERY_RESULT_BACKEND", "redis://redis:6379/1"))
