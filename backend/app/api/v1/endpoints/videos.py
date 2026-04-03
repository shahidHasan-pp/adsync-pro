from typing import List
import asyncio
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.core.config import settings
from app.services.platform_clients import YouTubeService
from app.models.user import User
from app.models.video import Video, VideoStatusEnum
from app.models.creator import PlatformEnum
from app.models.video_metrics import VideoMetrics
from app.schemas.video import VideoCreate, VideoResponse, VideoMetricsResponse, VideoCreateResponse, YouTubePublicVideoResponse, YouTubeCompareResponse

router = APIRouter()

@router.post("/", response_model=VideoCreateResponse)
def create_video(
    *,
    db: Session = Depends(deps.get_db),
    video_in: VideoCreate,
    current_user: User = Depends(deps.get_current_user)
):
    video = Video(
        advertiser_id=current_user.id,
        platform=video_in.platform,
        platform_video_id=video_in.platform_video_id,
        status=VideoStatusEnum.pending
    )
    db.add(video)
    db.commit()
    db.refresh(video)
    oauth_url = (
        f"{settings.API_V1_STR}/oauth/{video.platform.value}/authorize?video_id={video.id}"
    )
    creator_oauth_url = f"{settings.BACKEND_URL}{oauth_url}"
    return {"video": video, "creator_oauth_url": creator_oauth_url}

@router.get("/", response_model=List[VideoResponse])
def read_videos(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user)
):
    videos = db.query(Video).filter(Video.advertiser_id == current_user.id).offset(skip).limit(limit).all()
    return videos

@router.get("/{video_id}", response_model=VideoResponse)
def read_video(
    video_id: UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    video = db.query(Video).filter(Video.id == video_id, Video.advertiser_id == current_user.id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video

@router.get("/{video_id}/metrics", response_model=VideoMetricsResponse)
def read_video_metrics(
    video_id: UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    video = db.query(Video).filter(Video.id == video_id, Video.advertiser_id == current_user.id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    metrics = (
        db.query(VideoMetrics)
        .filter(VideoMetrics.video_id == video_id)
        .order_by(VideoMetrics.fetched_at.desc())
        .first()
    )
    if not metrics:
        raise HTTPException(status_code=404, detail="Metrics not found")
    
    return metrics


@router.get("/{video_id}/youtube-public", response_model=YouTubePublicVideoResponse)
def read_youtube_public_video_details(
    video_id: UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    video = db.query(Video).filter(Video.id == video_id, Video.advertiser_id == current_user.id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    if video.platform != PlatformEnum.youtube:
        raise HTTPException(status_code=400, detail="This endpoint supports YouTube videos only")

    if not settings.YOUTUBE_API_KEY:
        raise HTTPException(status_code=500, detail="YOUTUBE_API_KEY is not configured")

    service = YouTubeService()
    try:
        payload = asyncio.run(service.fetch_public_video_details(settings.YOUTUBE_API_KEY, video.platform_video_id))
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception:
        raise HTTPException(status_code=502, detail="Failed to fetch public YouTube video details")

    return payload


@router.get("/youtube/public", response_model=YouTubePublicVideoResponse)
def get_youtube_public_by_video_id(
    video_id: str,
    current_user: User = Depends(deps.get_current_user)
):
    if not settings.YOUTUBE_API_KEY:
        raise HTTPException(status_code=500, detail="YOUTUBE_API_KEY is not configured")

    service = YouTubeService()
    try:
        payload = asyncio.run(service.fetch_public_video_details(settings.YOUTUBE_API_KEY, video_id))
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception:
        raise HTTPException(status_code=502, detail="Failed to fetch YouTube video details")
    return payload


@router.get("/youtube/compare", response_model=YouTubeCompareResponse)
def compare_two_youtube_videos(
    video_id_1: str,
    video_id_2: str,
    current_user: User = Depends(deps.get_current_user)
):
    if not settings.YOUTUBE_API_KEY:
        raise HTTPException(status_code=500, detail="YOUTUBE_API_KEY is not configured")

    service = YouTubeService()
    try:
        first = asyncio.run(service.fetch_public_video_details(settings.YOUTUBE_API_KEY, video_id_1))
        second = asyncio.run(service.fetch_public_video_details(settings.YOUTUBE_API_KEY, video_id_2))
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception:
        raise HTTPException(status_code=502, detail="Failed to compare YouTube videos")

    return {"first": first, "second": second}
