from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from starlette.responses import RedirectResponse
import uuid
import datetime
from app.api import deps
from app.core.config import settings
from app.core.crypto import encrypt_token
from app.models.video import Video, VideoStatusEnum
from app.models.creator import Creator, PlatformEnum
from app.services.sync_metrics import fetch_initial_metrics_task

router = APIRouter()

@router.get("/{platform}/authorize")
def authorize(platform: PlatformEnum, video_id: uuid.UUID, db: Session = Depends(deps.get_db)):
    """
    Generates OAuth url and redirects the creator to authenticate
    """
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video or video.platform != platform:
        raise HTTPException(status_code=404, detail="Video not found or platform mismatch")
    
    # Local mock approval URL; no external OAuth redirect needed.
    state = str(video_id)
    oauth_url = (
        f"{settings.BACKEND_URL}{settings.API_V1_STR}/oauth/"
        f"{platform.value}/callback?code=mock_code&state={state}"
    )
    
    return {"url": oauth_url} # Frontend redirects to this URL

@router.get("/{platform}/callback")
def oauth_callback(
    platform: PlatformEnum,
    state: str,
    code: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.get_db)
):
    """
    Handles OAuth callback, stores tokens in creators table,
    updates video status to approved, triggers metrics sync.
    """
    try:
        video_id = uuid.UUID(state)
        video = db.query(Video).filter(Video.id == video_id).first()
        if not video:
            raise ValueError()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid state parameter")
    
    if video.platform != platform:
        raise HTTPException(status_code=400, detail="Platform mismatch")

    # Mock token exchange
    access_token = encrypt_token(f"mock_access_token_{uuid.uuid4()}")
    refresh_token = encrypt_token(f"mock_refresh_token_{uuid.uuid4()}")
    platform_account_id = f"mock_{platform.value}_acc_{uuid.uuid4()}"

    # Upsert creator
    creator = db.query(Creator).filter(
        Creator.platform == platform,
        Creator.platform_account_id == platform_account_id
    ).first()

    if not creator:
        creator = Creator(
            platform=platform,
            platform_account_id=platform_account_id,
            access_token=access_token,
            refresh_token=refresh_token,
            token_expires_at=datetime.datetime.utcnow() + datetime.timedelta(days=1)
        )
        db.add(creator)
        db.commit()
        db.refresh(creator)
    else:
        creator.access_token = access_token
        creator.refresh_token = refresh_token
        creator.token_expires_at = datetime.datetime.utcnow() + datetime.timedelta(days=1)
        db.commit()

    # Update Video
    video.creator_id = creator.id
    video.status = VideoStatusEnum.approved
    db.commit()

    # Trigger background metric sync task
    background_tasks.add_task(fetch_initial_metrics_task, video.id)

    # Redirect to frontend success page
    # You would typically have a frontend route to handle the "success" state
    return RedirectResponse(url=f"{settings.FRONTEND_URL}/dashboard?sync_status=success")
