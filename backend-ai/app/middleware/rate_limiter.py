from fastapi import APIRouter, Request, HTTPException
import time
import json

router = APIRouter()

async def check_rate_limit(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    current_time = time.time()
    
    redis = getattr(request.app.state, "redis", None)
    if redis:
        key = f"rate_limit:{client_ip}"
        # Use Redis lists or simple get/set
        data = await redis.get(key)
        client_requests = json.loads(data) if data else []
        
        # Clean old requests (e.g., 1 minute rolling window)
        client_requests = [t for t in client_requests if current_time - t < 60]
        
        if len(client_requests) > 30: # Max 30 requests per minute
            raise HTTPException(status_code=429, detail="Too Many Requests")
            
        client_requests.append(current_time)
        await redis.set(key, json.dumps(client_requests), ex=60)
    else:
        # Fallback to local memory if no redis
        if not hasattr(request.app.state, "_rate_limit_fallback"):
            request.app.state._rate_limit_fallback = {}
        
        fallback = request.app.state._rate_limit_fallback
        client_requests = fallback.get(client_ip, [])
        client_requests = [t for t in client_requests if current_time - t < 60]
        
        if len(client_requests) > 30:
            raise HTTPException(status_code=429, detail="Too Many Requests")
            
        client_requests.append(current_time)
        fallback[client_ip] = client_requests


@router.post("/telemetry/infraction")
async def log_cheating_infraction(request: Request, payload: dict):
    """
    Endpoint called by frontend when anti-cheating measures trigger
    (e.g., tab switch, clipboard paste during WAT/SRT).
    """
    await check_rate_limit(request)
    
    infraction_type = payload.get("type", "unknown")
    timestamp = payload.get("timestamp", time.time())
    
    client_ip = request.client.host if request.client else "unknown"
    print(f"[SECURITY ALERT] Cheating infraction detected from {client_ip}: {infraction_type} at {timestamp}")
    
    # In production, this saves to the DB and penalizes the candidate's Integrity score
    return {"status": "logged", "action": "score_penalized"}
