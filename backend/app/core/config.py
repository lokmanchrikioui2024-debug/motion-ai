import os
from pydantic import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "MotionWear AI API"
    DEBUG: bool = True
    SQLALCHEMY_DATABASE_URI: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@db:5432/motionwear")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    JWT_SECRET: str = os.getenv("JWT_SECRET", "please-change-me")
    JWT_ALGORITHM: str = "HS256"
    S3_ENDPOINT: str = os.getenv("S3_ENDPOINT", "")
    S3_ACCESS_KEY: str = os.getenv("S3_ACCESS_KEY", "")
    S3_SECRET_KEY: str = os.getenv("S3_SECRET_KEY", "")


settings = Settings()