from fastapi import APIRouter
from app.api.v1.endpoints import auth, videos, oauth

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(videos.router, prefix="/videos", tags=["videos"])
api_router.include_router(oauth.router, prefix="/oauth", tags=["oauth"])
