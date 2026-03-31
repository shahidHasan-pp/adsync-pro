from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
from app.db.database import Base

class VideoMetrics(Base):
    __tablename__ = "video_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    video_id = Column(UUID(as_uuid=True), ForeignKey("videos.id"), unique=True, nullable=False)
    total_views = Column(Integer, default=0)
    unique_viewers = Column(Integer, default=0)
    engagement_rate = Column(Float, default=0.0)
    avg_watch_time_seconds = Column(Integer, default=0)
    demographics = Column(JSONB, nullable=True) # e.g., {"18-24": 45, "25-34": 30}
    retention_curve = Column(JSONB, nullable=True) # Array of data points
    fetched_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    video = relationship("Video", back_populates="metrics")
