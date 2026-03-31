from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID

class UserCreate(BaseModel):
    email: EmailStr
    company_name: str


class UserLogin(BaseModel):
    email: EmailStr
    company_name: Optional[str] = "Independent Advertiser"

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    company_name: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
