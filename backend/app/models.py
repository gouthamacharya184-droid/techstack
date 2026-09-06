from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime
from app.database import Base


class DirectorContent(Base):
    __tablename__ = "director_content"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, index=True, nullable=False)
    value = Column(Text, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Wish(Base):
    __tablename__ = "wishes"

    id = Column(Integer, primary_key=True, index=True)
    author = Column(String(100), default="Anonymous")
    message = Column(String(200), nullable=False)
    is_pink = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class MemoryPhoto(Base):
    __tablename__ = "memory_photos"

    id = Column(Integer, primary_key=True, index=True)
    slot_id = Column(String(100), unique=True, index=True, nullable=False)  # e.g., 'scene_1', 'gallery_0', 'polaroid_2'
    image_url = Column(Text, nullable=False)  # Data URL / base64 or file path
    caption = Column(Text, nullable=True)
    filter_style = Column(String(100), default="none")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class MemoryPin(Base):
    __tablename__ = "memory_pins"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    subtitle = Column(String(250), nullable=False)
    pos_x = Column(Float, nullable=False)  # Percentage X e.g. 26.0
    pos_y = Column(Float, nullable=False)  # Percentage Y e.g. 38.0
    category = Column(String(50), default="shared")  # 'shared', 'dream', 'special'
    created_at = Column(DateTime, default=datetime.utcnow)


class SecretConfig(Base):
    __tablename__ = "secret_config"

    id = Column(Integer, primary_key=True, index=True)
    secret_words = Column(Text, nullable=False)  # JSON or comma-separated
    letter_heading = Column(String(200), nullable=False)
    letter_body = Column(Text, nullable=False)
    letter_sign = Column(String(200), nullable=False)


class ShareCardGreeting(Base):
    __tablename__ = "share_cards"

    id = Column(Integer, primary_key=True, index=True)
    recipient_name = Column(String(150), nullable=False)
    theme_index = Column(Integer, default=0)
    message = Column(Text, nullable=True)
    image_preview = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
