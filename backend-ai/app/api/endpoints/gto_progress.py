"""
GTO Progress API Endpoints

Handles saving and loading progress for the Virtual GTO Ground game.
"""

from fastapi import APIRouter, HTTPException, Depends, Header, Path, Query, Body
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import json

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


# ============================================
# Mock Database (replace with actual DB calls)
# ============================================

# In-memory storage for demo purposes
# Replace with actual PostgreSQL queries using asyncpg or similar
mock_progress_db: Dict[str, Dict[int, GTOProgressSave]] = {}
mock_sessions_db: List[Dict[str, Any]] = []


def get_user_id(authorization: Optional[str] = Header(None)) -> Optional[str]:
    """Extract user ID from authorization header."""
    if authorization and authorization.startswith("Bearer "):
        # In production, decode JWT token here
        return authorization.split(" ")[1][:36]  # Mock user ID extraction
    return None


# ============================================
# API Endpoints
# ============================================

@router.post("/progress/save", response_model=GTOProgressResponse)
async def save_gto_progress(
    progress: GTOProgressSave,
    user_id: Optional[str] = Depends(get_user_id)
):
    """
    Save GTO game progress for a specific level.
    
    - Updates existing progress if level was already played
    - Creates new progress entry if first time
    - Tracks best score and stars
    """
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        # Initialize user's progress dict if not exists
        if user_id not in mock_progress_db:
            mock_progress_db[user_id] = {}
        
        user_progress = mock_progress_db[user_id]
        
        # Check if progress exists for this level
        if progress.level_id in user_progress:
            existing = user_progress[progress.level_id]
            
            # Update with best values
            if progress.completed and not existing.completed:
                existing.completed = True
            if progress.stars > existing.stars:
                existing.stars = progress.stars
            if progress.best_score > existing.best_score:
                existing.best_score = progress.best_score
            if progress.time_taken and (existing.time_taken is None or progress.time_taken < existing.time_taken):
                existing.time_taken = progress.time_taken
            existing.attempts += progress.attempts
            if progress.best_completion:
                existing.best_completion = progress.best_completion
            
            return GTOProgressResponse(
                success=True,
                message="Progress updated successfully",
                progress=existing
            )
        else:
            # New progress entry
            user_progress[progress.level_id] = progress
            return GTOProgressResponse(
                success=True,
                message="Progress saved successfully",
                progress=progress
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/progress/{level_id}", response_model=GTOProgressResponse)
async def get_gto_progress(
    level_id: int = Path(..., ge=1, le=70),
    user_id: Optional[str] = Depends(get_user_id)
):
    """
    Get progress for a specific GTO level.
    """
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    if user_id not in mock_progress_db:
        return GTOProgressResponse(
            success=True,
            message="No progress found",
            progress=None
        )
    
    progress = mock_progress_db[user_id].get(level_id)
    return GTOProgressResponse(
        success=True,
        message="Progress retrieved",
        progress=progress
    )


@router.get("/progress", response_model=GTOStatsResponse)
async def get_all_gto_progress(
    user_id: Optional[str] = Depends(get_user_id)
):
    """
    Get all GTO progress for the authenticated user.
    """
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    if user_id not in mock_progress_db:
        return GTOStatsResponse(
            success=True,
            total_levels_completed=0,
            total_stars=0,
            total_score=0,
            levels_by_type={},
            best_scores=[],
            recent_activity=[]
        )
    
    user_progress = mock_progress_db[user_id]
    
    # Calculate stats
    total_completed = sum(1 for p in user_progress.values() if p.completed)
    total_stars = sum(p.stars for p in user_progress.values())
    total_score = sum(p.best_score for p in user_progress.values())
    
    # Levels by type
    levels_by_type = {"PGT": 0, "HGT": 0, "CT": 0, "FGT": 0}
    for p in user_progress.values():
        if p.completed and p.level_type in levels_by_type:
            levels_by_type[p.level_type] += 1
    
    # Best scores (top 10)
    best_scores = sorted(
        [
            {
                "level_id": p.level_id,
                "level_type": p.level_type,
                "score": p.best_score,
                "stars": p.stars,
                "time_taken": p.time_taken
            }
            for p in user_progress.values()
            if p.completed
        ],
        key=lambda x: x["score"],
        reverse=True
    )[:10]
    
    # Recent activity (last 5)
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


@router.get("/leaderboard", response_model=GTOLeaderboardResponse)
async def get_gto_leaderboard(
    limit: int = Query(default=50, ge=1, le=100),
    user_id: Optional[str] = Depends(get_user_id)
):
    """
    Get GTO leaderboard with top players.
    """
    # Aggregate all user progress
    leaderboard_data = []
    
    for uid, progress_dict in mock_progress_db.items():
        completed = [p for p in progress_dict.values() if p.completed]
        if completed:
            leaderboard_data.append({
                "user_id": uid,
                "full_name": f"User_{uid[:8]}",  # Mock name
                "email": f"user_{uid[:8]}@ssbnextgen.com",
                "levels_completed": len(completed),
                "total_stars": sum(p.stars for p in completed),
                "total_score": sum(p.best_score for p in completed),
                "avg_completion_time": (
                    sum(p.time_taken for p in completed if p.time_taken) / 
                    len([p for p in completed if p.time_taken])
                    if any(p.time_taken for p in completed) else None
                )
            })
    
    # Sort by total_score desc, total_stars desc, levels_completed desc
    leaderboard_data.sort(
        key=lambda x: (x["total_score"], x["total_stars"], x["levels_completed"]),
        reverse=True
    )
    
    # Find user rank
    user_rank = None
    if user_id:
        for i, entry in enumerate(leaderboard_data):
            if entry["user_id"] == user_id:
                user_rank = i + 1
                break
    
    return GTOLeaderboardResponse(
        success=True,
        leaderboard=[GTOLeaderboardEntry(**entry) for entry in leaderboard_data[:limit]],
        user_rank=user_rank
    )


@router.post("/session/save")
async def save_gto_session(
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
    
    session = {
        "user_id": user_id,
        "level_id": level_id,
        "session_data": session_data,
        "score": score,
        "completed": completed,
        "violations": violations,
        "duration": duration,
        "created_at": datetime.utcnow().isoformat()
    }
    
    mock_sessions_db.append(session)
    
    return {"success": True, "message": "Session saved", "session_id": len(mock_sessions_db)}


@router.get("/session/{session_id}")
async def get_gto_session(
    session_id: int,
    user_id: Optional[str] = Depends(get_user_id)
):
    """
    Retrieve a specific game session for replay.
    """
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    if session_id < 1 or session_id > len(mock_sessions_db):
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = mock_sessions_db[session_id - 1]
    
    if session["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this session")
    
    return {
        "success": True,
        "session": session
    }


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
    Replace mock storage with actual DB calls.
    """
    query = """
    INSERT INTO gto_progress 
    (user_id, level_id, level_type, completed, stars, best_score, time_taken, attempts, best_completion)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
