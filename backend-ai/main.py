import os
import logging
import asyncpg
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from redis.asyncio import Redis

# ============================================
# Structured Logging
# ============================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S%z"
)
logger = logging.getLogger("ssb-nextgen-api")

# ============================================
# Rate Limiter
# ============================================
limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])

# ============================================
# Lifespan: Startup / Shutdown
# ============================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379")
    try:
        app.state.redis = Redis.from_url(redis_url, encoding="utf-8", decode_responses=True)
        await app.state.redis.ping()
        logger.info("Redis connected successfully")
    except Exception as e:
        logger.warning(f"Redis connection failed ({e}), continuing without Redis")
        app.state.redis = None
    
    db_url = os.environ.get("DATABASE_URL")
    if db_url:
        try:
            app.state.db_pool = await asyncpg.create_pool(
                db_url,
                min_size=2,
                max_size=20,
                max_queries=50000,
                max_inactive_connection_lifetime=300
            )
            logger.info("PostgreSQL pool created successfully")
        except Exception as e:
            logger.error(f"PostgreSQL pool creation failed: {e}")
            app.state.db_pool = None
    else:
        logger.warning("DATABASE_URL not set, running without database")
        app.state.db_pool = None
        
    yield
    
    # Shutdown
    if app.state.db_pool:
        await app.state.db_pool.close()
        logger.info("PostgreSQL pool closed")
    if app.state.redis:
        await app.state.redis.close()
        logger.info("Redis connection closed")

# ============================================
# FastAPI App
# ============================================
import uuid
from starlette.middleware.base import BaseHTTPMiddleware

app = FastAPI(
    title="SSB NextGen API",
    description="Professional backend for SSB Preparation Platform",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response

app.add_middleware(RequestIdMiddleware)

# ============================================
# CORS
# ============================================
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

# ============================================
# Global Exception Handler
# ============================================
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"}
    )

# ============================================
# Routes
# ============================================
from app.api.router import api_router

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to SSB NextGen API", "status": "operational", "version": "1.0.0"}

@app.get("/health")
async def health_check(request: Request):
    """
    Liveness probe — returns healthy if the process is running.
    """
    return {"status": "healthy"}

@app.get("/ready")
async def readiness_check(request: Request):
    """
    Readiness probe — verifies DB and Redis connectivity.
    """
    checks = {}
    overall = True
    
    # Check database
    if request.app.state.db_pool:
        try:
            async with request.app.state.db_pool.acquire() as conn:
                await conn.fetchval("SELECT 1")
            checks["database"] = "connected"
        except Exception as e:
            checks["database"] = f"error: {str(e)}"
            overall = False
    else:
        checks["database"] = "not_configured"
    
    # Check Redis
    if request.app.state.redis:
        try:
            await request.app.state.redis.ping()
            checks["redis"] = "connected"
        except Exception as e:
            checks["redis"] = f"error: {str(e)}"
            overall = False
    else:
        checks["redis"] = "not_configured"
    
    status_code = 200 if overall else 503
    return JSONResponse(
        status_code=status_code,
        content={
            "status": "ready" if overall else "not_ready",
            "checks": checks
        }
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", "8000") or "8000")
    logger.info(f"Starting Uvicorn on port {port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port)
