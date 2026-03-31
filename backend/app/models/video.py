from sqlalchemy import Column, String, Enum, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum
from app.db.database import Base
from app.models.creator import PlatformEnum

class VideoStatusEnum(str, enum.Enum):
    pending = 'pending'
    approved = 'approved'
    failed = 'failed'

class Video(Base):
    __tablename__ = "videos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    advertiser_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    creator_id = Column(UUID(as_uuid=True), ForeignKey("creators.id"), nullable=True)
    platform = Column(Enum(PlatformEnum), nullable=False)
    platform_video_id = Column(String, nullable=False)
    status = Column(Enum(VideoStatusEnum), default=VideoStatusEnum.pending, nullable=False)
    title = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    advertiser = relationship("User", back_populates="videos")
    creator = relationship("Creator", back_populates="videos")
    metrics = relationship("VideoMetrics", back_populates="video", uselist=False)
