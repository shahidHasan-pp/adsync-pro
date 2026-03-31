import asyncio
import datetime
from uuid import UUID
from app.core.crypto import decrypt_token
from app.db.database import SessionLocal
from app.models.creator import PlatformEnum
from app.models.video import Video
from app.models.video_metrics import VideoMetrics
from app.services.platform_clients import YouTubeService, FacebookService, TikTokService

def fetch_initial_metrics_task(video_id: UUID):
    """
    Background task to fetch initial metrics after OAuth success.
    Currently mocks the actual external API call.
    """
    db = SessionLocal()
    try:
        video = db.query(Video).filter(Video.id == video_id).first()
        if not video or not video.creator:
            return

        access_token = decrypt_token(video.creator.access_token)
        platform = video.platform

        async def _collect() -> tuple[dict, str | None]:
            if platform == PlatformEnum.youtube:
                yt = YouTubeService()
                metrics_payload = await yt.fetch_metrics(access_token, video.platform_video_id)
                title = await yt.fetch_video_title(access_token, video.platform_video_id)
                return metrics_payload, title
            if platform == PlatformEnum.facebook:
                fb = FacebookService()
                metrics_payload = await fb.fetch_metrics(access_token, video.platform_video_id)
                return metrics_payload, None
            tt = TikTokService()
            metrics_payload = await tt.fetch_metrics(access_token, video.platform_video_id)
            return metrics_payload, None

        payload, maybe_title = asyncio.run(_collect())

        metrics = db.query(VideoMetrics).filter(VideoMetrics.video_id == video_id).first()
        if not metrics:
            metrics = VideoMetrics(video_id=video_id)
            db.add(metrics)

        metrics.total_views = int(payload["total_views"])
        metrics.unique_viewers = int(payload["unique_viewers"])
        metrics.engagement_rate = float(payload["engagement_rate"])
        metrics.avg_watch_time_seconds = int(payload["avg_watch_time_seconds"])
        metrics.demographics = payload["demographics"]
        metrics.retention_curve = payload["retention_curve"]
        metrics.fetched_at = datetime.datetime.utcnow()

        if maybe_title:
            video.title = maybe_title
        elif not video.title:
            video.title = f"{video.platform.value.title()} Video {video.platform_video_id}"

        db.commit()
    except Exception as e:
        print(f"Error fetching metrics for video {video_id}: {e}")
        db.rollback()
    finally:
        db.close()
