from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
from app.db.database import Base, engine
from app.models import user, creator, video, video_metrics  # noqa: F401

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.on_event("startup")
def on_startup() -> None:
    if settings.AUTO_CREATE_TABLES:
        Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Welcome to AdSync Pro API"}
