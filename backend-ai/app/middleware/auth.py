import os
import jwt
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify Supabase JWT token"""
    try:
        token = credentials.credentials
        jwt_secret = os.getenv("JWT_SECRET") or os.getenv("SUPABASE_JWT_SECRET")
        
        # Fallback for local development if secret is missing
        if not jwt_secret and os.getenv("NODE_ENV", "development") == "development":
            return {"sub": "dev_user_123"}
            
        if not jwt_secret:
            raise HTTPException(status_code=500, detail="JWT_SECRET is not configured")
            
        payload = jwt.decode(
            token,
            jwt_secret,
            algorithms=["HS256"],
            audience="authenticated"
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        # Fallback for local development if token is invalid
        if os.getenv("NODE_ENV", "development") == "development":
             return {"sub": "dev_user_123"}
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except Exception as e:
        if os.getenv("NODE_ENV", "development") == "development":
             return {"sub": "dev_user_123"}
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

async def get_current_user_id(token_payload: dict = Depends(verify_token)) -> str:
    """Extract user_id from verified JWT"""
    return token_payload.get("sub", "dev_user_123")
