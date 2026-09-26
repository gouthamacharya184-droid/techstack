import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse, StreamingResponse
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

# CORS configuration — supports both ALLOWED_ORIGINS and CORS_ORIGINS env vars.
# Security: when ALLOWED_ORIGINS is "*" (wildcard), allow_credentials MUST be False
# per the CORS spec — browsers reject credentialed requests to wildcard origins.
# In production, always set ALLOWED_ORIGINS to your specific frontend domain(s).
raw_origins = os.getenv("ALLOWED_ORIGINS") or os.getenv("CORS_ORIGINS") or "http://localhost:5173,http://localhost:3000"
ALLOWED_ORIGINS = [orig.strip() for orig in raw_origins.split(",") if orig.strip()]
_is_wildcard = ALLOWED_ORIGINS == ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=not _is_wildcard,  # credentials=True is invalid with wildcard origins
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=["Content-Type", "Accept", "Authorization", "Range", "X-Requested-With"],
    expose_headers=["Content-Range", "Accept-Ranges", "Content-Length", "Content-Type"],
    max_age=86400,
)

# Backward-compatible redirect for legacy video paths
@app.get("/media/InShot_20260906_183316810.mp4")
@app.get("/uploads/InShot_20260906_183316810.mp4")
def redirect_legacy_video():
    return RedirectResponse(url="/media/videos/dhanya_cinematic_movie.mp4", status_code=307)

# High-performance chunked progressive video streaming endpoint
# Delivers faststart chunks <= 2MB, optimized for web players and serverless environments (Vercel)
@app.head("/media/videos/{filename}")
async def head_media_video(filename: str):
    video_path = MEDIA_DIR / "videos" / filename
    if not video_path.is_file():
        raise HTTPException(status_code=404, detail="Video not found")
    file_size = video_path.stat().st_size
    headers = {
        "Accept-Ranges": "bytes",
        "Content-Length": str(file_size),
        "Content-Type": "video/mp4",
        "Cache-Control": "public, max-age=31536000, immutable",
    }
    return Response(status_code=200, headers=headers)


@app.get("/media/videos/{filename}")
async def stream_media_video(filename: str, request: Request):
    video_path = MEDIA_DIR / "videos" / filename
    if not video_path.is_file():
        raise HTTPException(status_code=404, detail="Video not found")

    file_size = video_path.stat().st_size
    range_header = request.headers.get("Range")

    # Serve in 2MB chunks for instant streaming and strict compatibility with Vercel serverless limits (<4.5MB)
    max_chunk = 2 * 1024 * 1024
    start = 0
    end = min(file_size - 1, start + max_chunk - 1)

    if range_header and range_header.strip().startswith("bytes="):
        range_val = range_header.replace("bytes=", "").strip()
        parts = range_val.split("-")
        try:
            if parts[0]:
                start = int(parts[0])
            if len(parts) > 1 and parts[1]:
                end = min(int(parts[1]), start + max_chunk - 1)
            else:
                end = min(file_size - 1, start + max_chunk - 1)
        except ValueError:
            start = 0
            end = min(file_size - 1, start + max_chunk - 1)

    content_length = (end - start) + 1

    def iterfile():
        with open(video_path, mode="rb") as f:
            f.seek(start)
            bytes_left = content_length
            while bytes_left > 0:
                chunk = f.read(min(bytes_left, 64 * 1024))
                if not chunk:
                    break
                bytes_left -= len(chunk)
                yield chunk

    headers = {
        "Content-Range": f"bytes {start}-{end}/{file_size}",
        "Accept-Ranges": "bytes",
        "Content-Length": str(content_length),
        "Content-Type": "video/mp4",
        "Cache-Control": "public, max-age=31536000, immutable",
    }
    return StreamingResponse(iterfile(), status_code=206, headers=headers)


# Include API router BEFORE static mounts — FastAPI router resolution order matters.
# API routes must be declared first so /api/* paths are matched by the router,
# not caught by a static-file handler.
app.include_router(api_router)

# Mount static files directories for user uploads and backend media assets.
# These are mounted AFTER the API router so /api/* paths are never intercepted.
try:
    app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
except Exception as e:
    print(f"WARNING: Could not mount /uploads static files: {e}")

try:
    app.mount("/media", StaticFiles(directory=str(MEDIA_DIR)), name="media")
except Exception as e:
    print(f"WARNING: Could not mount /media static files: {e}")


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
