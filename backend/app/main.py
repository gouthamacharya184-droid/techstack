import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base, SessionLocal
from app.crud import init_db_seeds
from app.api.endpoints import router as api_router

# Define uploads and media directories in the backend root, or /tmp for serverless Vercel uploads
BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_DIR = BASE_DIR / "media"
if os.getenv("VERCEL"):
    UPLOAD_DIR = Path("/tmp/uploads")
else:
    UPLOAD_DIR = BASE_DIR / "uploads"

try:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
except OSError:
    pass

try:
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)
except OSError:
    pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    Base.metadata.create_all(bind=engine)
    # Seed default content
    db = SessionLocal()
    try:
        init_db_seeds(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Happy Birthday — A Cinematic Experience API",
    description="Backend API for managing story content, live wishes, memory photos, map pins, and share cards",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration — supports both ALLOWED_ORIGINS and CORS_ORIGINS
raw_origins = os.getenv("ALLOWED_ORIGINS") or os.getenv("CORS_ORIGINS") or "*"
ALLOWED_ORIGINS = [orig.strip() for orig in raw_origins.split(",") if orig.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Authorization"],
)

# Mount static files directories for user uploads and backend media assets
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
# Mount /media for migrated static assets: photos, images, videos served by backend
app.mount("/media", StaticFiles(directory=str(MEDIA_DIR)), name="media")

app.include_router(api_router)


@app.get("/")
def root():
    return {
        "message": "Happy Birthday — A Cinematic Experience API is running",
        "docs": "/docs",
        "uploads": "/uploads",
        "media": "/media"
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
