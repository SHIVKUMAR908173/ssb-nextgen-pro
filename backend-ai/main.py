import os
import asyncpg
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from redis.asyncio import Redis

# Set up Rate Limiter
limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379")
    app.state.redis = Redis.from_url(redis_url, encoding="utf-8", decode_responses=True)
    
    db_url = os.environ.get("DATABASE_URL")
    if db_url:
        app.state.db_pool = await asyncpg.create_pool(
            db_url,
            min_size=20,
            max_size=100,
            max_queries=50000,
            max_inactive_connection_lifetime=300
        )
    else:
        app.state.db_pool = None
        
    yield
    # Shutdown
    if app.state.db_pool:
        await app.state.db_pool.close()
    await app.state.redis.close()

app = FastAPI(
    title="SSB NextGen API",
    description="Professional backend for SSB Preparation Platform",
    version="1.0.0",
    lifespan=lifespan
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS for Frontend interaction
import os
_cors_env = os.environ.get("CORS_ORIGINS", "")
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://ssb-nextgen-pro.vercel.app",
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
