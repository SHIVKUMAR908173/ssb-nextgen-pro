"""
Mock Test System for SSB Preparation

This module provides full-length timed mock tests for both Stage I and Stage II
of the SSB selection process.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from datetime import datetime
import random
import json

router = APIRouter()

# ==================== Mock Test Data ====================

# Sample OIR questions for mock tests
MOCK_OIR_QUESTIONS = [
    {
        "id": "OIR_M1_Q1",
        "type": "verbal",
        "question": "Find the word most similar to 'Courageous': Brave, Timid, Strong, Bold",
        "options": ["Brave", "Timid", "Strong", "Bold"],
        "correct_answer": "Brave",
        "difficulty": "easy"
    },
    {
        "id": "OIR_M1_Q2",
        "type": "verbal",
        "question": "If all soldiers are brave and some brave people are leaders, which statement is definitely true?",
        "options": [
            "All leaders are soldiers",
            "Some soldiers may be leaders",
            "No soldiers are leaders",
            "All brave people are soldiers"
        ],
        "correct_answer": "Some soldiers may be leaders",
        "difficulty": "medium"
    },
    {
        "id": "OIR_M1_Q3",
        "type": "visual",
        "question": "In a certain code, ARMY is written as BSNZ. How is NAVY written in that code?",
        "options": ["OBWZ", "MCUX", "OAWZ", "NBWZ"],
        "correct_answer": "OBWZ",
        "difficulty": "medium"
    },
    {
        "id": "OIR_M1_Q4",
        "type": "verbal",
        "question": "Choose the odd one out:",
        "options": ["Captain", "Major", "Lieutenant", "Professor"],
        "correct_answer": "Professor",
        "difficulty": "easy"
    },
    {
        "id": "OIR_M1_Q5",
        "type": "visual",
        "question": "If a clock shows 3:15, what is the angle between the hour and minute hands?",
        "options": ["0°", "7.5°", "15°", "30°"],
        "correct_answer": "7.5°",
        "difficulty": "hard"
    }
]

# Sample WAT words for mock tests
MOCK_WAT_WORDS = [
    {"word": "Challenge", "difficulty": "medium"},
    {"word": "Victory", "difficulty": "easy"},
    {"word": "Determination", "difficulty": "hard"},
    {"word": "Team", "difficulty": "easy"},
    {"word": "Responsibility", "difficulty": "medium"},
    {"word": "Courage", "difficulty": "hard"},
    {"word": "Leader", "difficulty": "medium"},
    {"word": "Success", "difficulty": "easy"},
]

# Sample SRT scenarios for mock tests
MOCK_SRT_SCENARIOS = [
    {
        "id": "SRT_M1_S1",
        "scenario": "You are walking on a road and see an accident. You:",
        "difficulty": "medium"
    },
    {
        "id": "SRT_M1_S2",
        "scenario": "Your team is losing a match. You:",
        "difficulty": "easy"
    },
    {
        "id": "SRT_M1_S3",
        "scenario": "You find a wallet with important documents and money. You:",
        "difficulty": "medium"
    },
    {
        "id": "SRT_M1_S4",
        "scenario": "Your friend is in trouble and needs your help urgently. You:",
        "difficulty": "hard"
    }
]

# ==================== Models ====================

class MockTestConfig(BaseModel):
    """Configuration for a mock test"""
    test_type: str  # "stage1", "stage2", "full"
    user_id: Optional[str] = None


class MockTestSession(BaseModel):
    """A mock test session"""
    session_id: str
    test_type: str
    start_time: str
    time_limit_minutes: int
    sections: List[Dict[str, Any]]


class MockTestSubmission(BaseModel):
    """Submission for a mock test"""
    session_id: str
    responses: Dict[str, Any]
    time_taken_minutes: int


class MockTestResult(BaseModel):
    """Result of a mock test"""
    session_id: str
    overall_score: float
    section_scores: Dict[str, float]
    olq_analysis: Dict[str, float]
    recommendation: str
    feedback: str
    strengths: List[str]
    areas_for_improvement: List[str]


# ==================== Mock Test Manager ====================

class MockTestManager:
    """Manages mock test sessions"""
    
    def __init__(self):
        self._sessions: Dict[str, Dict] = {}
    
    def create_session(self, test_type: str, user_id: Optional[str] = None) -> MockTestSession:
        """Create a new mock test session"""
        session_id = f"mock_{test_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        if test_type == "stage1":
            sections = self._create_stage1_sections()
            time_limit = 60  # 60 minutes for Stage 1
        elif test_type == "stage2_psych":
            sections = self._create_stage2_psych_sections()
            time_limit = 90  # 90 minutes for Psychology
        elif test_type == "full":
            sections = self._create_full_test_sections()
            time_limit = 180  # 3 hours for full test
        else:
            raise ValueError(f"Unknown test type: {test_type}")
        
        session = MockTestSession(
            session_id=session_id,
            test_type=test_type,
            start_time=datetime.now().isoformat(),
            time_limit_minutes=time_limit,
            sections=sections
        )
        
        self._sessions[session_id] = {
            "session": session,
            "user_id": user_id,
            "started": True,
            "submitted": False
        }
        
        return session
    
    def submit_test(self, submission: MockTestSubmission) -> MockTestResult:
        """Submit and evaluate a mock test"""
        if submission.session_id not in self._sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session_data = self._sessions[submission.session_id]
        session = session_data["session"]
        
        # Evaluate each section
        section_scores = {}
        all_olq_scores = {}
        
        for section in session.sections:
            section_id = section["id"]
            section_type = section["type"]
            section_responses = submission.responses.get(section_id, {})
            
            score = self._evaluate_section(section_type, section, section_responses)
            section_scores[section_id] = score
            
            # Aggregate OLQ scores
            if "olq_scores" in score:
                for olq, s in score["olq_scores"].items():
                    if olq not in all_olq_scores:
                        all_olq_scores[olq] = []
                    all_olq_scores[olq].append(s)
        
        # Calculate overall score
        overall_score = sum(section_scores.values()) / len(section_scores) if section_scores else 0
        
        # Average OLQ scores
        final_olq = {olq: sum(scores)/len(scores) for olq, scores in all_olq_scores.items()}
        
        # Determine recommendation
        if overall_score >= 70:
            recommendation = "RECOMMENDED"
        elif overall_score >= 50:
            recommendation = "BORDERLINE"
        else:
            recommendation = "NOT RECOMMENDED"
        
        # Generate feedback
        strengths = [olq for olq, score in final_olq.items() if score >= 4.0]
        improvements = [olq for olq, score in final_olq.items() if score < 3.0]
        
        feedback = self._generate_feedback(overall_score, strengths, improvements)
        
        result = MockTestResult(
            session_id=submission.session_id,
            overall_score=round(overall_score, 2),
            section_scores={k: round(v, 2) for k, v in section_scores.items()},
            olq_analysis={k: round(v, 2) for k, v in final_olq.items()},
            recommendation=recommendation,
            feedback=feedback,
            strengths=strengths,
            areas_for_improvement=improvements
        )
        
        # Mark session as submitted
        session_data["submitted"] = True
        session_data["result"] = result
        
        return result
    
    def _create_stage1_sections(self) -> List[Dict]:
        """Create Stage 1 (OIR + PPDT) sections"""
        return [
            {
                "id": "oir",
                "type": "oir",
                "name": "Officer Intelligence Rating Test",
                "time_limit": 30,
                "questions": random.sample(MOCK_OIR_QUESTIONS, min(5, len(MOCK_OIR_QUESTIONS))),
                "total_questions": 5
            },
            {
                "id": "wat",
                "type": "wat",
                "name": "Word Association Test",
                "time_limit": 15,
                "words": random.sample(MOCK_WAT_WORDS, min(8, len(MOCK_WAT_WORDS))),
                "total_words": 8
            },
            {
                "id": "srt",
                "type": "srt",
                "name": "Situation Reaction Test",
                "time_limit": 15,
                "scenarios": random.sample(MOCK_SRT_SCENARIOS, min(4, len(MOCK_SRT_SCENARIOS))),
                "total_scenarios": 4
            }
        ]
    
    def _create_stage2_psych_sections(self) -> List[Dict]:
        """Create Stage 2 Psychology sections"""
        return [
            {
                "id": "wat",
                "type": "wat",
                "name": "Word Association Test",
                "time_limit": 15,
                "words": random.sample(MOCK_WAT_WORDS, min(8, len(MOCK_WAT_WORDS))),
                "total_words": 8
            },
            {
                "id": "srt",
                "type": "srt",
                "name": "Situation Reaction Test",
                "time_limit": 20,
                "scenarios": random.sample(MOCK_SRT_SCENARIOS, min(4, len(MOCK_SRT_SCENARIOS))),
                "total_scenarios": 4
            },
            {
                "id": "tat",
                "type": "tat",
                "name": "Thematic Apperception Test",
                "time_limit": 30,
                "pictures": [
                    {"id": "TAT_1", "description": "A person sitting alone"},
                    {"id": "TAT_2", "description": "Two people in discussion"}
                ],
                "total_pictures": 2
            },
            {
                "id": "sd",
                "type": "sd",
                "name": "Self Description",
                "time_limit": 25,
                "sections": ["self", "parents", "friends", "teachers"]
            }
        ]
    
    def _create_full_test_sections(self) -> List[Dict]:
        """Create full SSB test sections"""
        return (
            self._create_stage1_sections() + 
            self._create_stage2_psych_sections()
        )
    
    def _evaluate_section(self, section_type: str, section: Dict, responses: Dict) -> Dict:
        """Evaluate a specific section"""
        if section_type == "oir":
            return self._evaluate_oir(section, responses)
        elif section_type == "wat":
            return self._evaluate_wat(section, responses)
        elif section_type == "srt":
            return self._evaluate_srt(section, responses)
        elif section_type == "tat":
            return self._evaluate_tat(section, responses)
        elif section_type == "sd":
            return self._evaluate_sd(section, responses)
        return {"score": 0, "olq_scores": {}}
    
    def _evaluate_oir(self, section: Dict, responses: Dict) -> Dict:
        """Evaluate OIR section"""
        questions = section.get("questions", [])
        correct = 0
        total = len(questions)
        
        for q in questions:
            user_answer = responses.get(q["id"])
            if user_answer == q["correct_answer"]:
                correct += 1
        
        score = (correct / total * 5) if total > 0 else 0
        
        return {
            "score": round(score, 2),
            "correct": correct,
            "total": total,
            "olq_scores": {
                "Effective Intelligence": score,
                "Reasoning Ability": score
            }
        }
    
    def _evaluate_wat(self, section: Dict, responses: Dict) -> Dict:
        """Evaluate WAT section"""
        words = section.get("words", [])
        total = len(words)
        positive_count = 0
        
        for word in words:
            response = responses.get(word["word"], "")
            # Simple positivity check (in production, use AI evaluation)
            positive_words = ["help", "success", "win", "achieve", "lead", "brave", "strong"]
            if any(pw in response.lower() for pw in positive_words):
                positive_count += 1
        
        score = (positive_count / total * 5) if total > 0 else 0
        
        return {
            "score": round(score, 2),
            "positive_responses": positive_count,
            "total": total,
            "olq_scores": {
                "Social Adaptability": score,
                "Cooperation": score,
                "Initiative": score
            }
        }
    
    def _evaluate_srt(self, section: Dict, responses: Dict) -> Dict:
        """Evaluate SRT section"""
        scenarios = section.get("scenarios", [])
        total = len(scenarios)
        action_oriented = 0
        
        for scenario in scenarios:
            response = responses.get(scenario["id"], "")
            # Check for action-oriented responses
            action_words = ["help", "act", "solve", "rescue", "alert", "inform", "take"]
            if any(aw in response.lower() for aw in action_words):
                action_oriented += 1
        
        score = (action_oriented / total * 5) if total > 0 else 0
        
        return {
            "score": round(score, 2),
            "action_oriented": action_oriented,
            "total": total,
            "olq_scores": {
                "Speed of Decision": score,
                "Initiative": score,
                "Sense of Responsibility": score
            }
        }
    
    def _evaluate_tat(self, section: Dict, responses: Dict) -> Dict:
        """Evaluate TAT section"""
        pictures = section.get("pictures", [])
        total = len(pictures)
        story_quality = 0
        
        for pic in pictures:
            story = responses.get(pic["id"], "")
            # Simple story quality check
            if len(story) > 50:  # Minimum story length
                story_quality += 1
                # Check for positive themes
                positive_themes = ["success", "help", "overcome", "achieve", "lead"]
                if any(pt in story.lower() for pt in positive_themes):
                    story_quality += 1
        
        max_quality = total * 2
        score = (story_quality / max_quality * 5) if max_quality > 0 else 0
        
        return {
            "score": round(score, 2),
            "stories_written": story_quality // 2,
            "total": total,
            "olq_scores": {
                "Effective Intelligence": score,
                "Social Adaptability": score,
                "Determination": score
            }
        }
    
    def _evaluate_sd(self, section: Dict, responses: Dict) -> Dict:
        """Evaluate SD section"""
        sections = section.get("sections", [])
        total = len(sections)
        completed = 0
        
        for sec in sections:
            response = responses.get(sec, "")
            if len(response) > 20:  # Minimum length check
                completed += 1
        
        score = (completed / total * 5) if total > 0 else 0
        
        return {
            "score": round(score, 2),
            "sections_completed": completed,
            "total": total,
            "olq_scores": {
                "Self-Confidence": score,
                "Social Adaptability": score,
                "Sense of Responsibility": score
            }
        }
    
    def _generate_feedback(self, overall_score: float, strengths: List[str], improvements: List[str]) -> str:
        """Generate overall feedback"""
        if overall_score >= 70:
            return "Excellent performance! You demonstrate strong officer-like qualities. Continue practicing to maintain your edge."
        elif overall_score >= 50:
            return "Good performance with room for improvement. Focus on your weaker OLQs to enhance your overall profile."
        else:
            return "Your performance needs significant improvement. Focus on developing core OLQs through consistent practice and self-reflection."


# Singleton instance
_mock_test_manager = None

def get_mock_test_manager() -> MockTestManager:
    """Get or create the mock test manager singleton"""
    global _mock_test_manager
    if _mock_test_manager is None:
        _mock_test_manager = MockTestManager()
    return _mock_test_manager


# ==================== API Endpoints ====================

@router.post("/mock-test/start", response_model=MockTestSession)
async def start_mock_test(config: MockTestConfig):
    """Start a new mock test session"""
    manager = get_mock_test_manager()
    return manager.create_session(config.test_type, config.user_id)


@router.post("/mock-test/submit", response_model=MockTestResult)
async def submit_mock_test(submission: MockTestSubmission):
    """Submit a completed mock test"""
    manager = get_mock_test_manager()
    return manager.submit_test(submission)


@router.get("/mock-test/sessions/{session_id}")
async def get_session_details(session_id: str):
    """Get details of a mock test session"""
    manager = get_mock_test_manager()
    if session_id not in manager._sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    return manager._sessions[session_id]


@router.get("/mock-test/types")
async def get_test_types():
    """Get available mock test types"""
    return {
        "test_types": [
            {
                "id": "stage1",
                "name": "Stage I Screening Test",
                "description": "OIR + PPDT simulation",
                "duration_minutes": 60,
                "sections": ["OIR", "WAT", "SRT"]
            },
            {
                "id": "stage2_psych",
                "name": "Stage II Psychology Test",
                "description": "Complete psychology battery",
                "duration_minutes": 90,
                "sections": ["WAT", "SRT", "TAT", "SD"]
            },
            {
                "id": "full",
                "name": "Full SSB Mock Test",
                "description": "Complete Stage I and Stage II simulation",
                "duration_minutes": 180,
                "sections": ["OIR", "WAT", "SRT", "TAT", "SD"]
            }
        ]
    }