from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.core import security
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(deps.get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    # Passwordless onboarding for now (placeholder hash kept for schema compatibility)
    hashed_password = security.get_passwordless_placeholder_hash(user_in.email)
    user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        company_name=user_in.company_name
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=Token)
def login_access_token(
    payload: UserLogin,
    db: Session = Depends(deps.get_db),
):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        user = User(
            email=payload.email,
            hashed_password=security.get_passwordless_placeholder_hash(payload.email),
            company_name=payload.company_name or "Independent Advertiser",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
