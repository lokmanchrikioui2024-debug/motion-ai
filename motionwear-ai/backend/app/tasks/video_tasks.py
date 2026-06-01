from app.celery_app import celery
import time
import os
import sqlalchemy
from sqlalchemy.orm import sessionmaker
from app.models import Video


def _get_sync_engine():
    db_url = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./dev.db")
    # prefer sqlite sync engine when using aiosqlite in tests/dev
    if "sqlite" in db_url:
        sync_url = db_url.replace("+aiosqlite", "")
        return sqlalchemy.create_engine(sync_url, connect_args={"check_same_thread": False})
    # try to use sync driver for other DBs (postgres); fallback to sqlite file if unavailable
    try:
        sync_url = db_url.replace("+asyncpg", "")
        return sqlalchemy.create_engine(sync_url)
    except Exception:
        return sqlalchemy.create_engine("sqlite:///./dev.db", connect_args={"check_same_thread": False})


@celery.task(name="motionwear.process_video")
def process_video(video_id: int):
    # Simulate pipeline steps
    steps = ["remove_background", "detect_clothing", "place_on_mannequin", "animate", "render_mp4"]
    engine = _get_sync_engine()
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        v = session.query(Video).filter(Video.id == video_id).first()
        if v:
            v.status = "processing"
            session.add(v)
            session.commit()

        for i, s in enumerate(steps, start=1):
            print(f"Processing {s} for video {video_id}")
            time.sleep(1)
            # write intermediate status
            v = session.query(Video).filter(Video.id == video_id).first()
            if v:
                v.status = f"step:{s}"
                session.add(v)
                session.commit()

        # After processing, update the DB record status to done and set a placeholder path
        v = session.query(Video).filter(Video.id == video_id).first()
        if v:
            v.status = "done"
            v.path = f"s3://{os.getenv('S3_BUCKET','motionwear-assets')}/videos/video_{video_id}.mp4"
            session.add(v)
            session.commit()
    finally:
        session.close()

    return {"status": "done", "video_id": video_id}
