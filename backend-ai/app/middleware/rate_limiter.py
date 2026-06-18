from fastapi import APIRouter, Request, HTTPException
import time

router = APIRouter()

from app.middleware.session_manager import SessionManager

# Mocking a Token Bucket or Leaky Bucket in memory for rate limiting
request_log = SessionManager(ttl_seconds=120, max_items=5000)

def check_rate_limit(client_ip: str):
    current_time = time.time()
    
    # Get current requests for IP, default to empty list
    client_requests = request_log.get(client_ip)
    if client_requests is None:
        client_requests = []
        
    # Clean old requests (e.g., 1 minute rolling window)
    client_requests = [t for t in client_requests if current_time - t < 60]
    
    if len(client_requests) > 30: # Max 30 requests per minute
        raise HTTPException(status_code=429, detail="Too Many Requests")
        
    client_requests.append(current_time)
    request_log.set(client_ip, client_requests)

@router.post("/telemetry/infraction")
async def log_cheating_infraction(request: Request, payload: dict):
    """
    Endpoint called by frontend when anti-cheating measures trigger
    (e.g., tab switch, clipboard paste during WAT/SRT).
    """
    client_ip = request.client.host
    check_rate_limit(client_ip)
    
    infraction_type = payload.get("type", "unknown")
    timestamp = payload.get("timestamp", time.time())
    
    print(f"[SECURITY ALERT] Cheating infraction detected from {client_ip}: {infraction_type} at {timestamp}")
    
    # In production, this saves to the DB and penalizes the candidate's Integrity score
    return {"status": "logged", "action": "score_penalized"}
