"""
GTO Progress API Endpoints

Handles saving and loading progress for the Virtual GTO Ground game.
"""

from fastapi import APIRouter, HTTPException, Depends, Header, Path, Query, Body, Request
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import json
import logging

router = APIRouter(prefix="/api/gto", tags=["GTO Progress"])


# ============================================
# Data Models
# ============================================

class ToolPlacement(BaseModel):
    tool: str
    from_platform: str
    to_platform: str
    timestamp: float


class GTOProgressSave(BaseModel):
    level_id: int = Field(..., ge=1, le=70)
    level_type: str = Field(..., pattern="^(PGT|HGT|CT|FGT)$")
    completed: bool = False
    stars: int = Field(default=0, ge=0, le=3)
    best_score: int = Field(default=0, ge=0)
    time_taken: Optional[int] = Field(default=None, ge=0)
    attempts: int = Field(default=1, ge=1)
    best_completion: Optional[Dict[str, Any]] = None
    violations: int = Field(default=0, ge=0)


class GTOProgressResponse(BaseModel):
    success: bool
    message: str
    progress: Optional[GTOProgressSave] = None


class GTOLeaderboardEntry(BaseModel):
    user_id: str
    full_name: str
    email: str
    levels_completed: int
    total_stars: int
    total_score: int
    avg_completion_time: Optional[float] = None


class GTOLeaderboardResponse(BaseModel):
    success: bool
    leaderboard: List[GTOLeaderboardEntry]
    user_rank: Optional[int] = None


class GTOStatsResponse(BaseModel):
    success: bool
    total_levels_completed: int
    total_stars: int
    total_score: int
    levels_by_type: Dict[str, int]
    best_scores: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]


def get_user_id(authorization: Optional[str] = Header(None)) -> Optional[str]:
    """Extract user ID from authorization header."""
    if authorization and authorization.startswith("Bearer "):
        # In production, decode JWT token here. For now, extract the UID part.
        return authorization.split(" ")[1]
    return None


# ============================================
# API Endpoints
# ============================================

@router.post("/progress/save", response_model=GTOProgressResponse)
async def save_gto_progress(
    request: Request,
    progress: GTOProgressSave,
    user_id: Optional[str] = Depends(get_user_id)
):
    """
    Save GTO game progress for a specific level.
    """
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    db_pool = request.app.state.db_pool
    if not db_pool:
        raise HTTPException(status_code=500, detail="Database connection not available")

    try:
        async with db_pool.acquire() as conn:
            # First, check if user exists in auth.users, if we are enforcing FKs, but usually JWT handles this.
            # We assume user_id is a valid UUID.
            await save_to_postgres(user_id, progress, conn)
            
            # Fetch the updated record
            row = await conn.fetchrow(
                "SELECT * FROM gto_progress WHERE user_id = $1 AND level_id = $2",
                user_id, progress.level_id
            )
            
            if not row:
                raise HTTPException(status_code=500, detail="Failed to save progress")
                
            updated_progress = GTOProgressSave(
                level_id=row['level_id'],
                level_type=row['level_type'],
                completed=row['completed'],
                stars=row['stars'],
                best_score=row['best_score'],
                time_taken=row['time_taken'],
                attempts=row['attempts'],
                best_completion=json.loads(row['best_completion']) if row['best_completion'] else None,
                violations=0
            )

            return GTOProgressResponse(
                success=True,
                message="Progress saved successfully",
                progress=updated_progress
            )
            
    except Exception as e:
        logging.error(f"Internal Error in save_gto_progress: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/progress/{level_id}", response_model=GTOProgressResponse)
async def get_gto_progress(
    request: Request,
    level_id: int = Path(..., ge=1, le=70),
    user_id: Optional[str] = Depends(get_user_id)
):
    """
    Get progress for a specific GTO level.
    """
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    db_pool = request.app.state.db_pool
    if not db_pool:
        raise HTTPException(status_code=500, detail="Database connection not available")
        
    try:
        async with db_pool.acquire() as conn:
            row = await conn.fetchrow(
                "SELECT * FROM gto_progress WHERE user_id = $1 AND level_id = $2",
                user_id, level_id
            )
            
            if not row:
                return GTOProgressResponse(
                    success=True,
                    message="No progress found",
                    progress=None
                )
                
            progress = GTOProgressSave(
                level_id=row['level_id'],
                level_type=row['level_type'],
                completed=row['completed'],
                stars=row['stars'],
                best_score=row['best_score'],
                time_taken=row['time_taken'],
                attempts=row['attempts'],
                best_completion=json.loads(row['best_completion']) if row['best_completion'] else None,
                violations=0
            )
            
            return GTOProgressResponse(
                success=True,
                message="Progress retrieved",
                progress=progress
            )
    except Exception as e:
        logging.error(f"Internal Error in get_gto_progress: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/progress", response_model=GTOStatsResponse)
async def get_all_gto_progress(
    request: Request,
    user_id: Optional[str] = Depends(get_user_id)
):
    """
    Get all GTO progress for the authenticated user.
    """
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    db_pool = request.app.state.db_pool
    if not db_pool:
        raise HTTPException(status_code=500, detail="Database connection not available")
        
    try:
        async with db_pool.acquire() as conn:
            rows = await conn.fetch(
                "SELECT * FROM gto_progress WHERE user_id = $1",
                user_id
            )
            
            if not rows:
                return GTOStatsResponse(
                    success=True,
                    total_levels_completed=0,
                    total_stars=0,
                    total_score=0,
                    levels_by_type={},
                    best_scores=[],
                    recent_activity=[]
                )
                
            total_completed = sum(1 for r in rows if r['completed'])
            total_stars = sum(r['stars'] for r in rows)
            total_score = sum(r['best_score'] for r in rows)
            
            levels_by_type = {"PGT": 0, "HGT": 0, "CT": 0, "FGT": 0}
            for r in rows:
                if r['completed'] and r['level_type'] in levels_by_type:
                    levels_by_type[r['level_type']] += 1
                    
            best_scores = sorted(
                [
                    {
                        "level_id": r['level_id'],
                        "level_type": r['level_type'],
                        "score": r['best_score'],
                        "stars": r['stars'],
                        "time_taken": r['time_taken']
                    }
                    for r in rows if r['completed']
                ],
                key=lambda x: x["score"],
                reverse=True
            )[:10]
            
            recent_activity = best_scores[:5]
            
            return GTOStatsResponse(
                success=True,
                total_levels_completed=total_completed,
                total_stars=total_stars,
                total_score=total_score,
                levels_by_type=levels_by_type,
                best_scores=best_scores,
                recent_activity=recent_activity
            )
    except Exception as e:
        logging.error(f"Internal Error in get_all_gto_progress: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/leaderboard", response_model=GTOLeaderboardResponse)
async def get_gto_leaderboard(
    request: Request,
    limit: int = Query(default=50, ge=1, le=100),
    user_id: Optional[str] = Depends(get_user_id)
):
    """
    Get GTO leaderboard with top players.
    """
    db_pool = request.app.state.db_pool
    if not db_pool:
        raise HTTPException(status_code=500, detail="Database connection not available")
        
    try:
        async with db_pool.acquire() as conn:
            # Query aggregates user progress and ranks them
            query = """
                SELECT 
                    user_id,
                    COUNT(level_id) FILTER (WHERE completed = true) as levels_completed,
                    SUM(stars) as total_stars,
                    SUM(best_score) as total_score,
                    AVG(time_taken) FILTER (WHERE time_taken IS NOT NULL) as avg_completion_time
                FROM gto_progress
                GROUP BY user_id
                HAVING COUNT(level_id) FILTER (WHERE completed = true) > 0
                ORDER BY total_score DESC, total_stars DESC, levels_completed DESC
                LIMIT $1
            """
            rows = await conn.fetch(query, limit)
            
            leaderboard_data = []
            user_rank = None
            
            for i, r in enumerate(rows):
                # We would join with auth.users or a profiles table for names/emails in production.
                uid_str = str(r['user_id'])
                entry = GTOLeaderboardEntry(
                    user_id=uid_str,
                    full_name=f"User_{uid_str[:8]}",
                    email=f"user_{uid_str[:8]}@ssbnextgen.com",
                    levels_completed=r['levels_completed'],
                    total_stars=r['total_stars'] or 0,
                    total_score=r['total_score'] or 0,
                    avg_completion_time=float(r['avg_completion_time']) if r['avg_completion_time'] else None
                )
                leaderboard_data.append(entry)
                
                if user_id and uid_str == user_id:
                    user_rank = i + 1
                    
            return GTOLeaderboardResponse(
                success=True,
                leaderboard=leaderboard_data,
                user_rank=user_rank
            )
    except Exception as e:
        logging.error(f"Internal Error in get_gto_leaderboard: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/session/save")
async def save_gto_session(
    request: Request,
    level_id: int = Body(..., ge=1, le=70),
    session_data: Optional[Dict[str, Any]] = Body(default=None),
    score: int = Body(default=0, ge=0),
    completed: bool = Body(default=False),
    violations: int = Body(default=0, ge=0),
    duration: Optional[int] = Body(default=None),
    user_id: Optional[str] = Depends(get_user_id)
):
    """
    Save a complete GTO game session for analytics and replay.
    """
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    db_pool = request.app.state.db_pool
    if not db_pool:
        raise HTTPException(status_code=500, detail="Database connection not available")
        
    try:
        async with db_pool.acquire() as conn:
            query = """
            INSERT INTO gto_sessions 
            (user_id, level_id, session_data, score, completed, violations, duration)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
            """
            
            session_id = await conn.fetchval(
                query,
                user_id,
                level_id,
                json.dumps(session_data) if session_data else None,
                score,
                completed,
                violations,
                duration
            )
            
            return {"success": True, "message": "Session saved", "session_id": str(session_id)}
    except Exception as e:
        logging.error(f"Internal Error in save_gto_session: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/session/{session_id}")
async def get_gto_session(
    request: Request,
    session_id: str,
    user_id: Optional[str] = Depends(get_user_id)
):
    """
    Retrieve a specific game session for replay.
    """
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    db_pool = request.app.state.db_pool
    if not db_pool:
        raise HTTPException(status_code=500, detail="Database connection not available")
        
    try:
        async with db_pool.acquire() as conn:
            row = await conn.fetchrow("SELECT * FROM gto_sessions WHERE id = $1::uuid", session_id)
            
            if not row:
                raise HTTPException(status_code=404, detail="Session not found")
                
            if str(row['user_id']) != user_id:
                raise HTTPException(status_code=403, detail="Not authorized to view this session")
                
            session = dict(row)
            session['session_data'] = json.loads(session['session_data']) if session['session_data'] else None
            # Convert datetime to string for JSON serialization
            session['created_at'] = session['created_at'].isoformat()
            # Convert UUIDs to strings
            session['id'] = str(session['id'])
            session['user_id'] = str(session['user_id'])
            
            return {
                "success": True,
                "session": session
            }
    except Exception as e:
        logging.error(f"Internal Error in get_gto_session: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# ============================================
# Database Integration Helper Functions
# ============================================

async def save_to_postgres(
    user_id: str,
    progress: GTOProgressSave,
    db_connection
):
    """
    Save progress to PostgreSQL database.
    """
    query = """
    INSERT INTO gto_progress 
    (user_id, level_id, level_type, completed, stars, best_score, time_taken, attempts, best_completion)
    VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (user_id, level_id) 
    DO UPDATE SET
        completed = EXCLUDED.completed,
        stars = GREATEST(gto_progress.stars, EXCLUDED.stars),
        best_score = GREATEST(gto_progress.best_score, EXCLUDED.best_score),
        time_taken = CASE 
            WHEN gto_progress.time_taken IS NULL THEN EXCLUDED.time_taken
            WHEN EXCLUDED.time_taken IS NULL THEN gto_progress.time_taken
            ELSE LEAST(gto_progress.time_taken, EXCLUDED.time_taken)
        END,
        attempts = gto_progress.attempts + EXCLUDED.attempts,
        best_completion = COALESCE(EXCLUDED.best_completion, gto_progress.best_completion),
        last_played = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    """
    
    await db_connection.execute(
        query,
        user_id,
        progress.level_id,
        progress.level_type,
        progress.completed,
        progress.stars,
        progress.best_score,
        progress.time_taken,
        progress.attempts,
        json.dumps(progress.best_completion) if progress.best_completion else None
    )
