"""
AI Brigadier Personal Interviewer Agent

This module implements a Brigadier-level AI interviewer for live personal interviews.
The AI conducts interviews in a professional manner, asks follow-up questions,
and evaluates candidate responses against OLQ criteria.
"""

from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
from enum import Enum
import random
import json
import os
from .brigadier_assessor import get_brigadier_assessor


class InterviewStage(Enum):
    """Interview stages"""
    INTRODUCTION = "introduction"
    CORE_ASSESSMENT = "core_assessment"
    STRESS_TESTING = "stress_testing"
    MOTIVATION_ASSESSMENT = "motivation_assessment"
    CLOSURE = "closure"
    COMPLETED = "completed"


class InterviewMode(Enum):
    """Interview modes"""
    PRACTICE = "practice"
    ASSESSMENT = "assessment"
    TRAINING = "training"
    FULL_SSB = "full_ssb"


class QuestionType(Enum):
    """Types of questions"""
    ICE_BREAKER = "ice_breaker"
    PERSONAL = "personal"
    EDUCATION = "education"
    LEADERSHIP = "leadership"
    ETHICS = "ethics"
    CURRENT_AFFAIRS = "current_affairs"
    SITUATIONAL = "situational"
    STRESS = "stress"
    MOTIVATION = "motivation"
    CLOSURE = "closure"


class PIInterviewer:
    """
    AI Brigadier Personal Interviewer
    
    Conducts live personal interviews with candidates, asking questions,
    evaluating responses, and providing feedback in the persona of a
    seasoned Brigadier with 25+ years of SSB interview experience.
    """
    
    def __init__(self, mode: InterviewMode = InterviewMode.ASSESSMENT, model=None):
        self.mode = mode
        self.current_stage = InterviewStage.INTRODUCTION
        self.assessor = get_brigadier_assessor(model)
        self.question_history: List[Dict[str, Any]] = []
        self.response_history: List[Dict[str, Any]] = []
        self.olq_scores: Dict[str, float] = self._initialize_olq_scores()
        self.candidate_profile: Optional[Dict[str, Any]] = None
        self.interview_start_time: Optional[datetime] = None
        self.stage_start_time: Optional[datetime] = None
        self.current_question: Optional[Dict[str, Any]] = None
        self.follow_up_count: int = 0
        self.max_follow_ups: int = 3
        
        # Load question bank
        self.question_bank = self._load_question_bank()
        
        # Brigadier persona settings
        self.persona = {
            "rank": "Brigadier",
            "tone": "Professional yet supportive",
            "greeting": "Good morning/afternoon. Please have a seat. I am Brigadier Sharma, and I'll be conducting your interview today.",
            "closing": "Thank you for your time. Do you have any questions for me before we conclude?"
        }
    
    def _initialize_olq_scores(self) -> Dict[str, float]:
        """Initialize OLQ score tracking"""
        return {
            "Effective Intelligence": 0.0,
            "Reasoning Ability": 0.0,
            "Power of Expression": 0.0,
            "Organising Ability": 0.0,
            "Ability to Influence the Group": 0.0,
            "Social Adaptability": 0.0,
            "Cooperation": 0.0,
            "Sense of Responsibility": 0.0,
            "Initiative": 0.0,
            "Self-Confidence": 0.0,
            "Speed of Decision": 0.0,
            "Determination": 0.0,
            "Courage": 0.0,
            "Stamina": 0.0,
            "Liveliness": 0.0
        }
    
    def _load_question_bank(self) -> Dict[str, Any]:
        """Load the PI question bank from file"""
        try:
            question_bank_path = os.path.join(
                os.path.dirname(__file__),
                "../../../database/datasets/practice_questions/pi_practice_bank.json"
            )
            
            if os.path.exists(question_bank_path):
                with open(question_bank_path, 'r') as f:
                    return json.load(f)
        except Exception as e:
            print(f"Warning: Could not load question bank: {e}")
        
        # Return default structure if file not found
        return self._get_default_question_bank()
    
    def _get_default_question_bank(self) -> Dict[str, Any]:
        """Return a default question bank structure"""
        return {
            "question_categories": [
                {
                    "category": "Personal Background",
                    "questions": [
                        {
                            "id": "PI_PB_001",
                            "question": "Tell me about yourself and your family background.",
                            "purpose": "Ice breaker",
                            "follow_up_prompts": [
                                "What values did your family instill in you?",
                                "How has your family influenced your career choice?"
                            ],
                            "olq_mapping": ["Social Adaptability", "Sense of Responsibility"]
                        }
                    ]
                }
            ]
        }
    
    def start_interview(self, candidate_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Start a new interview session
        
        Args:
            candidate_profile: Candidate's profile information
            
        Returns:
            Dictionary containing the first question and interview details
        """
        self.candidate_profile = candidate_profile
        self.interview_start_time = datetime.now()
        self.stage_start_time = datetime.now()
        self.current_stage = InterviewStage.INTRODUCTION
        
        # Generate greeting
        greeting = self._generate_greeting()
        
        # Get first question based on stage
        first_question = self._get_next_question()
        self.current_question = first_question
        
        return {
            "session_started": True,
            "greeting": greeting,
            "stage": self.current_stage.value,
            "question": first_question.get("question", ""),
            "question_type": first_question.get("category", ""),
            "instructions": self._get_stage_instructions(),
            "candidate_profile": candidate_profile,
            "mode": self.mode.value
        }
    
    def process_response(self, response: str) -> Dict[str, Any]:
        """
        Process a candidate's response
        
        Args:
            response: Candidate's response text
            
        Returns:
            Dictionary containing analysis, feedback, and next question
        """
        if not self.current_question:
            raise ValueError("No active question. Start interview first.")
        
        # Analyze the response
        analysis = self._analyze_response(response)
        
        # Store response history
        self.response_history.append({
            "question_id": self.current_question.get("id"),
            "question": self.current_question.get("question"),
            "response": response,
            "analysis": analysis,
            "timestamp": datetime.now().isoformat()
        })
        
        # Update OLQ scores
        self._update_olq_scores(analysis)
        
        # Determine if follow-up is needed
        needs_follow_up = self._needs_follow_up(analysis)
        
        if needs_follow_up and self.follow_up_count < self.max_follow_ups:
            # Generate follow-up question
            follow_up = self._generate_follow_up(analysis)
            self.current_question = follow_up
            self.follow_up_count += 1
            
            return {
                "analysis": analysis,
                "feedback": self._generate_feedback(analysis),
                "next_question": follow_up.get("question", ""),
                "question_type": "follow_up",
                "is_follow_up": True,
                "follow_up_count": self.follow_up_count,
                "stage": self.current_stage.value
            }
        else:
            # Move to next question or stage
            self.follow_up_count = 0
            next_question = self._get_next_question()
            
            if next_question is None:
                # Interview completed
                self.current_stage = InterviewStage.COMPLETED
                return {
                    "analysis": analysis,
                    "feedback": self._generate_feedback(analysis),
                    "interview_completed": True,
                    "final_report": self.generate_report()
                }
            
            self.current_question = next_question
            
            return {
                "analysis": analysis,
                "feedback": self._generate_feedback(analysis),
                "next_question": next_question.get("question", ""),
                "question_type": next_question.get("category", ""),
                "is_follow_up": False,
                "stage": self.current_stage.value,
                "stage_changed": self._check_stage_transition()
            }
    
    def _analyze_response(self, response: str) -> Dict[str, Any]:
        """
        Analyze a candidate's response against OLQ criteria using BrigadierAssessor
        """
        analysis_context = {
            "stage": self.current_stage.value,
            "mode": self.mode.value,
            "question": self.current_question,
            "candidate_profile": self.candidate_profile
        }
        
        # This calls the AI model (gemini-flash-latest) via structured output
        detailed_analysis = self.assessor.analyze_response(response, analysis_context)
        
        # Standardize basic analysis metrics for compatibility with existing flow
        word_count = len(response.split())
        
        red_flags = detailed_analysis.get("red_flags_detected", [])
        green_flags = detailed_analysis.get("green_flags_detected", [])
        
        # Derive a simplified content_score based on the Assessor's overall confidence / evaluation
        # The Assessor gives nuanced scores per OLQ. We can use the average.
        olq_scores = [v.get("score", 3) for v in detailed_analysis.get("olq_analysis", {}).values()]
        avg_score = sum(olq_scores) / len(olq_scores) if olq_scores else 3.0
        
        positive_indicators = 1 if avg_score > 3 else 0
        negative_indicators = 1 if avg_score < 3 else 0
        
        return {
            "response_text": response,
            "word_count": word_count,
            "has_structure": avg_score >= 3.5,
            "has_examples": len(green_flags) > 0,
            "positive_indicators": positive_indicators,
            "negative_indicators": negative_indicators,
            "communication_score": avg_score,
            "content_score": avg_score,
            "overall_impression": "positive" if avg_score >= 3.0 else "needs_improvement",
            "detected_olqs": list(detailed_analysis.get("olq_analysis", {}).keys()),
            "red_flags": red_flags,
            "green_flags": green_flags,
            "detailed_analysis": detailed_analysis
        }
    
    def _detect_olqs(self, response: str) -> List[str]:
        """Detect which OLQs are demonstrated in the response"""
        olq_keywords = {
            "Effective Intelligence": ["analyzed", "understood", "figured out", "solved", "planned"],
            "Reasoning Ability": ["because", "therefore", "logic", "reason", "conclusion"],
            "Power of Expression": ["explained", "communicated", "presented", "articulated"],
            "Organising Ability": ["organized", "coordinated", "planned", "managed", "structured"],
            "Ability to Influence the Group": ["led", "motivated", "inspired", "guided", "directed"],
            "Social Adaptability": ["adapted", "adjusted", "understood", "empathized", "connected"],
            "Cooperation": ["together", "collaborated", "helped", "supported", "team"],
            "Sense of Responsibility": ["responsible", "accountable", "duty", "obligation", "commitment"],
            "Initiative": ["initiated", "started", "proactive", "volunteered", "took charge"],
            "Self-Confidence": ["confident", "believed", "assured", "certain", "convinced"],
            "Speed of Decision": ["decided quickly", "immediate", "prompt", "without hesitation"],
            "Determination": ["persisted", "continued", "didn't give up", "kept trying", "persevered"],
            "Courage": ["brave", "courageous", "faced fear", "stood up", "despite risk"],
            "Stamina": ["endured", "sustained", "long-term", "persistent effort", "marathon"],
            "Liveliness": ["enthusiastic", "energetic", "positive", "optimistic", "cheerful"]
        }
        
        detected = []
        response_lower = response.lower()
        
        for olq, keywords in olq_keywords.items():
            if any(keyword in response_lower for keyword in keywords):
                detected.append(olq)
        
        return detected
    
    def _detect_red_flags(self, response: str) -> List[str]:
        """Detect potential red flags in the response"""
        red_flag_indicators = {
            "Avoiding responsibility": ["it wasn't my fault", "they made me", "I had no choice", "blamed"],
            "Lack of empathy": ["didn't care", "not my problem", "their issue", "not concerned"],
            "Dishonesty indicators": ["lied", "hid", "covered up", "didn't tell"],
            "Giving up easily": ["gave up", "quit", "stopped trying", "couldn't do it"],
            "Blaming others": ["it was their fault", "they ruined", "because of them", "they caused"]
        }
        
        flags = []
        response_lower = response.lower()
        
        for flag, indicators in red_flag_indicators.items():
            if any(indicator in response_lower for indicator in indicators):
                flags.append(flag)
        
        return flags
    
    def _detect_green_flags(self, response: str) -> List[str]:
        """Detect positive indicators in the response"""
        green_flag_indicators = {
            "Taking initiative": ["I initiated", "I started", "I volunteered", "I took charge"],
            "Helping others": ["helped", "assisted", "supported", "guided", "mentored"],
            "Ethical behavior": ["ethical", "honest", "integrity", "right thing", "principles"],
            "Leadership": ["led", "guided", "motivated", "inspired", "directed"],
            "Team orientation": ["team", "together", "collaborated", "we", "our group"],
            "Learning from failure": ["learned", "improved", "grew", "developed", "realized"]
        }
        
        flags = []
        response_lower = response.lower()
        
        for flag, indicators in green_flag_indicators.items():
            if any(indicator in response_lower for indicator in indicators):
                flags.append(flag)
        
        return flags
    
    def _update_olq_scores(self, analysis: Dict[str, Any]):
        """Update OLQ scores based on analysis"""
        for olq in analysis.get("detected_olqs", []):
            if olq in self.olq_scores:
                # Incremental scoring
                current = self.olq_scores[olq]
                self.olq_scores[olq] = min(5.0, current + 0.5)
        
        # Penalize for red flags
        for _ in analysis.get("red_flags", []):
            for olq in self.olq_scores:
                self.olq_scores[olq] = max(1.0, self.olq_scores[olq] - 0.3)
        
        # Bonus for green flags
        for _ in analysis.get("green_flags", []):
            for olq in self.olq_scores:
                self.olq_scores[olq] = min(5.0, self.olq_scores[olq] + 0.2)
    
    def _get_next_question(self) -> Optional[Dict[str, Any]]:
        """Get the next question based on current stage"""
        stage_questions = self._get_questions_for_stage(self.current_stage)
        
        if not stage_questions:
            # Move to next stage
            self._advance_stage()
            stage_questions = self._get_questions_for_stage(self.current_stage)
        
        if not stage_questions:
            return None
        
        # Select question (avoid repeats)
        asked_ids = [r.get("question_id") for r in self.response_history]
        available = [q for q in stage_questions if q.get("id") not in asked_ids]
        
        if not available:
            available = stage_questions  # Fall back to all questions
        
        return random.choice(available) if available else None
    
    def _get_questions_for_stage(self, stage: InterviewStage) -> List[Dict[str, Any]]:
        """Get questions appropriate for the current stage"""
        stage_category_map = {
            InterviewStage.INTRODUCTION: ["Personal Background"],
            InterviewStage.CORE_ASSESSMENT: ["Education & Career", "Leadership & Teamwork", "Ethics & Values", "Current Affairs & General Awareness"],
            InterviewStage.STRESS_TESTING: ["Situational & Stress Questions"],
            InterviewStage.MOTIVATION_ASSESSMENT: ["Motivation & Commitment"],
            InterviewStage.CLOSURE: []
        }
        
        categories = stage_category_map.get(stage, [])
        questions = []
        
        for category_data in self.question_bank.get("question_categories", []):
            if category_data.get("category") in categories:
                questions.extend(category_data.get("questions", []))
        
        return questions
    
    def _advance_stage(self):
        """Advance to the next interview stage"""
        stage_order = [
            InterviewStage.INTRODUCTION,
            InterviewStage.CORE_ASSESSMENT,
            InterviewStage.STRESS_TESTING,
            InterviewStage.MOTIVATION_ASSESSMENT,
            InterviewStage.CLOSURE
        ]
        
        current_index = stage_order.index(self.current_stage) if self.current_stage in stage_order else 0
        
        if current_index < len(stage_order) - 1:
            self.current_stage = stage_order[current_index + 1]
            self.stage_start_time = datetime.now()
            self.follow_up_count = 0
    
    def _check_stage_transition(self) -> bool:
        """Check if stage has transitioned"""
        # Simple check based on response count
        stage_question_counts = {
            InterviewStage.INTRODUCTION: 2,
            InterviewStage.CORE_ASSESSMENT: 8,
            InterviewStage.STRESS_TESTING: 4,
            InterviewStage.MOTIVATION_ASSESSMENT: 3,
            InterviewStage.CLOSURE: 1
        }
        
        stage_responses = [r for r in self.response_history 
                          if self._get_question_category(r.get("question_id")) == self.current_stage]
        
        return len(stage_responses) >= stage_question_counts.get(self.current_stage, 10)
    
    def _get_question_category(self, question_id: Optional[str]) -> InterviewStage:
        """Get the stage for a question based on its ID"""
        if not question_id:
            return self.current_stage
        
        for category_data in self.question_bank.get("question_categories", []):
            for question in category_data.get("questions", []):
                if question.get("id") == question_id:
                    category = category_data.get("category", "")
                    if "Personal Background" in category:
                        return InterviewStage.INTRODUCTION
                    elif "Situational & Stress" in category:
                        return InterviewStage.STRESS_TESTING
                    elif "Motivation" in category:
                        return InterviewStage.MOTIVATION_ASSESSMENT
                    else:
                        return InterviewStage.CORE_ASSESSMENT
        
        return self.current_stage
    
    def _generate_greeting(self) -> str:
        """Generate a personalized greeting"""
        name = self.candidate_profile.get("name", "Candidate") if self.candidate_profile else "Candidate"
        
        greetings = [
            f"Good morning, {name}. Please have a seat. I am Brigadier Sharma, and I'll be conducting your interview today.",
            f"Good afternoon, {name}. Welcome. I'm Brigadier Sharma. Please make yourself comfortable.",
            f"Hello, {name}. I'm Brigadier Sharma. Thank you for coming in today."
        ]
        
        return random.choice(greetings)
    
    def _get_stage_instructions(self) -> str:
        """Get instructions for the current stage"""
        instructions = {
            InterviewStage.INTRODUCTION: "I'd like to start by getting to know you better. Please answer my questions honestly and in detail.",
            InterviewStage.CORE_ASSESSMENT: "Now let's discuss your background, experiences, and views in more detail.",
            InterviewStage.STRESS_TESTING: "I'm going to present you with some challenging scenarios. Take your time to think before responding.",
            InterviewStage.MOTIVATION_ASSESSMENT: "I'd like to understand your motivation for joining the armed forces.",
            InterviewStage.CLOSURE: "We're almost done. Do you have any questions for me?"
        }
        
        return instructions.get(self.current_stage, "")
    
    def _generate_follow_up(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a follow-up question based on analysis"""
        # Get follow-up prompts from current question
        follow_ups = self.current_question.get("follow_up_prompts", [])
        
        if follow_ups and self.follow_up_count < len(follow_ups):
            follow_up_text = follow_ups[self.follow_up_count]
        else:
            # Generate dynamic follow-up based on analysis
            if analysis.get("negative_indicators", 0) > analysis.get("positive_indicators", 0):
                follow_up_text = "Can you elaborate on that? I'd like to understand your thinking better."
            elif not analysis.get("has_examples", False):
                follow_up_text = "Can you give me a specific example to illustrate your point?"
            else:
                follow_up_text = "That's interesting. How did that experience shape your perspective?"
        
        return {
            "id": f"follow_up_{self.current_question.get('id', 'unknown')}_{self.follow_up_count}",
            "question": follow_up_text,
            "category": "follow_up",
            "purpose": "Deeper exploration of candidate's response"
        }
    
    def _generate_feedback(self, analysis: Dict[str, Any]) -> str:
        """Generate feedback for the candidate's response"""
        if self.mode == InterviewMode.PRACTICE or self.mode == InterviewMode.TRAINING:
            feedback_parts = []
            
            if analysis.get("positive_indicators", 0) > analysis.get("negative_indicators", 0):
                feedback_parts.append("Good response. You demonstrated positive thinking.")
            else:
                feedback_parts.append("Consider reframing your response more positively.")
            
            if not analysis.get("has_examples", False):
                feedback_parts.append("Try to include specific examples to strengthen your answer.")
            
            if analysis.get("red_flags"):
                feedback_parts.append(f"Be careful about: {', '.join(analysis['red_flags'])}")
            
            if analysis.get("green_flags"):
                feedback_parts.append(f"Good demonstration of: {', '.join(analysis['green_flags'])}")
            
            return " ".join(feedback_parts) if feedback_parts else "Keep going."
        
        return ""  # No feedback in assessment mode
    
    def _needs_follow_up(self, analysis: Dict[str, Any]) -> bool:
        """Determine if a follow-up question is needed"""
        # Need follow-up if response is too short
        if analysis.get("word_count", 0) < 30:
            return True
        
        # Need follow-up if no examples provided
        if not analysis.get("has_examples", False):
            return True
        
        # Need follow-up if red flags detected
        if analysis.get("red_flags"):
            return True
        
        return False
    
    def generate_report(self) -> Dict[str, Any]:
        """Generate a comprehensive interview report"""
        # Calculate final OLQ scores
        normalized_scores = {}
        for olq, score in self.olq_scores.items():
            # Normalize based on number of responses
            response_count = len(self.response_history)
            if response_count > 0:
                normalized_scores[olq] = round(score / (response_count * 0.5) * 5.0, 2)
            else:
                normalized_scores[olq] = 0.0
        
        # Calculate overall score
        overall_score = round(sum(normalized_scores.values()) / len(normalized_scores), 2) if normalized_scores else 0.0
        
        # Determine recommendation
        if overall_score >= 3.5:
            recommendation = "Recommended"
        elif overall_score >= 2.5:
            recommendation = "Borderline - Needs Improvement"
        else:
            recommendation = "Not Recommended"
        
        # Compile strengths and weaknesses
        strengths = []
        weaknesses = []
        
        for olq, score in normalized_scores.items():
            if score >= 4.0:
                strengths.append(f"{olq}: Strong demonstration")
            elif score < 2.5:
                weaknesses.append(f"{olq}: Needs improvement")
        
        return {
            "interview_summary": {
                "candidate_name": self.candidate_profile.get("name", "Unknown") if self.candidate_profile else "Unknown",
                "interview_date": self.interview_start_time.isoformat() if self.interview_start_time else None,
                "duration_minutes": ((datetime.now() - self.interview_start_time).total_seconds() / 60) if self.interview_start_time else 0,
                "total_questions": len(self.response_history),
                "mode": self.mode.value
            },
            "overall_score": overall_score,
            "recommendation": recommendation,
            "olq_scores": normalized_scores,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "response_history": self.response_history,
            "detailed_feedback": self._generate_detailed_feedback()
        }
    
    def _generate_detailed_feedback(self) -> Dict[str, Any]:
        """Generate detailed feedback for the candidate"""
        all_red_flags = []
        all_green_flags = []
        
        for response in self.response_history:
            analysis = response.get("analysis", {})
            all_red_flags.extend(analysis.get("red_flags", []))
            all_green_flags.extend(analysis.get("green_flags", []))
        
        return {
            "communication": {
                "average_word_count": sum(r.get("analysis", {}).get("word_count", 0) for r in self.response_history) / max(1, len(self.response_history)),
                "structured_responses": sum(1 for r in self.response_history if r.get("analysis", {}).get("has_structure", False)),
                "example_usage": sum(1 for r in self.response_history if r.get("analysis", {}).get("has_examples", False))
            },
            "red_flags_summary": list(set(all_red_flags)),
            "green_flags_summary": list(set(all_green_flags)),
            "improvement_areas": self._suggest_improvements()
        }
    
    def _suggest_improvements(self) -> List[str]:
        """Suggest areas for improvement based on interview performance"""
        suggestions = []
        
        # Check communication
        avg_word_count = sum(r.get("analysis", {}).get("word_count", 0) for r in self.response_history) / max(1, len(self.response_history))
        if avg_word_count < 50:
            suggestions.append("Work on providing more detailed and elaborate responses.")
        
        # Check for examples
        example_count = sum(1 for r in self.response_history if r.get("analysis", {}).get("has_examples", False))
        if example_count < len(self.response_history) * 0.5:
            suggestions.append("Include more specific examples to support your answers.")
        
        # Check for red flags
        red_flag_count = sum(len(r.get("analysis", {}).get("red_flags", [])) for r in self.response_history)
        if red_flag_count > 0:
            suggestions.append("Avoid responses that may indicate avoiding responsibility or blaming others.")
        
        return suggestions


def get_pi_interviewer(mode: str = "assessment", model=None) -> PIInterviewer:
    """Factory function to create a PI interviewer"""
    mode_map = {
        "practice": InterviewMode.PRACTICE,
        "assessment": InterviewMode.ASSESSMENT,
        "training": InterviewMode.TRAINING,
        "full_ssb": InterviewMode.FULL_SSB
    }
    return PIInterviewer(mode_map.get(mode.lower(), InterviewMode.ASSESSMENT), model)
