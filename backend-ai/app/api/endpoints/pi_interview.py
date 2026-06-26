"""
Personal Interview (PI) API Routes

This module provides REST API endpoints for the AI Brigadier Personal Interviewer.
Candidates can interact with the AI interviewer for live mock personal interviews.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid

from app.agents.pi_interviewer import PIInterviewer, get_pi_interviewer, InterviewMode
from app.audio.acoustic_analysis import AcousticAnalyzer
from fastapi import File, UploadFile, Form

# Router setup
router = APIRouter(prefix="/pi-interview", tags=["Personal Interview"])

# In-memory session storage with TTL to prevent memory leaks
from app.middleware.session_manager import SessionManager
pi_sessions = SessionManager(ttl_seconds=3600, max_items=1000)


class CandidateProfile(BaseModel):
    """Candidate profile for PI"""
    name: str = Field(..., description="Candidate's full name")
    age: int = Field(..., ge=16, le=35, description="Candidate's age")
    education: str = Field(..., description="Educational background")
    experience: Optional[str] = Field(None, description="Work experience")
    achievements: Optional[List[str]] = Field(None, description="Notable achievements")
    extracurricular: Optional[str] = Field(None, description="Extracurricular activities")
    hobbies: Optional[List[str]] = Field(None, description="Hobbies and interests")
    hometown: Optional[str] = Field(None, description="Hometown")
    family_background: Optional[str] = Field(None, description="Family background")


class StartInterviewRequest(BaseModel):
    """Request to start a PI interview"""
    candidate_profile: CandidateProfile
    mode: str = Field("assessment", description="Interview mode: practice, assessment, training")
    focus_areas: Optional[List[str]] = Field(None, description="Specific areas to focus on")


class SubmitResponseRequest(BaseModel):
    """Request to submit a response"""
    response: str = Field(..., description="Candidate's response text")


class InterviewSession(BaseModel):
    """Interview session details"""
    session_id: str
    mode: str
    current_stage: str
    candidate_name: str
    started_at: str


from app.middleware.auth import get_current_user_id

@router.get("/modes")
async def get_interview_modes(current_user_id: str = Depends(get_current_user_id)):
    """Get available interview modes"""
    return {
        "modes": [
            {
                "id": "practice",
                "name": "Practice Mode",
                "description": "Low-pressure practice with immediate feedback after each response",
                "features": ["Real-time feedback", "Hints and suggestions", "No scoring pressure"]
            },
            {
                "id": "assessment",
                "name": "Assessment Mode",
                "description": "Full assessment experience with final report only",
                "features": ["Realistic interview flow", "Comprehensive evaluation", "Final report"]
            },
            {
                "id": "training",
                "name": "Training Mode",
                "description": "Guided training with tips and coaching throughout",
                "features": ["Step-by-step guidance", "Coaching tips", "Skill development"]
            }
        ]
    }


@router.get("/sample-questions")
async def get_sample_questions(category: Optional[str] = None, current_user_id: str = Depends(get_current_user_id)):
    """Get sample interview questions by category"""
    categories = [
        {
            "category": "Personal Background",
            "sample_questions": [
                "Tell me about yourself and your family background.",
                "What are your strengths and weaknesses?",
                "Describe a typical day in your life."
            ]
        },
        {
            "category": "Education & Career",
            "sample_questions": [
                "Why did you choose your current field of study?",
                "What are your career goals for the next 10 years?",
                "Tell me about your academic achievements and failures."
            ]
        },
        {
            "category": "Leadership & Teamwork",
            "sample_questions": [
                "Describe a situation where you demonstrated leadership.",
                "Tell me about a time when you had to work in a team with difficult people.",
                "What qualities make a good leader in the armed forces?"
            ]
        },
        {
            "category": "Ethics & Values",
            "sample_questions": [
                "What would you do if you saw a senior officer violating rules?",
                "Describe an ethical dilemma you faced and how you resolved it.",
                "Is it ever acceptable to lie in the armed forces?"
            ]
        },
        {
            "category": "Current Affairs",
            "sample_questions": [
                "What are your views on the current geopolitical situation in our region?",
                "Tell me about a recent defense acquisition or policy you read about.",
                "What are the major internal security challenges facing India today?"
            ]
        },
        {
            "category": "Situational & Stress",
            "sample_questions": [
                "I don't think you have what it takes to be an officer. Convince me otherwise.",
                "You have to choose between saving your men or completing the mission. What do you choose?",
                "Describe a situation where you failed completely. What did you learn?"
            ]
        },
        {
            "category": "Motivation & Commitment",
            "sample_questions": [
                "Why do you want to join the armed forces?",
                "What sacrifices are you willing to make for the nation?",
                "What will you do if you're not recommended after multiple attempts?"
            ]
        }
    ]
    
    if category:
        categories = [c for c in categories if c["category"].lower() == category.lower()]
    
    return {"categories": categories}


@router.post("/start")
async def start_interview(request: StartInterviewRequest, current_user_id: str = Depends(get_current_user_id)):
    """
    Start a new personal interview session
    
    Creates a new interview session with the AI Brigadier interviewer.
    Returns the first question and session details.
    """
    try:
        # Create interviewer
        interviewer = get_pi_interviewer(request.mode)
        
        # Generate unique session ID
        session_id = f"pi_{uuid.uuid4().hex}"
        
        # Start interview
        candidate_profile = request.candidate_profile.model_dump()
        interview_data = interviewer.start_interview(candidate_profile)
        
        # Store session
        pi_sessions[session_id] = {
            "interviewer": interviewer,
            "mode": request.mode,
            "candidate_profile": candidate_profile,
            "started_at": datetime.now().isoformat(),
            "current_stage": interview_data.get("stage"),
            "response_count": 0
        }
        
        return {
            "session_id": session_id,
            "mode": request.mode,
            "greeting": interview_data.get("greeting"),
            "stage": interview_data.get("stage"),
            "question": interview_data.get("question"),
            "question_type": interview_data.get("question_type"),
            "instructions": interview_data.get("instructions"),
            "candidate_profile": candidate_profile,
            "tips": _get_mode_tips(request.mode)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start interview: {str(e)}"
        )


@router.post("/submit-response/{session_id}")
async def submit_response(
    session_id: str, 
    response: str = Form(...),
    audio: UploadFile = File(None),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Submit a response to the current interview question with optional audio for acoustic analysis.
    """
    if session_id not in pi_sessions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found"
        )
    
    try:
        session = pi_sessions[session_id]
        interviewer = session["interviewer"]
        
        # Process acoustic analysis if audio provided
        acoustic_metrics = None
        if audio:
            audio_bytes = await audio.read()
            analyzer = AcousticAnalyzer()
            acoustic_metrics = await analyzer.analyze_audio_chunk(audio_bytes)
        
        # Process response
        result = interviewer.process_response(response)
        
        # Inject acoustic metrics into analysis if available
        if acoustic_metrics and "error" not in acoustic_metrics and "analysis" in result:
            result["analysis"]["voice_confidence"] = acoustic_metrics.get("confidence_score", 0.0)
            result["analysis"]["pitch_stability"] = acoustic_metrics.get("pitch_stability", 0.0)
            
            # If high micro-tremors or low pitch stability, flag it
            if acoustic_metrics.get("pitch_stability", 1.0) < 0.6:
                if "red_flags_detected" not in result["analysis"]:
                    result["analysis"]["red_flags_detected"] = []
                result["analysis"]["red_flags_detected"].append("Acoustic analysis detected significant voice tremors/nervousness")
        
        # Update session
        session["response_count"] = session.get("response_count", 0) + 1
        
        # Check if interview completed
        if result.get("interview_completed"):
            return {
                "session_id": session_id,
                "interview_completed": True,
                "analysis": result.get("analysis"),
                "feedback": result.get("feedback"),
                "final_report": result.get("final_report"),
                "download_url": f"/reports/generate?session_id={session_id}"
            }
        
        return {
            "session_id": session_id,
            "analysis": result.get("analysis"),
            "feedback": result.get("feedback"),
            "next_question": result.get("next_question"),
            "question_type": result.get("question_type"),
            "is_follow_up": result.get("is_follow_up", False),
            "follow_up_count": result.get("follow_up_count", 0),
            "stage": result.get("stage"),
            "stage_changed": result.get("stage_changed", False),
            "response_count": session["response_count"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process response: {str(e)}"
        )


@router.get("/session/{session_id}")
async def get_session_status(session_id: str, current_user_id: str = Depends(get_current_user_id)):
    """Get the current status of an interview session"""
    if session_id not in pi_sessions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found"
        )
    
    session = pi_sessions[session_id]
    interviewer = session["interviewer"]
    
    return {
        "session_id": session_id,
        "mode": session["mode"],
        "current_stage": session["current_stage"],
        "candidate_name": session["candidate_profile"].get("name"),
        "started_at": session["started_at"],
        "response_count": session.get("response_count", 0),
        "current_question": interviewer.current_question.get("question") if interviewer.current_question else None
    }


@router.get("/report/{session_id}")
async def get_interview_report(session_id: str, current_user_id: str = Depends(get_current_user_id)):
    """
    Get the complete interview report
    
    Returns a comprehensive report with OLQ scores, analysis,
    and recommendations.
    """
    if session_id not in pi_sessions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found"
        )
    
    try:
        session = pi_sessions[session_id]
        interviewer = session["interviewer"]
        
        # Generate report
        report = interviewer.generate_report()
        
        # Add session metadata
        report["session_metadata"] = {
            "session_id": session_id,
            "started_at": session["started_at"],
            "completed_at": datetime.now().isoformat(),
            "mode": session["mode"],
            "total_responses": session.get("response_count", 0)
        }
        
        return report
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate report: {str(e)}"
        )


@router.delete("/session/{session_id}")
async def end_interview_session(session_id: str, current_user_id: str = Depends(get_current_user_id)):
    """
    End an interview session
    
    Generates a final report and cleans up the session.
    """
    if session_id not in pi_sessions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found"
        )
    
    try:
        session = pi_sessions[session_id]
        interviewer = session["interviewer"]
        
        # Generate final report
        report = interviewer.generate_report()
        
        # Clean up session
        del pi_sessions[session_id]
        
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
    """List all active PI interview sessions"""
    active_sessions = []
    for session_id, session_data in pi_sessions.items():
        active_sessions.append({
            "session_id": session_id,
            "mode": session_data["mode"],
            "current_stage": session_data["current_stage"],
            "started_at": session_data["started_at"],
            "candidate_name": session_data["candidate_profile"].get("name", "Unknown"),
            "response_count": session_data.get("response_count", 0)
        })
    
    return {
        "active_sessions": active_sessions,
        "total_count": len(active_sessions)
    }


@router.get("/preparation-tips")
async def get_preparation_tips(current_user_id: str = Depends(get_current_user_id)):
    """Get tips for preparing for personal interviews"""
    return {
        "general_tips": [
            "Research the organization and its values",
            "Practice answering common interview questions",
            "Prepare specific examples from your experiences",
            "Work on your communication skills",
            "Dress professionally and maintain good posture",
            "Arrive early and stay calm",
            "Be honest and authentic in your responses",
            "Ask thoughtful questions at the end"
        ],
        "olq_focus_areas": [
            {
                "olq": "Effective Intelligence",
                "tips": ["Stay updated on current affairs", "Practice logical reasoning", "Develop analytical thinking"]
            },
            {
                "olq": "Social Adaptability",
                "tips": ["Practice active listening", "Show empathy in responses", "Demonstrate team orientation"]
            },
            {
                "olq": "Courage",
                "tips": ["Share examples of standing up for principles", "Discuss handling difficult situations", "Show moral strength"]
            },
            {
                "olq": "Sense of Responsibility",
                "tips": ["Highlight accountability examples", "Discuss commitment to duties", "Show reliability"]
            },
            {
                "olq": "Determination",
                "tips": ["Share stories of perseverance", "Discuss overcoming obstacles", "Show goal orientation"]
            }
        ],
        "common_mistakes": [
            "Giving one-word answers",
            "Speaking negatively about others",
            "Lack of preparation about the organization",
            "Overconfidence or arrogance",
            "Inconsistent answers",
            "Lack of examples to support claims",
            "Poor body language",
            "Not asking any questions"
        ],
        "recommended_resources": [
            "Book: 'Face the Interview' by Col. R.S. Bidwell",
            "Book: 'SSB Interview: The Complete Guide' by Dr. N.K. Natarajan",
            "Practice: Mock interviews with peers",
            "Current Affairs: The Hindu newspaper daily",
            "YouTube: SSB interview guidance channels"
        ]
    }


def _get_mode_tips(mode: str) -> str:
    """Get tips based on interview mode"""
    tips = {
        "practice": "This is a practice session. Focus on improving your responses and don't worry about scoring. Feedback will be provided after each response.",
        "assessment": "This is a full assessment. Answer honestly and to the best of your ability. A comprehensive report will be generated at the end.",
        "training": "This is a training session. You'll receive guidance and coaching throughout. Take your time and learn from each question."
    }
    return tips.get(mode, "Answer honestly and to the best of your ability.")