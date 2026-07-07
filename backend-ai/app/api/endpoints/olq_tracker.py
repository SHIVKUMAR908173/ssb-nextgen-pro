from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from datetime import date, datetime, timedelta
from pydantic import BaseModel, Field
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/olq", tags=["OLQ Tracking"])

# Database connection pool
database_url = os.getenv("DATABASE_URL")
pool = None

from fastapi import Request
async def get_db(request: Request):
    return request.app.state.db_pool

# OLQ names mapping
OLQ_NAMES = [
    "Effective Intelligence",
    "Reasoning Ability", 
    "Organizing Ability",
    "Power of Expression",
    "Social Adaptability",
    "Cooperation",
    "Sense of Responsibility",
    "Initiative",
    "Self Confidence",
    "Speed of Decision",
    "Ability to Influence",
    "Liveliness",
    "Determination",
    "Courage",
    "Stamina"
]

# Pydantic models
class OLQAssessmentCreate(BaseModel):
    user_id: str
    test_type: str
    test_id: Optional[str] = None
    overall_score: Optional[int] = None
    olq_scores: Optional[dict] = None
    assessed_by: Optional[str] = "AI"
    notes: Optional[str] = None

class OLQAssessmentResponse(BaseModel):
    id: str
    user_id: str
    test_type: str
    test_id: Optional[str]
    overall_score: Optional[int]
    olq_scores: dict
    assessed_by: str
    notes: Optional[str]
    created_at: datetime

class OLQDailySummary(BaseModel):
    date: date
    olq_averages: dict
    overall_daily_score: Optional[float]
    assessment_count: int

class OLQConfiguration(BaseModel):
    weights: Optional[dict] = None
    targets: Optional[dict] = None
    configuration_name: Optional[str] = "Default"
    notes: Optional[str] = None

from app.middleware.auth import get_current_user_id

@router.post("/assessments", response_model=dict)
async def create_olq_assessment(
    request: Request,
    assessment: OLQAssessmentCreate,
    current_user_id: str = Depends(get_current_user_id)
):
    """Record a new OLQ assessment from any test type"""
    # Enforce that user can only write their own scores
    if assessment.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Cannot write scores for another user")
        
    try:
        db = request.app.state.db_pool
        async with db.acquire() as conn:
            # Insert assessment
            result = await conn.fetchrow("""
                INSERT INTO olq_assessments (
                    user_id, test_type, test_id, overall_score,
                    effective_intelligence, reasoning_ability, organizing_ability, power_of_expression,
                    social_adaptability, cooperation, sense_of_responsibility,
                    initiative, self_confidence, speed_of_decision, ability_to_influence,
                    liveliness, determination, courage, stamina,
                    assessed_by, notes
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
                RETURNING id, created_at
            """,
                assessment.user_id,
                assessment.test_type,
                assessment.test_id,
                assessment.overall_score,
                assessment.olq_scores.get("effective_intelligence") if assessment.olq_scores else None,
                assessment.olq_scores.get("reasoning_ability") if assessment.olq_scores else None,
                assessment.olq_scores.get("organizing_ability") if assessment.olq_scores else None,
                assessment.olq_scores.get("power_of_expression") if assessment.olq_scores else None,
                assessment.olq_scores.get("social_adaptability") if assessment.olq_scores else None,
                assessment.olq_scores.get("cooperation") if assessment.olq_scores else None,
                assessment.olq_scores.get("sense_of_responsibility") if assessment.olq_scores else None,
                assessment.olq_scores.get("initiative") if assessment.olq_scores else None,
                assessment.olq_scores.get("self_confidence") if assessment.olq_scores else None,
                assessment.olq_scores.get("speed_of_decision") if assessment.olq_scores else None,
                assessment.olq_scores.get("ability_to_influence") if assessment.olq_scores else None,
                assessment.olq_scores.get("liveliness") if assessment.olq_scores else None,
                assessment.olq_scores.get("determination") if assessment.olq_scores else None,
                assessment.olq_scores.get("courage") if assessment.olq_scores else None,
                assessment.olq_scores.get("stamina") if assessment.olq_scores else None,
                assessment.assessed_by,
                assessment.notes
            )
            
            return {
                "success": True,
                "assessment_id": str(result["id"]),
                "created_at": result["created_at"].isoformat()
            }
            
    except Exception as e:
        import logging
        logging.error(f"Internal Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/assessments/{user_id}", response_model=List[dict])
async def get_user_assessments(
    request: Request,
    user_id: str,
    current_user_id: str = Depends(get_current_user_id),
    days: int = Query(default=30, ge=1, le=365),
    test_type: Optional[str] = None
):
    """Get OLQ assessments for a user with optional filtering"""
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Cannot read scores for another user")
    try:
        db = request.app.state.db_pool
        async with db.acquire() as conn:
            if test_type:
                rows = await conn.fetch("""
                    SELECT * FROM olq_assessments 
                    WHERE user_id = $1 
                    AND test_type = $2
                    AND created_at >= NOW() - ($3 || ' days')::interval
                    ORDER BY created_at DESC
                """, user_id, test_type, str(days))
            else:
                rows = await conn.fetch("""
                    SELECT * FROM olq_assessments 
                    WHERE user_id = $1 
                    AND created_at >= NOW() - ($2 || ' days')::interval
                    ORDER BY created_at DESC
                """, user_id, str(days))
            
            assessments = []
            for row in rows:
                assessments.append({
                    "id": str(row["id"]),
                    "user_id": str(row["user_id"]),
                    "test_type": row["test_type"],
                    "test_id": str(row["test_id"]) if row["test_id"] else None,
                    "overall_score": row["overall_score"],
                    "olq_scores": {
                        "effective_intelligence": row["effective_intelligence"],
                        "reasoning_ability": row["reasoning_ability"],
                        "organizing_ability": row["organizing_ability"],
                        "power_of_expression": row["power_of_expression"],
                        "social_adaptability": row["social_adaptability"],
                        "cooperation": row["cooperation"],
                        "sense_of_responsibility": row["sense_of_responsibility"],
                        "initiative": row["initiative"],
                        "self_confidence": row["self_confidence"],
                        "speed_of_decision": row["speed_of_decision"],
                        "ability_to_influence": row["ability_to_influence"],
                        "liveliness": row["liveliness"],
                        "determination": row["determination"],
                        "courage": row["courage"],
                        "stamina": row["stamina"]
                    },
                    "assessed_by": row["assessed_by"],
                    "notes": row["notes"],
                    "created_at": row["created_at"].isoformat()
                })
            
            return assessments
            
    except Exception as e:
        import logging
        logging.error(f"Internal Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/current-scores/{user_id}")
async def get_current_olq_scores(
    request: Request,
    user_id: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """Get current aggregated OLQ scores for radar chart display"""
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Cannot read scores for another user")
    try:
        db = request.app.state.db_pool
        async with db.acquire() as conn:
            # Get weighted average from last 30 days, or all time if not enough data
            row = await conn.fetchrow("""
                SELECT 
                    AVG(effective_intelligence) as effective_intelligence,
                    AVG(reasoning_ability) as reasoning_ability,
                    AVG(organizing_ability) as organizing_ability,
                    AVG(power_of_expression) as power_of_expression,
                    AVG(social_adaptability) as social_adaptability,
                    AVG(cooperation) as cooperation,
                    AVG(sense_of_responsibility) as sense_of_responsibility,
                    AVG(initiative) as initiative,
                    AVG(self_confidence) as self_confidence,
                    AVG(speed_of_decision) as speed_of_decision,
                    AVG(ability_to_influence) as ability_to_influence,
                    AVG(liveliness) as liveliness,
                    AVG(determination) as determination,
                    AVG(courage) as courage,
                    AVG(stamina) as stamina
                FROM olq_assessments
                WHERE user_id = $1 
                AND created_at >= NOW() - INTERVAL '30 days'
            """, user_id)
            
            if row and any(row.values()):
                scores = [
                    float(row["effective_intelligence"]) if row["effective_intelligence"] else 5,
                    float(row["reasoning_ability"]) if row["reasoning_ability"] else 5,
                    float(row["organizing_ability"]) if row["organizing_ability"] else 5,
                    float(row["power_of_expression"]) if row["power_of_expression"] else 5,
                    float(row["social_adaptability"]) if row["social_adaptability"] else 5,
                    float(row["cooperation"]) if row["cooperation"] else 5,
                    float(row["sense_of_responsibility"]) if row["sense_of_responsibility"] else 5,
                    float(row["initiative"]) if row["initiative"] else 5,
                    float(row["self_confidence"]) if row["self_confidence"] else 5,
                    float(row["speed_of_decision"]) if row["speed_of_decision"] else 5,
                    float(row["ability_to_influence"]) if row["ability_to_influence"] else 5,
                    float(row["liveliness"]) if row["liveliness"] else 5,
                    float(row["determination"]) if row["determination"] else 5,
                    float(row["courage"]) if row["courage"] else 5,
                    float(row["stamina"]) if row["stamina"] else 5,
                ]
            else:
                # Default scores if no data
                scores = [5] * 15
            
            return {
                "scores": scores,
                "labels": OLQ_NAMES,
                "last_updated": datetime.now().isoformat()
            }
            
    except Exception as e:
        import logging
        logging.error(f"Internal Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/daily-summary/{user_id}", response_model=List[OLQDailySummary])
async def get_daily_summary(
    request: Request,
    user_id: str,
    current_user_id: str = Depends(get_current_user_id),
    days: int = Query(default=7, ge=1, le=90)
):
    """Get daily OLQ summary for trend analysis"""
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Cannot read scores for another user")
    try:
        db = request.app.state.db_pool
        async with db.acquire() as conn:
            rows = await conn.fetch("""
                SELECT * FROM olq_daily_summary
                WHERE user_id = $1 
                AND date >= NOW() - ($2 || ' days')::interval
                ORDER BY date DESC
            """, user_id, str(days))
            
            summaries = []
            for row in rows:
                summaries.append({
                    "date": row["date"].isoformat(),
                    "olq_averages": {
                        "effective_intelligence": float(row["effective_intelligence_avg"]) if row["effective_intelligence_avg"] else None,
                        "reasoning_ability": float(row["reasoning_ability_avg"]) if row["reasoning_ability_avg"] else None,
                        "organizing_ability": float(row["organizing_ability_avg"]) if row["organizing_ability_avg"] else None,
                        "power_of_expression": float(row["power_of_expression_avg"]) if row["power_of_expression_avg"] else None,
                        "social_adaptability": float(row["social_adaptability_avg"]) if row["social_adaptability_avg"] else None,
                        "cooperation": float(row["cooperation_avg"]) if row["cooperation_avg"] else None,
                        "sense_of_responsibility": float(row["sense_of_responsibility_avg"]) if row["sense_of_responsibility_avg"] else None,
                        "initiative": float(row["initiative_avg"]) if row["initiative_avg"] else None,
                        "self_confidence": float(row["self_confidence_avg"]) if row["self_confidence_avg"] else None,
                        "speed_of_decision": float(row["speed_of_decision_avg"]) if row["speed_of_decision_avg"] else None,
                        "ability_to_influence": float(row["ability_to_influence_avg"]) if row["ability_to_influence_avg"] else None,
                        "liveliness": float(row["liveliness_avg"]) if row["liveliness_avg"] else None,
                        "determination": float(row["determination_avg"]) if row["determination_avg"] else None,
                        "courage": float(row["courage_avg"]) if row["courage_avg"] else None,
                        "stamina": float(row["stamina_avg"]) if row["stamina_avg"] else None,
                    },
                    "overall_daily_score": float(row["overall_daily_score"]) if row["overall_daily_score"] else None,
                    "assessment_count": row["assessment_count"]
                })
            
            return summaries
            
    except Exception as e:
        import logging
        logging.error(f"Internal Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/configuration/{user_id}")
async def get_olq_configuration(
    request: Request,
    user_id: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """Get OLQ configuration (weights and targets) for a user"""
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Cannot read config for another user")
    try:
        db = request.app.state.db_pool
        async with db.acquire() as conn:
            row = await conn.fetchrow("""
                SELECT * FROM olq_configuration
                WHERE user_id = $1 AND is_active = TRUE
                ORDER BY created_at DESC
                LIMIT 1
            """, user_id)
            
            if row:
                return {
                    "weights": {
                        "effective_intelligence": float(row["effective_intelligence_weight"]),
                        "reasoning_ability": float(row["reasoning_ability_weight"]),
                        "organizing_ability": float(row["organizing_ability_weight"]),
                        "power_of_expression": float(row["power_of_expression_weight"]),
                        "social_adaptability": float(row["social_adaptability_weight"]),
                        "cooperation": float(row["cooperation_weight"]),
                        "sense_of_responsibility": float(row["sense_of_responsibility_weight"]),
                        "initiative": float(row["initiative_weight"]),
                        "self_confidence": float(row["self_confidence_weight"]),
                        "speed_of_decision": float(row["speed_of_decision_weight"]),
                        "ability_to_influence": float(row["ability_to_influence_weight"]),
                        "liveliness": float(row["liveliness_weight"]),
                        "determination": float(row["determination_weight"]),
                        "courage": float(row["courage_weight"]),
                        "stamina": float(row["stamina_weight"]),
                    },
                    "targets": {
                        "effective_intelligence": row["target_effective_intelligence"],
                        "reasoning_ability": row["target_reasoning_ability"],
                        "organizing_ability": row["target_organizing_ability"],
                        "power_of_expression": row["target_power_of_expression"],
                        "social_adaptability": row["target_social_adaptability"],
                        "cooperation": row["target_cooperation"],
                        "sense_of_responsibility": row["target_sense_of_responsibility"],
                        "initiative": row["target_initiative"],
                        "self_confidence": row["target_self_confidence"],
                        "speed_of_decision": row["target_speed_of_decision"],
                        "ability_to_influence": row["target_ability_to_influence"],
                        "liveliness": row["target_liveliness"],
                        "determination": row["target_determination"],
                        "courage": row["target_courage"],
                        "stamina": row["target_stamina"],
                    },
                    "configuration_name": row["configuration_name"],
                    "notes": row["notes"]
                }
            else:
                # Return defaults
                return {
                    "weights": {olq: 1.0 for olq in ["effective_intelligence", "reasoning_ability", "organizing_ability", "power_of_expression", "social_adaptability", "cooperation", "sense_of_responsibility", "initiative", "self_confidence", "speed_of_decision", "ability_to_influence", "liveliness", "determination", "courage", "stamina"]},
                    "targets": {olq: 7 for olq in ["effective_intelligence", "reasoning_ability", "organizing_ability", "power_of_expression", "social_adaptability", "cooperation", "sense_of_responsibility", "initiative", "self_confidence", "speed_of_decision", "ability_to_influence", "liveliness", "determination", "courage", "stamina"]},
                    "configuration_name": "Default",
                    "notes": None
                }
            
    except Exception as e:
        import logging
        logging.error(f"Internal Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/configuration")
async def update_olq_configuration(
    request: Request,
    config: OLQConfiguration, 
    user_id: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """Update OLQ configuration (weights and targets)"""
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Cannot write config for another user")
    try:
        db = request.app.state.db_pool
        async with db.acquire() as conn:
            # Deactivate existing configurations
            await conn.execute("""
                UPDATE olq_configuration 
                SET is_active = FALSE 
                WHERE user_id = $1
            """, user_id)
            
            # Insert new configuration
            result = await conn.fetchrow("""
                INSERT INTO olq_configuration (
                    user_id, configuration_name, notes,
                    effective_intelligence_weight, reasoning_ability_weight, organizing_ability_weight, power_of_expression_weight,
                    social_adaptability_weight, cooperation_weight, sense_of_responsibility_weight,
                    initiative_weight, self_confidence_weight, speed_of_decision_weight, ability_to_influence_weight,
                    liveliness_weight, determination_weight, courage_weight, stamina_weight,
                    target_effective_intelligence, target_reasoning_ability, target_organizing_ability, target_power_of_expression,
                    target_social_adaptability, target_cooperation, target_sense_of_responsibility,
                    target_initiative, target_self_confidence, target_speed_of_decision, target_ability_to_influence,
                    target_liveliness, target_determination, target_courage, target_stamina
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33)
                RETURNING id
            """,
                user_id,
                config.configuration_name or "Default",
                config.notes,
                config.weights.get("effective_intelligence", 1.0) if config.weights else 1.0,
                config.weights.get("reasoning_ability", 1.0) if config.weights else 1.0,
                config.weights.get("organizing_ability", 1.0) if config.weights else 1.0,
                config.weights.get("power_of_expression", 1.0) if config.weights else 1.0,
                config.weights.get("social_adaptability", 1.0) if config.weights else 1.0,
                config.weights.get("cooperation", 1.0) if config.weights else 1.0,
                config.weights.get("sense_of_responsibility", 1.0) if config.weights else 1.0,
                config.weights.get("initiative", 1.0) if config.weights else 1.0,
                config.weights.get("self_confidence", 1.0) if config.weights else 1.0,
                config.weights.get("speed_of_decision", 1.0) if config.weights else 1.0,
                config.weights.get("ability_to_influence", 1.0) if config.weights else 1.0,
                config.weights.get("liveliness", 1.0) if config.weights else 1.0,
                config.weights.get("determination", 1.0) if config.weights else 1.0,
                config.weights.get("courage", 1.0) if config.weights else 1.0,
                config.weights.get("stamina", 1.0) if config.weights else 1.0,
                config.targets.get("effective_intelligence", 7) if config.targets else 7,
                config.targets.get("reasoning_ability", 7) if config.targets else 7,
                config.targets.get("organizing_ability", 7) if config.targets else 7,
                config.targets.get("power_of_expression", 7) if config.targets else 7,
                config.targets.get("social_adaptability", 7) if config.targets else 7,
                config.targets.get("cooperation", 7) if config.targets else 7,
                config.targets.get("sense_of_responsibility", 7) if config.targets else 7,
                config.targets.get("initiative", 7) if config.targets else 7,
                config.targets.get("self_confidence", 7) if config.targets else 7,
                config.targets.get("speed_of_decision", 7) if config.targets else 7,
                config.targets.get("ability_to_influence", 7) if config.targets else 7,
                config.targets.get("liveliness", 7) if config.targets else 7,
                config.targets.get("determination", 7) if config.targets else 7,
                config.targets.get("courage", 7) if config.targets else 7,
                config.targets.get("stamina", 7) if config.targets else 7,
            )
            
            return {"success": True, "configuration_id": str(result["id"])}
            
    except Exception as e:
        import logging
        logging.error(f"Internal Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/trends/{user_id}")
async def get_olq_trends(
    request: Request,
    user_id: str,
    current_user_id: str = Depends(get_current_user_id),
    days: int = Query(default=30, ge=7, le=90)
):
    """Get OLQ trends over time for analysis"""
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Cannot read trends for another user")
    try:
        db = request.app.state.db_pool
        async with db.acquire() as conn:
            rows = await conn.fetch("""
                SELECT 
                    date,
                    effective_intelligence_avg,
                    reasoning_ability_avg,
                    organizing_ability_avg,
                    power_of_expression_avg,
                    social_adaptability_avg,
                    cooperation_avg,
                    sense_of_responsibility_avg,
                    initiative_avg,
                    self_confidence_avg,
                    speed_of_decision_avg,
                    ability_to_influence_avg,
                    liveliness_avg,
                    determination_avg,
                    courage_avg,
                    stamina_avg,
                    overall_daily_score
                FROM olq_daily_summary
                WHERE user_id = $1 
                AND date >= NOW() - ($2 || ' days')::interval
                ORDER BY date ASC
            """, user_id, str(days))
            
            trends = []
            for row in rows:
                trends.append({
                    "date": row["date"].isoformat(),
                    "scores": [
                        float(row["effective_intelligence_avg"]) if row["effective_intelligence_avg"] else None,
                        float(row["reasoning_ability_avg"]) if row["reasoning_ability_avg"] else None,
                        float(row["organizing_ability_avg"]) if row["organizing_ability_avg"] else None,
                        float(row["power_of_expression_avg"]) if row["power_of_expression_avg"] else None,
                        float(row["social_adaptability_avg"]) if row["social_adaptability_avg"] else None,
                        float(row["cooperation_avg"]) if row["cooperation_avg"] else None,
                        float(row["sense_of_responsibility_avg"]) if row["sense_of_responsibility_avg"] else None,
                        float(row["initiative_avg"]) if row["initiative_avg"] else None,
                        float(row["self_confidence_avg"]) if row["self_confidence_avg"] else None,
                        float(row["speed_of_decision_avg"]) if row["speed_of_decision_avg"] else None,
                        float(row["ability_to_influence_avg"]) if row["ability_to_influence_avg"] else None,
                        float(row["liveliness_avg"]) if row["liveliness_avg"] else None,
                        float(row["determination_avg"]) if row["determination_avg"] else None,
                        float(row["courage_avg"]) if row["courage_avg"] else None,
                        float(row["stamina_avg"]) if row["stamina_avg"] else None,
                    ],
                    "overall_score": float(row["overall_daily_score"]) if row["overall_daily_score"] else None
                })
            
            return trends
            
    except Exception as e:
        import logging
        logging.error(f"Internal Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
