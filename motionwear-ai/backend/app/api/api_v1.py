from fastapi import APIRouter
from app.api.endpoints import auth, users, projects, assets, videos, subscriptions, analytics, oauth, billing, templates, public

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(oauth.router, prefix="/auth/oauth", tags=["oauth"])
api_router.include_router(billing.router, prefix="/billing", tags=["billing"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(assets.router, prefix="/assets", tags=["assets"])
api_router.include_router(videos.router, prefix="/videos", tags=["videos"])
api_router.include_router(subscriptions.router, prefix="/subscriptions", tags=["subscriptions"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(templates.router, prefix="/templates", tags=["templates"])
# public contains testimonials, faqs, notifications exposed at /api/testimonials etc.
api_router.include_router(public.router, prefix="", tags=["public"])
