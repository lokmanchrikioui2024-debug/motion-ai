from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
import sys

# If asyncpg isn't available (e.g., on Windows dev without build tools),
# fall back to a local sqlite+aiosqlite DB to allow running the app/tests.
db_uri = settings.SQLALCHEMY_DATABASE_URI
try:
    # only attempt to import asyncpg if PostgreSQL URI is configured
    if db_uri.startswith("postgresql"):
        import asyncpg  # type: ignore
except Exception:
    # fallback to sqlite async for local development
    db_uri = "sqlite+aiosqlite:///./dev.db"

engine = create_async_engine(db_uri, echo=False)

async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

__all__ = ["engine", "async_session"]