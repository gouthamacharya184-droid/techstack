import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base, SessionLocal
from app.crud import init_db_seeds
from app.api.endpoints import router as api_router

# Define uploads directory in the backend root, or /tmp for serverless Vercel
BASE_DIR = Path(__file__).resolve().parent.parent
if os.getenv("VERCEL"):
    UPLOAD_DIR = Path("/tmp/uploads")
else:
    UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


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

# CORS configuration — allow_origins="*" is valid only without allow_credentials
# If deploying, set ALLOWED_ORIGINS env var to your specific frontend URL
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Authorization"],
)

# Mount static files directory for stored images
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.include_router(api_router)


@app.get("/")
def root():
    return {
        "message": "Happy Birthday — A Cinematic Experience API is running",
        "docs": "/docs",
        "uploads": "/uploads"
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
