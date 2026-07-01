"""
Brigadier AI API Routes

This module provides REST API endpoints for the Brigadier-level AI assessment system.
It allows candidates to interact with the SSB interview simulator and receive
expert-level evaluation and feedback.
"""

from fastapi import APIRouter, HTTPException, Depends, status, Request
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid

from app.middleware.rate_limiter import check_rate_limit
from app.agents.brigadier_assessor import BrigadierAssessor, create_brigadier_assessor, OLQ_FRAMEWORK
from app.agents.ssb_simulator import SSBInterviewSimulator, create_ssb_simulator, InterviewMode, InterviewStage


# Router setup
router = APIRouter(prefix="/brigadier", tags=["Brigadier AI"])


# Request/Response Models
class CandidateProfile(BaseModel):
    """Candidate profile information"""
    name: str = Field(..., description="Candidate's full name")
    age: int = Field(..., ge=16, le=35, description="Candidate's age")
    education: str = Field(..., description="Educational background")
    experience: Optional[str] = Field(None, description="Work experience")
    achievements: Optional[List[str]] = Field(None, description="Notable achievements")
    extracurricular: Optional[str] = Field(None, description="Extracurricular activities")


class InterviewRequest(BaseModel):
    """Request to start an interview"""
    candidate_profile: CandidateProfile
    mode: str = Field("assessment", description="Interview mode: practice, assessment, training, full_ssb")
    stage: Optional[str] = Field(None, description="Specific stage to start with")


class ResponseSubmission(BaseModel):
    """Candidate response submission"""
    response: str = Field(..., description="Candidate's response text")
    stage: Optional[str] = Field(None, description="Current interview stage")


class OLQAnalysisRequest(BaseModel):
    """Request for OLQ analysis of a response"""
    response: str = Field(..., description="Response text to analyze")
    context: Optional[Dict[str, Any]] = Field(None, description="Additional context")


class QuestionGenerationRequest(BaseModel):
    """Request to generate Brigadier-level questions"""
    analysis: Dict[str, Any] = Field(..., description="Previous analysis results")
    question_type: str = Field("follow_up", description="Type of question: stress_test, depth_probe, ethical_dilemma, leadership_test, scenario_escalation")


# Response Models
class OLQScoreResponse(BaseModel):
    """OLQ score response"""
    olq_name: str
    score: float
    assessment: str
    concerns: List[str]
    positive_indicators: List[str]
    critical: bool


class AnalysisResponse(BaseModel):
    """Analysis response"""
    response_text: str
    overall_assessment: str
    olq_scores: List[OLQScoreResponse]
    red_flags: List[str]
    green_flags: List[str]
    confidence_score: float
    recommendation: Dict[str, Any]
    follow_up_areas: List[str]


class InterviewState(BaseModel):
    """Interview session state"""
    session_id: str
    current_stage: str
    question: str
    instructions: str
    mode: str


# In-memory session storage with TTL to prevent memory leaks
from app.middleware.session_manager import SessionManager
interview_sessions = SessionManager(ttl_seconds=3600, max_items=1000)


from app.middleware.auth import get_current_user_id

@router.get("/olq-framework")
async def get_olq_framework(current_user_id: str = Depends(get_current_user_id)):
    """Get the complete OLQ framework used for assessment"""
    framework = {}
    for olq_name, olq_info in OLQ_FRAMEWORK.items():
        framework[olq_name] = {
            "description": olq_info["description"],
            "category": olq_info["category"].value,
            "weight": olq_info["weight"],
            "critical": olq_info["critical"]
        }
    return {
        "framework": framework,
        "categories": [cat.value for cat in set(olq["category"] for olq in OLQ_FRAMEWORK.values())]
    }


@router.post("/analyze-response", response_model=AnalysisResponse)
async def analyze_response(request: OLQAnalysisRequest, req: Request, current_user_id: str = Depends(get_current_user_id)):
    """
    Analyze a candidate's response using Brigadier-level assessment criteria
    
    This endpoint evaluates a single response against all 15 OLQs and provides
    detailed feedback including scores, flags, and recommendations.
    """
    try:
        check_rate_limit(req.client.host)
        assessor = create_brigadier_assessor()
        analysis = assessor.analyze_response(request.response, request.context)
        
        # Format OLQ scores for response
        olq_scores = []
        for olq_name, olq_data in analysis["olq_analysis"].items():
            olq_info = OLQ_FRAMEWORK[olq_name]
            olq_scores.append(OLQScoreResponse(
                olq_name=olq_name,
                score=olq_data["score"],
                assessment=olq_data["assessment"],
                concerns=olq_data["concerns"],
                positive_indicators=olq_data["positive_indicators"],
                critical=olq_info["critical"]
            ))
        
        return AnalysisResponse(
            response_text=analysis["response_text"],
            overall_assessment=analysis["overall_assessment"],
            olq_scores=olq_scores,
            red_flags=analysis["red_flags_detected"],
            green_flags=analysis["green_flags_detected"],
            confidence_score=analysis["confidence_score"],
            recommendation=analysis["recommendation"],
            follow_up_areas=analysis["follow_up_areas"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )


@router.post("/start-interview")
async def start_interview(request: InterviewRequest, current_user_id: str = Depends(get_current_user_id)):
    """
    Start a new SSB interview session
    
    Creates a new interview session with the specified mode and candidate profile.
    Returns the first question and session details.
    """
    try:
        # Determine interview mode
        mode_map = {
            "practice": InterviewMode.PRACTICE,
            "assessment": InterviewMode.ASSESSMENT,
            "training": InterviewMode.TRAINING,
            "full_ssb": InterviewMode.FULL_SSB
        }
        mode = mode_map.get(request.mode.lower(), InterviewMode.ASSESSMENT)
        
        # Create simulator and start interview
        simulator = create_ssb_simulator(mode)
        candidate_profile = request.candidate_profile.model_dump()
        
        # Generate unique session ID
        session_id = f"ssb_{uuid.uuid4().hex}"
        
        # Start interview
        interview_data = simulator.start_interview(candidate_profile)
        
        # Store session state
        interview_sessions[session_id] = {
            "simulator": simulator,
            "mode": request.mode,
            "candidate_profile": candidate_profile,
            "started_at": datetime.now().isoformat(),
            "current_stage": interview_data.get("stage", "personal_interview")
        }
        
        return {
            "session_id": session_id,
            "mode": request.mode,
            "stage": interview_data.get("stage"),
            "question": interview_data.get("question", interview_data.get("scenario", interview_data.get("words"))),
            "instructions": interview_data.get("instructions", ""),
            "candidate_profile": candidate_profile
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start interview: {str(e)}"
        )


@router.post("/submit-response")
async def submit_response(session_id: str, request: ResponseSubmission, current_user_id: str = Depends(get_current_user_id)):
    """
    Submit a candidate's response for evaluation
    
    Processes the response, provides analysis, and returns the next question.
    """
    if session_id not in interview_sessions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found"
        )
    
    try:
        session = interview_sessions[session_id]
        simulator = session["simulator"]
        
        # Determine current stage
        stage = InterviewStage(request.stage) if request.stage else None
        
        # Process response
        result = simulator.process_response(request.response, stage)
        
        # Update session state
        next_action = result.get("next_action", {})
        session["current_stage"] = next_action.get("next_stage", session["current_stage"])
        
        return {
            "session_id": session_id,
            "analysis": result.get("analysis", {}),
            "next_action": next_action,
            "feedback": result.get("feedback"),
            "improvement_tips": result.get("improvement_tips", [])
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process response: {str(e)}"
        )


@router.get("/interview-report/{session_id}")
async def get_interview_report(session_id: str, current_user_id: str = Depends(get_current_user_id)):
    """
    Generate and retrieve the complete interview report
    
    Provides comprehensive evaluation including OLQ scores, recommendations,
    and development suggestions.
    """
    if session_id not in interview_sessions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found"
        )
    
    try:
        session = interview_sessions[session_id]
        simulator = session["simulator"]
        
        # Generate report
        report = simulator.generate_interview_report()
        
        # Add session metadata
        report["session_metadata"] = {
            "session_id": session_id,
            "started_at": session["started_at"],
            "completed_at": datetime.now().isoformat(),
            "mode": session["mode"]
        }
        
        return report
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate report: {str(e)}"
        )


@router.post("/generate-question")
async def generate_question(request: QuestionGenerationRequest, req: Request, current_user_id: str = Depends(get_current_user_id)):
    """
    Generate a Brigadier-level follow-up question
    
    Creates challenging questions based on previous analysis to probe deeper
    into candidate's thinking and OLQ demonstration.
    """
    try:
        check_rate_limit(req.client.host)
        assessor = create_brigadier_assessor()
        question = assessor.generate_brigadier_question(request.analysis, request.question_type)
        
        return {
            "question": question,
            "question_type": request.question_type,
            "purpose": f"This {request.question_type.replace('_', ' ')} question is designed to assess candidate's response under specific conditions."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate question: {str(e)}"
        )


@router.get("/scenarios/{difficulty}")
async def get_scenarios(difficulty: str, req: Request, current_user_id: str = Depends(get_current_user_id)):
    """
    Get interview scenarios by difficulty level
    
    Returns a variety of scenarios for practice at different difficulty levels.
    """
    try:
        check_rate_limit(req.client.host)
        assessor = create_brigadier_assessor()
        scenarios = []
        
        # Generate multiple scenarios
        for _ in range(5):
            scenario = assessor.generate_interview_scenario(difficulty)
            scenarios.append(scenario)
        
        return {
            "difficulty": difficulty,
            "scenarios": scenarios,
            "count": len(scenarios)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate scenarios: {str(e)}"
        )


@router.post("/evaluate-interview")
async def evaluate_complete_interview(responses: List[Dict[str, Any]], current_user_id: str = Depends(get_current_user_id)):
    """
    Evaluate a complete interview session
    
    Takes all responses from an interview and provides comprehensive evaluation
    with final recommendation.
    """
    try:
        assessor = create_brigadier_assessor()
        evaluation = assessor.evaluate_complete_interview(responses)
        
        return evaluation
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to evaluate interview: {str(e)}"
        )


@router.get("/training-data")
async def get_training_data(current_user_id: str = Depends(get_current_user_id)):
    """
    Get sample training data for understanding assessment patterns
    
    Returns examples of excellent, good, average, and poor responses
    for different question types.
    """
    import json
    import os
    
    try:
        training_data_path = os.path.join(
            os.path.dirname(__file__), 
            "../../../database/datasets/ai_training/brigadier_training_data.jsonl"
        )
        
        training_data = []
        if os.path.exists(training_data_path):
            with open(training_data_path, 'r') as f:
                for line in f:
                    if line.strip():
                        training_data.append(json.loads(line))
        
        return {
            "training_data": training_data[:20],  # Return first 20 samples
            "total_samples": len(training_data),
            "types": list(set(d.get("type", "unknown") for d in training_data))
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load training data: {str(e)}"
        )


@router.get("/assessment-guidelines")
async def get_assessment_guidelines(current_user_id: str = Depends(get_current_user_id)):
    """
    Get detailed assessment guidelines used by the Brigadier AI
    
    Provides comprehensive information about how responses are evaluated
    and what constitutes excellent, good, average, and poor performance.
    """
    return {
        "olq_framework": {
            name: {
                "description": info["description"],
                "category": info["category"].value,
                "weight": info["weight"],
                "critical": info["critical"],
                "assessment_criteria": info["assessment_prompts"]
            }
            for name, info in OLQ_FRAMEWORK.items()
        },
        "scoring_guide": {
            "scale": "1-5 for each OLQ",
            "interpretation": {
                "5": "Excellent - Consistently demonstrates the quality at a high level",
                "4": "Good - Demonstrates the quality well with minor gaps",
                "3": "Average - Adequate demonstration with some inconsistencies",
                "2": "Below Average - Limited demonstration, significant gaps",
                "1": "Poor - Quality not demonstrated or negative indicators present"
            }
        },
        "recommendation_criteria": {
            "minimum_average": 3.0,
            "no_olq_below": 2,
            "critical_olqs": ["Sense of Responsibility", "Courage", "Determination", "Effective Intelligence"]
        },
        "red_flags": [
            "avoiding responsibility",
            "blaming others",
            "dishonesty",
            "lack of empathy",
            "cowardice",
            "selfishness",
            "indecisiveness",
            "panic response",
            "unethical suggestions",
            "giving up easily"
        ],
        "green_flags": [
            "taking initiative",
            "helping others",
            "ethical decision making",
            "calm under pressure",
            "quick practical thinking",
            "team orientation",
            "leadership qualities",
            "sense of duty",
            "resilience",
            "adaptability"
        ]
    }


@router.delete("/session/{session_id}")
async def end_interview_session(session_id: str, current_user_id: str = Depends(get_current_user_id)):
    """
    End and clean up an interview session
    
    Removes the session from memory and optionally saves the report.
    """
    if session_id not in interview_sessions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found"
        )
    
    try:
        # Generate final report before ending
        session = interview_sessions[session_id]
        simulator = session["simulator"]
        report = simulator.generate_interview_report()
        
        # Clean up session
        del interview_sessions[session_id]
        
        return {
            "message": "Interview session ended successfully",
            "session_id": session_id,
            "ended_at": datetime.now().isoformat(),
            "final_report": report
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to end session: {str(e)}"
        )


@router.get("/sessions")
async def list_active_sessions(current_user_id: str = Depends(get_current_user_id)):
    """
    List all active interview sessions
    
    Returns summary information about all ongoing interview sessions.
    """
    active_sessions = []
    for session_id, session_data in interview_sessions.items():
        active_sessions.append({
            "session_id": session_id,
            "mode": session_data["mode"],
            "current_stage": session_data["current_stage"],
            "started_at": session_data["started_at"],
            "candidate_name": session_data["candidate_profile"].get("name", "Unknown")
        })
    
    return {
        "active_sessions": active_sessions,
        "total_count": len(active_sessions)
    }
