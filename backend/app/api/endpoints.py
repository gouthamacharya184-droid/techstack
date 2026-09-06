from typing import List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from app import schemas, crud
from app.database import get_db

router = APIRouter(prefix="/api")


@router.get("/health")
def health_check():
    return {"status": "ok", "service": "Cinematic Birthday API", "version": "1.0.0"}


# Director Mode Content Endpoints
@router.get("/content", response_model=Dict[str, str])
def get_content(db: Session = Depends(get_db)):
    return crud.get_all_content(db)


@router.put("/content", response_model=Dict[str, str])
def update_content(payload: schemas.ContentBulkUpdate, db: Session = Depends(get_db)):
    return crud.update_bulk_content(db, payload.content)


# Wishes Endpoints
@router.get("/wishes", response_model=List[schemas.WishResponse])
def get_wishes(limit: int = 50, db: Session = Depends(get_db)):
    return crud.get_wishes(db, limit=limit)


@router.post("/wishes", response_model=schemas.WishResponse, status_code=status.HTTP_201_CREATED)
def create_wish(wish: schemas.WishCreate, db: Session = Depends(get_db)):
    return crud.create_wish(db, wish)


@router.delete("/wishes/{wish_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_wish(wish_id: int, db: Session = Depends(get_db)):
    success = crud.delete_wish(db, wish_id)
    if not success:
        raise HTTPException(status_code=404, detail="Wish not found")
    return None


# Memory Photos Endpoints
@router.get("/photos", response_model=List[schemas.PhotoResponse])
def get_photos(db: Session = Depends(get_db)):
    return crud.get_all_photos(db)


@router.post("/photos/upload", response_model=schemas.PhotoResponse)
def upload_photo(payload: schemas.PhotoUpload, db: Session = Depends(get_db)):
    return crud.save_or_update_photo(db, payload)


@router.post("/photos/upload-file", response_model=schemas.PhotoResponse)
async def upload_photo_file(
    slot_id: str = Form(...),
    caption: Optional[str] = Form(None),
    filter_style: Optional[str] = Form("none"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    return await crud.save_uploaded_photo_file(db, slot_id, file, caption, filter_style)


# Memory Map Pins Endpoints
@router.get("/map-pins", response_model=List[schemas.MemoryPinResponse])
def get_pins(db: Session = Depends(get_db)):
    return crud.get_all_pins(db)


@router.post("/map-pins", response_model=schemas.MemoryPinResponse, status_code=status.HTTP_201_CREATED)
def create_pin(pin: schemas.MemoryPinCreate, db: Session = Depends(get_db)):
    return crud.create_pin(db, pin)


# Secret Verification Endpoint
@router.post("/secret/verify", response_model=schemas.SecretVerifyResponse)
def verify_secret(payload: schemas.SecretVerifyRequest, db: Session = Depends(get_db)):
    return crud.verify_secret_code(db, payload.code)


# Share Cards Endpoints
@router.get("/cards", response_model=List[schemas.ShareCardResponse])
def get_cards(limit: int = 20, db: Session = Depends(get_db)):
    return crud.get_share_cards(db, limit=limit)


@router.post("/cards/save", response_model=schemas.ShareCardResponse, status_code=status.HTTP_201_CREATED)
def save_card(card: schemas.ShareCardCreate, db: Session = Depends(get_db)):
    return crud.save_share_card(db, card)
