import os
import re
import json
import uuid
import base64
from pathlib import Path
from typing import Optional
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app import models, schemas

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def save_base64_image(image_data: str, prefix: str = "photo") -> str:
    """If image_data is a base64 Data URL, decode it, save to disk in uploads/, and return the /uploads/... path."""
    if not image_data or not isinstance(image_data, str):
        return image_data

    # Check if it is a base64 data URI
    match = re.match(r"^data:image\/([a-zA-Z0-9\+\-]+);base64,(.+)$", image_data)
    if not match:
        # Already a relative path or external URL
        return image_data

    ext = match.group(1).lower()
    if ext == "jpeg":
        ext = "jpg"
    elif ext == "svg+xml":
        ext = "svg"

    b64_str = match.group(2)
    try:
        binary_data = base64.b64decode(b64_str)
    except Exception as e:
        print(f"Error decoding base64 image: {e}")
        return image_data

    safe_prefix = re.sub(r"[^a-zA-Z0-9_\-]", "_", prefix)
    filename = f"{safe_prefix}_{uuid.uuid4().hex[:10]}.{ext}"
    filepath = UPLOAD_DIR / filename

    try:
        with open(filepath, "wb") as f:
            f.write(binary_data)
        return f"/uploads/{filename}"
    except Exception as e:
        print(f"Error writing image to disk: {e}")
        return image_data


DEFAULT_CONTENT = {
    "now_playing_title": "Happy Birthday Dhanya — A Cinematic Experience",
    "intro_main_title": "Happy Birthday",
    "intro_main_subtitle": "Dhanya 👑✨",
    "hero_title": "Celebrating Our",
    "hero_subtitle": "Dearest Dhanya",
    "hero_body": "Some people bring a light so bright to the world that everything around them sparkles. Dhanya, your laughter, your kindness, and your unstoppable energy make every day an extraordinary story. Today is all about celebrating you!",
    "scene_1_title": "The Beginning of Our Story",
    "scene_1_body": "Every unforgettable story starts with a simple hello. Little did we know that day would spark a bond filled with endless smiles, spontaneous laughs, and memories that last a lifetime.",
    "scene_1_caption": "\"And just like that, you made life a million times brighter...\"",
    "interlude_1_quote": "\"Not all treasures are made of gold — the purest ones are made of your laughter, loyalty, and heart of gold.\"",
    "interlude_1_attr": "— Written with endless love for Dhanya",
    "scene_2_title": "Endless Laughs & Crazy Fun",
    "scene_2_body": "You have that rare, magical superpower of turning the simplest ordinary day into a cinematic comedy adventure. No one makes me laugh harder than you do!",
    "scene_2_caption": "\"Every candid snapshot tells a thousand happy stories...\"",
    "scene_3_title": "Adventures with Dhanya",
    "scene_3_body": "Every journey, every unplanned detour, and every late-night conversation is ten times better with you. You make every milestone an unforgettable memory.",
    "scene_3_caption": "\"Here is to all our past adventures... and the countless ones waiting ahead!\"",
    "scene_4_title": "Cherished Forever",
    "scene_4_body": "Through every twist and turn of life, you have remained a true, constant ray of sunshine. Thank you for being such an extraordinary friend and genuine inspiration.",
    "scene_4_caption": "\"Dhanya — a truly rare, golden soul in this world.\"",
    "interlude_2_quote": "\"May your life be filled with everlasting melodies and joy.\"",
    "interlude_2_attr": "— Always with you, today and forever",
    "secret_letter_head": "Dearest Dhanya,",
    "secret_letter_sign": "— Forever your best friend & biggest cheerleader ✨",
    "finale_script": "Happy Birthday to the most amazing, radiant Dhanya!\nThank you for every smile, every memory,\nand every golden moment you bring into our lives.",
    "video_title": "A Cinematic Premiere for Dhanya",
    "video_subtitle": "Every frame a cherished treasure, every moment unforgettable",
    "video_url": "/uploads/InShot_20260906_183316810.mp4",
    "credits_presenter": "A Very Proud & Grateful Best Friend",
    "credits_star": "Dhanya — The Birthday Queen 👑",
    "credits_director": "Crafted with Love for Dhanya",
}

DEFAULT_WISHES = [
    {"author": "Your Best Friend", "message": "Happy Birthday to the most incredible soul! May this year be pure magic ✨", "is_pink": False},
    {"author": "A Grateful Heart", "message": "Thank you for bringing so much light and laughter into this world 🌟", "is_pink": True},
    {"author": "Forever Friend", "message": "Here's to a lifetime of adventures, late night talks, and inside jokes! 💛", "is_pink": False},
    {"author": "Your Biggest Fan", "message": "You deserve every ounce of happiness in the entire universe today! 🎂", "is_pink": True},
]

DEFAULT_PINS = [
    {"title": "Where We First Met", "subtitle": "The day a great friendship was born", "pos_x": 49.0, "pos_y": 42.0, "category": "milestone"},
    {"title": "That Crazy Trip", "subtitle": "We still laugh about this one", "pos_x": 23.0, "pos_y": 48.0, "category": "trip"},
    {"title": "Our Late Night Spot", "subtitle": "Talking about everything and nothing", "pos_x": 68.0, "pos_y": 38.0, "category": "special"},
    {"title": "Dream Destination", "subtitle": "We're going here one day", "pos_x": 82.0, "pos_y": 55.0, "category": "dream"},
    {"title": "The Special Memory", "subtitle": "I'll never forget this place", "pos_x": 38.0, "pos_y": 60.0, "category": "special"},
]

DEFAULT_SECRET_WORDS = ["birthday", "happy birthday", "love", "friend", "magic", "dhanya"]
DEFAULT_SECRET_LETTER = """Today, on your birthday, I want you to know something important — something I don't say nearly enough.

You have changed my life in ways that words can barely capture. Your kindness, your laughter, your incredible spirit... they make the world a genuinely better place. Every single day.

From the very first moment we became friends, I knew there was something extraordinary about you. And time has only confirmed what I suspected — you are one of the most beautiful souls I have ever had the privilege of knowing.

So on this special day, I want you to feel celebrated, cherished, and endlessly loved. Because you deserve every single bit of happiness the universe can offer.

Thank you for being exactly who you are. Happy Birthday, my dearest friend. 🌟"""


def init_db_seeds(db: Session):
    """Seed initial content, pins, and secret config if not present."""
    # Seed Content
    for key, value in DEFAULT_CONTENT.items():
        existing = db.query(models.DirectorContent).filter(models.DirectorContent.key == key).first()
        if not existing:
            db.add(models.DirectorContent(key=key, value=value))

    # Seed Wishes
    if db.query(models.Wish).count() == 0:
        for w in DEFAULT_WISHES:
            db.add(models.Wish(author=w["author"], message=w["message"], is_pink=w["is_pink"]))

    # Seed Map Pins
    if db.query(models.MemoryPin).count() == 0:
        for pin in DEFAULT_PINS:
            db.add(models.MemoryPin(**pin))

    # Seed Secret Config
    if db.query(models.SecretConfig).count() == 0:
        db.add(models.SecretConfig(
            secret_words=json.dumps(DEFAULT_SECRET_WORDS),
            letter_heading="My Dearest Friend,",
            letter_body=DEFAULT_SECRET_LETTER,
            letter_sign="— Forever yours ✨"
        ))

    db.commit()


# Content CRUD
def get_all_content(db: Session) -> dict:
    rows = db.query(models.DirectorContent).all()
    result = dict(DEFAULT_CONTENT)
    for r in rows:
        result[r.key] = r.value
    return result


def update_bulk_content(db: Session, content_dict: dict):
    for key, value in content_dict.items():
        item = db.query(models.DirectorContent).filter(models.DirectorContent.key == key).first()
        if item:
            item.value = value
        else:
            db.add(models.DirectorContent(key=key, value=value))
    db.commit()
    return get_all_content(db)


# Wishes CRUD
def get_wishes(db: Session, limit: int = 50):
    return db.query(models.Wish).order_by(models.Wish.created_at.desc()).limit(limit).all()


def create_wish(db: Session, wish_data: schemas.WishCreate):
    wish = models.Wish(
        author=wish_data.author or "Anonymous",
        message=wish_data.message,
        is_pink=wish_data.is_pink or False
    )
    db.add(wish)
    db.commit()
    db.refresh(wish)
    return wish


def delete_wish(db: Session, wish_id: int):
    wish = db.query(models.Wish).filter(models.Wish.id == wish_id).first()
    if not wish:
        return False
    db.delete(wish)
    db.commit()
    return True


# Photos CRUD
def get_all_photos(db: Session):
    return db.query(models.MemoryPhoto).all()


def save_or_update_photo(db: Session, photo_data: schemas.PhotoUpload):
    # Save image to physical file in /uploads/ if base64
    saved_url = save_base64_image(photo_data.image_url, prefix=f"photo_{photo_data.slot_id}")
    
    photo = db.query(models.MemoryPhoto).filter(models.MemoryPhoto.slot_id == photo_data.slot_id).first()
    if photo:
        photo.image_url = saved_url
        if photo_data.caption is not None:
            photo.caption = photo_data.caption
        if photo_data.filter_style is not None:
            photo.filter_style = photo_data.filter_style
    else:
        photo = models.MemoryPhoto(
            slot_id=photo_data.slot_id,
            image_url=saved_url,
            caption=photo_data.caption,
            filter_style=photo_data.filter_style or "none"
        )
        db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo


async def save_uploaded_photo_file(
    db: Session,
    slot_id: str,
    file: UploadFile,
    caption: Optional[str] = None,
    filter_style: Optional[str] = "none"
):
    ext = file.filename.split(".")[-1].lower() if file.filename and "." in file.filename else "jpg"
    safe_prefix = re.sub(r"[^a-zA-Z0-9_\-]", "_", f"photo_{slot_id}")
    filename = f"{safe_prefix}_{uuid.uuid4().hex[:10]}.{ext}"
    filepath = UPLOAD_DIR / filename

    contents = await file.read()
    with open(filepath, "wb") as f:
        f.write(contents)

    image_url = f"/uploads/{filename}"
    photo = db.query(models.MemoryPhoto).filter(models.MemoryPhoto.slot_id == slot_id).first()
    if photo:
        photo.image_url = image_url
        if caption is not None:
            photo.caption = caption
        if filter_style is not None:
            photo.filter_style = filter_style
    else:
        photo = models.MemoryPhoto(
            slot_id=slot_id,
            image_url=image_url,
            caption=caption,
            filter_style=filter_style or "none"
        )
        db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo


# Pins CRUD
def get_all_pins(db: Session):
    return db.query(models.MemoryPin).all()


def create_pin(db: Session, pin_data: schemas.MemoryPinCreate):
    pin = models.MemoryPin(**pin_data.dict())
    db.add(pin)
    db.commit()
    db.refresh(pin)
    return pin


# Secret Verification
def verify_secret_code(db: Session, code: str):
    config = db.query(models.SecretConfig).first()
    if not config:
        allowed = DEFAULT_SECRET_WORDS
        letter_h = "My Dearest Friend,"
        letter_b = DEFAULT_SECRET_LETTER
        letter_s = "— Forever yours ✨"
    else:
        allowed = json.loads(config.secret_words)
        letter_h = config.letter_heading
        letter_b = config.letter_body
        letter_s = config.letter_sign

    norm = code.strip().lower()
    if any(w in norm for w in allowed) or norm in allowed:
        return schemas.SecretVerifyResponse(
            success=True,
            letter_heading=letter_h,
            letter_body=letter_b,
            letter_sign=letter_s,
            message="Secret unlocked!"
        )
    return schemas.SecretVerifyResponse(
        success=False,
        message="Not quite... try again, dear friend 💫"
    )


# Share Cards CRUD
def save_share_card(db: Session, card_data: schemas.ShareCardCreate):
    saved_preview = None
    if card_data.image_preview:
        saved_preview = save_base64_image(card_data.image_preview, prefix=f"card_{card_data.recipient_name[:12]}")
    
    card_dict = card_data.dict()
    card_dict["image_preview"] = saved_preview
    card = models.ShareCardGreeting(**card_dict)
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


def get_share_cards(db: Session, limit: int = 20):
    return db.query(models.ShareCardGreeting).order_by(models.ShareCardGreeting.created_at.desc()).limit(limit).all()
