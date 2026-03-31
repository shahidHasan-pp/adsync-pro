from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.core.config import settings
from app.models.user import User
from app.models.video import Video, VideoStatusEnum
from app.models.video_metrics import VideoMetrics
from app.schemas.video import VideoCreate, VideoResponse, VideoMetricsResponse, VideoCreateResponse

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
