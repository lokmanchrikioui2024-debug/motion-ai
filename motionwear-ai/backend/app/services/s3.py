import os
import boto3
from botocore.client import Config

from app.core.config import settings


def get_s3_client():
    endpoint = os.getenv("S3_ENDPOINT") or settings.S3_ENDPOINT
    access_key = os.getenv("S3_ACCESS_KEY") or settings.S3_ACCESS_KEY
    secret_key = os.getenv("S3_SECRET_KEY") or settings.S3_SECRET_KEY
    if endpoint:
        return boto3.client(
            "s3",
            endpoint_url=endpoint,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            config=Config(signature_version="s3v4"),
        )
    return boto3.client("s3")


def upload_fileobj(fileobj, bucket: str, key: str, content_type: str = None):
    client = get_s3_client()
    extra_args = {}
    if content_type:
        extra_args["ContentType"] = content_type
    client.upload_fileobj(fileobj, bucket, key, ExtraArgs=extra_args)
    return f"{bucket}/{key}"


def generate_presigned_url(bucket: str, key: str, expires_in: int = 3600):
    # If no S3 configured, return a local path fallback for development/testing
    endpoint = os.getenv("S3_ENDPOINT") or settings.S3_ENDPOINT
    access_key = os.getenv("S3_ACCESS_KEY") or settings.S3_ACCESS_KEY
    if not endpoint and not access_key:
        return f"/uploads/{key}"
    client = get_s3_client()
    return client.generate_presigned_url(
        "get_object", Params={"Bucket": bucket, "Key": key}, ExpiresIn=expires_in
    )


def generate_presigned_post(bucket: str, key: str, expires_in: int = 3600):
    # If no S3 configured, return a local fallback to post to a dev endpoint
    endpoint = os.getenv("S3_ENDPOINT") or settings.S3_ENDPOINT
    access_key = os.getenv("S3_ACCESS_KEY") or settings.S3_ACCESS_KEY
    if not endpoint and not access_key:
        return {"url": "/api/assets/upload", "fields": {"key": key}}
    client = get_s3_client()
    return client.generate_presigned_post(Bucket=bucket, Key=key, ExpiresIn=expires_in)


def delete_object(bucket: str, key: str):
    client = get_s3_client()
    client.delete_object(Bucket=bucket, Key=key)
