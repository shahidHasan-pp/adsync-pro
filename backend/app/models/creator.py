from sqlalchemy import Column, String, Enum, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum
from app.db.database import Base

class PlatformEnum(str, enum.Enum):
    youtube = 'youtube'
    facebook = 'facebook'
    tiktok = 'tiktok'

class Creator(Base):
    __tablename__ = "creators"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    platform = Column(Enum(PlatformEnum), nullable=False)
    platform_account_id = Column(String, nullable=False)
    access_token = Column(String, nullable=False)  # Encrypted in real-world
    refresh_token = Column(String, nullable=True)  # Encrypted in real-world
    token_expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    videos = relationship("Video", back_populates="creator")
