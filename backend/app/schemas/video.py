from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime
from app.models.creator import PlatformEnum
from app.models.video import VideoStatusEnum

class VideoCreate(BaseModel):
    platform: PlatformEnum
    platform_video_id: str

class VideoResponse(BaseModel):
    id: UUID
    advertiser_id: UUID
    creator_id: Optional[UUID] = None
    platform: PlatformEnum
    platform_video_id: str
    status: VideoStatusEnum
    title: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class VideoCreateResponse(BaseModel):
    video: VideoResponse
    creator_oauth_url: str


class VideoMetricsResponse(BaseModel):
    id: UUID
    video_id: UUID
    total_views: int
    unique_viewers: int
    engagement_rate: float
    avg_watch_time_seconds: int
    demographics: Optional[Dict[str, Any]] = None
    retention_curve: Optional[List[Any]] = None
    fetched_at: datetime

    class Config:
        from_attributes = True
