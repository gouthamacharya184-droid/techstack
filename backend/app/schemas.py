from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


# Director Mode Content Schemas
class ContentItem(BaseModel):
    key: str
    value: str


class ContentBulkUpdate(BaseModel):
    content: Dict[str, str]


class ContentResponse(BaseModel):
    content: Dict[str, str]


# Wish Schemas
class WishCreate(BaseModel):
    author: Optional[str] = "Anonymous"
    message: str = Field(..., min_length=1, max_length=150)
    is_pink: Optional[bool] = False


class WishResponse(BaseModel):
    id: int
    author: str
    message: str
    is_pink: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Photo Schemas
class PhotoUpload(BaseModel):
    slot_id: str
    image_url: str
    caption: Optional[str] = None
    filter_style: Optional[str] = "none"


class PhotoResponse(BaseModel):
    id: int
    slot_id: str
    image_url: str
    caption: Optional[str]
    filter_style: str
    updated_at: datetime

    class Config:
        from_attributes = True


# Memory Pin Schemas
class MemoryPinCreate(BaseModel):
    title: str
    subtitle: str
    pos_x: float
    pos_y: float
    category: Optional[str] = "shared"


class MemoryPinResponse(BaseModel):
    id: int
    title: str
    subtitle: str
    pos_x: float
    pos_y: float
    category: str
    created_at: datetime

    class Config:
        from_attributes = True


# Secret Schemas
class SecretVerifyRequest(BaseModel):
    code: str


class SecretVerifyResponse(BaseModel):
    success: bool
    letter_heading: Optional[str] = None
    letter_body: Optional[str] = None
    letter_sign: Optional[str] = None
    message: Optional[str] = None


# Share Card Schemas
class ShareCardCreate(BaseModel):
    recipient_name: str
    theme_index: int = 0
    message: Optional[str] = None
    image_preview: Optional[str] = None


class ShareCardResponse(BaseModel):
    id: int
    recipient_name: str
    theme_index: int
    message: Optional[str]
    image_preview: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
