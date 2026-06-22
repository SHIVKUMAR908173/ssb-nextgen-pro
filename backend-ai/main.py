from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SSB NextGen API",
    description="Professional backend for SSB Preparation Platform",
    version="1.0.0"
)

# Configure CORS for Frontend interaction
import os
_cors_env = os.environ.get("CORS_ORIGINS", "")
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if _cors_env:
    origins.extend([o.strip() for o in _cors_env.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

from app.api.router import api_router

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to SSB NextGen API", "status": "operational"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", "8000") or "8000")
    print(f"[STARTUP] Environment PORT is: {port}", flush=True)
    print("[STARTUP] Starting Uvicorn directly from python...", flush=True)
    uvicorn.run("main:app", host="0.0.0.0", port=port)
