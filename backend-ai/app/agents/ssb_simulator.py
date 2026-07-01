"""
SSB Interview Simulator - Brigadier Level AI System

This module implements a complete SSB interview simulation system that can:
1. Conduct full SSB interviews (Personal Interview, GPE, SRT, WAT)
2. Evaluate responses using Brigadier-level assessment criteria
3. Generate dynamic follow-up questions based on candidate responses
4. Provide comprehensive feedback and development recommendations

The simulator uses the BrigadierAssessor for evaluation and can operate
in multiple modes: Practice, Assessment, and Training.
"""

import json
import random
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
from enum import Enum

from .brigadier_assessor import BrigadierAssessor, get_brigadier_assessor, OLQ_FRAMEWORK
from .psychologist_assessor import PsychologistAssessor
from .gto_assessor import GTOAssessor


class InterviewMode(Enum):
    """Interview simulation modes"""
    PRACTICE = "practice"  # Low-pressure practice with hints
    ASSESSMENT = "assessment"  # Full assessment mode
    TRAINING = "training"  # Training mode with feedback
    FULL_SSB = "full_ssb"  # Complete SSB simulation


class InterviewStage(Enum):
    """Stages of SSB interview"""
    PERSONAL_INTERVIEW = "personal_interview"
    SRT = "srt"  # Situation Reaction Test
    WAT = "wat"  # Word Association Test
    GPE = "gpe"  # Group Planning Exercise
    TAT = "tat"  # Thematic Apperception Test
    SD = "sd"  # Self Description
    CONFERENCE = "conference"  # Final Conference


class SSBInterviewSimulator:
    """
    Complete SSB Interview Simulator with Brigadier-level AI assessment
    
    This simulator can conduct various stages of SSB interviews and provide
    expert-level evaluation and feedback.
    """
    
    def __init__(self, mode: InterviewMode = InterviewMode.ASSESSMENT, model=None):
        """
        Initialize the SSB Interview Simulator
        
        Args:
            mode: Interview mode (practice, assessment, training, full_ssb)
            model: Language model for advanced analysis (optional)
        """
        self.mode = mode
        self.assessor = get_brigadier_assessor(model)
        client = self.assessor.client if hasattr(self.assessor, 'client') else None
        self.psych_assessor = PsychologistAssessor(client)
        self.gto_assessor = GTOAssessor(client)
        self.conversation_history = []
        self.current_stage = None
        self.stage_responses = {}
        self.candidate_profile = {}
        
        # Load question banks
        self.question_banks = self._load_question_banks()
        
        # Interview configuration
        self.config = {
            InterviewMode.PRACTICE: {
                "provide_hints": True,
                "immediate_feedback": True,
                "stress_level": "low",
                "time_pressure": False
            },
            InterviewMode.ASSESSMENT: {
                "provide_hints": False,
                "immediate_feedback": False,
                "stress_level": "medium",
                "time_pressure": True
            },
            InterviewMode.TRAINING: {
                "provide_hints": True,
                "immediate_feedback": True,
                "stress_level": "low",
                "time_pressure": False
            },
            InterviewMode.FULL_SSB: {
                "provide_hints": False,
                "immediate_feedback": False,
                "stress_level": "high",
                "time_pressure": True
            }
        }
    
    def _load_question_banks(self) -> Dict[str, List[Dict]]:
        """Load comprehensive question banks for all SSB stages"""
        return {
            InterviewStage.PERSONAL_INTERVIEW: [
                {
                    "category": "personal_background",
                    "questions": [
                        "Tell me about yourself.",
                        "What are your strengths and weaknesses?",
                        "Why do you want to join the armed forces?",
                        "What makes you suitable for a career in defence?",
                        "Describe your family background.",
                        "How has your upbringing shaped your personality?"
                    ]
                },
                {
                    "category": "academic_career",
                    "questions": [
                        "Why did you choose your current field of study?",
                        "What are your academic achievements?",
                        "How do you plan to use your education in the armed forces?",
                        "Describe a challenging academic project you worked on.",
                        "What leadership roles have you held in your institution?"
                    ]
                },
                {
                    "category": "current_affairs",
                    "questions": [
                        "What are your views on the current geopolitical situation?",
                        "How do you see India's role in global security?",
                        "What are the major challenges facing our armed forces today?",
                        "How do you keep yourself updated with current affairs?",
                        "What is your opinion on the Agnipath scheme?"
                    ]
                },
                {
                    "category": "situational",
                    "questions": [
                        "What would you do if your troops disobey your orders?",
                        "How would you handle a situation where you have to choose between duty and family?",
                        "What would you do if you发现 a superior officer violating rules?",
                        "How would you motivate your troops before a difficult mission?",
                        "Describe how you would handle a conflict between two subordinates."
                    ]
                },
                {
                    "category": "stress_questions",
                    "questions": [
                        "You don't seem confident enough. Why should we select you?",
                        "Your academic record is not impressive. What makes you think you can handle officer training?",
                        "I don't see any leadership qualities in you. Convince me otherwise.",
                        "You seem nervous. How will you handle the pressure of command?",
                        "Many candidates are better qualified than you. What sets you apart?"
                    ]
                }
            ],
            InterviewStage.SRT: [
                "His team was losing the match and only 5 minutes were left. He",
                "You are an officer posted at the border and suddenly shelling happens from the other side. You",
                "He saw some students misbehaving with a girl in the bus. He",
                "In a discussion with your colleagues, you find yourself losing ground. You",
                "He was to appear for an exam and all of a sudden the curfew was imposed. He",
                "You are leading a patrol and suddenly come under enemy fire. You",
                "Your junior has made a serious mistake that could cost lives. You",
                "You find that your best friend in the unit is involved in wrongdoing. You",
                "There is a fire in the ammunition store. You",
                "Your vehicle breaks down in enemy territory. You"
            ],
            InterviewStage.WAT: [
                "Discipline", "Leadership", "Courage", "Responsibility", "Teamwork",
                "Determination", "Integrity", "Loyalty", "Sacrifice", "Duty",
                "Confidence", "Initiative", "Planning", "Strategy", "Victory",
                "Challenge", "Obstacle", "Success", "Failure", "Perseverance",
                "Honor", "Country", "Service", "Command", "Respect"
            ],
            InterviewStage.GPE: [
                {
                    "title": "College Festival Emergency",
                    "problems": [
                        "A medical emergency occurs during the event",
                        "Fire hazard in nearby building",
                        "VIP arrival security concerns",
                        "Power failure in main auditorium",
                        "Unexpected heavy rain affecting outdoor events",
                        "Transportation issues for guests"
                    ],
                    "resources": [
                        "20 volunteers",
                        "Basic first aid kit",
                        "Generator (limited capacity)",
                        "Emergency contact numbers",
                        "Local police support available"
                    ]
                },
                {
                    "title": "Flood Relief Operation",
                    "problems": [
                        "500 people stranded without food",
                        "Medical supplies running low",
                        "Communication networks down",
                        "Rescue boats insufficient",
                        "Helicopter support limited"
                    ],
                    "resources": [
                        "50 volunteers",
                        "3 rescue boats",
                        "Basic medical camp",
                        "Satellite phone",
                        "Local community support"
                    ]
                }
            ]
        }
    
    def start_interview(self, candidate_profile: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Start a new SSB interview session
        
        Args:
            candidate_profile: Basic information about the candidate
            
        Returns:
            Interview session details and first question
        """
        if candidate_profile:
            self.candidate_profile = candidate_profile
        
        self.conversation_history = []
        self.stage_responses = {}
        
        # Start with personal interview by default
        return self.start_stage(InterviewStage.PERSONAL_INTERVIEW)
    
    def start_stage(self, stage: InterviewStage) -> Dict[str, Any]:
        """
        Start a specific interview stage
        
        Args:
            stage: The interview stage to start
            
        Returns:
            Stage details and first question/task
        """
        self.current_stage = stage
        self.stage_responses[stage.value] = []
        
        if stage == InterviewStage.PERSONAL_INTERVIEW:
            return self._start_personal_interview()
        elif stage == InterviewStage.SRT:
            return self._start_srt()
        elif stage == InterviewStage.WAT:
            return self._start_wat()
        elif stage == InterviewStage.GPE:
            return self._start_gpe()
        else:
            return {"error": f"Stage {stage.value} not implemented"}
    
    def _start_personal_interview(self) -> Dict[str, Any]:
        """Start personal interview stage"""
        # Get first question from personal background category
        questions = self.question_banks[InterviewStage.PERSONAL_INTERVIEW]
        background_questions = [q for q in questions if q["category"] == "personal_background"][0]
        first_question = background_questions["questions"][0]
        
        return {
            "stage": InterviewStage.PERSONAL_INTERVIEW.value,
            "category": "personal_background",
            "question": first_question,
            "instructions": "Please answer the question clearly and confidently. The interviewer will ask follow-up questions based on your response.",
            "mode": self.mode.value
        }
    
    def _start_srt(self) -> Dict[str, Any]:
        """Start Situation Reaction Test"""
        scenarios = self.question_banks[InterviewStage.SRT]
        first_scenario = scenarios[0]
        
        return {
            "stage": InterviewStage.SRT.value,
            "scenario": first_scenario,
            "instructions": "Complete the situation in a way that shows your problem-solving ability and decision-making skills. Be practical and decisive.",
            "time_limit": "30 seconds per scenario",
            "total_scenarios": len(scenarios)
        }
    
    def _start_wat(self) -> Dict[str, Any]:
        """Start Word Association Test"""
        words = self.question_banks[InterviewStage.WAT]
        
        return {
            "stage": InterviewStage.WAT.value,
            "words": words[:10],  # First 10 words
            "instructions": "Write a meaningful sentence for each word. The sentence should reflect positive values and officer-like qualities.",
            "time_limit": "15 seconds per word",
            "total_words": len(words)
        }
    
    def _start_gpe(self) -> Dict[str, Any]:
        """Start Group Planning Exercise"""
        exercises = self.question_banks[InterviewStage.GPE]
        first_exercise = exercises[0]
        
        return {
            "stage": InterviewStage.GPE.value,
            "title": first_exercise["title"],
            "problems": first_exercise["problems"],
            "resources": first_exercise["resources"],
            "instructions": "Analyze the situation, prioritize the problems, and provide a systematic solution utilizing the available resources.",
            "time_limit": "10 minutes"
        }
    
    def process_response(self, response: str, stage: InterviewStage = None) -> Dict[str, Any]:
        """
        Process a candidate's response
        
        Args:
            response: The candidate's response text
            stage: Current interview stage (uses current_stage if not provided)
            
        Returns:
            Analysis, next question, and feedback (if applicable)
        """
        if stage is None:
            stage = self.current_stage
        
        # Store response
        self.stage_responses[stage.value].append(response)
        self.conversation_history.append({
            "stage": stage.value,
            "response": response,
            "timestamp": datetime.now().isoformat()
        })
        
        # ROUTE TO SPECIFIC OFFICER BASED ON STAGE
        if stage in [InterviewStage.SRT, InterviewStage.WAT, InterviewStage.TAT, InterviewStage.SD]:
            # Route to Psychologist
            # We reconstruct the stimulus loosely based on the previous question
            stimulus = self.conversation_history[-2]['response'] if len(self.conversation_history) > 1 else str(stage.value)
            analysis = self.psych_assessor.evaluate(stage.value, stimulus, response)
            # Normalize key for downstream compatibility
            analysis['overall_assessment'] = analysis.get('projection_analysis', '')
            
        elif stage == InterviewStage.GPE:
            # Route to GTO
            stimulus = self.conversation_history[-2]['response'] if len(self.conversation_history) > 1 else str(stage.value)
            analysis = self.gto_assessor.evaluate(stage.value, stimulus, response)
            analysis['overall_assessment'] = analysis.get('practical_intelligence', '')
            
        else:
            # Route to IO / Board President (Brigadier Assessor)
            analysis = self.assessor.analyze_response(response, {
                "stage": stage.value,
                "mode": self.mode.value,
                "candidate_profile": self.candidate_profile
            })
        
        # Generate next question or move to next stage
        next_action = self._determine_next_action(stage, analysis)
        
        # Prepare response package
        result = {
            "analysis": analysis,
            "next_action": next_action
        }
        
        # Add feedback if in practice or training mode
        if self.mode in [InterviewMode.PRACTICE, InterviewMode.TRAINING]:
            result["feedback"] = self._generate_feedback(analysis, stage)
            result["improvement_tips"] = self._generate_improvement_tips(analysis)
        
        return result
    
    def _determine_next_action(self, stage: InterviewStage, analysis: Dict) -> Dict[str, Any]:
        """Determine the next action based on current stage and analysis"""
        
        if stage == InterviewStage.PERSONAL_INTERVIEW:
            # Generate follow-up question
            question_type = self._select_question_type(analysis)
            next_question = self.assessor.generate_brigadier_question(analysis, question_type)
            
            return {
                "action": "continue_interview",
                "question": next_question,
                "question_type": question_type
            }
        
        elif stage == InterviewStage.SRT:
            # Check if more scenarios available
            current_count = len(self.stage_responses.get(stage.value, []))
            total_scenarios = len(self.question_banks[InterviewStage.SRT])
            
            if current_count < total_scenarios:
                next_scenario = self.question_banks[InterviewStage.SRT][current_count]
                return {
                    "action": "next_scenario",
                    "scenario": next_scenario,
                    "current": current_count + 1,
                    "total": total_scenarios
                }
            else:
                return {"action": "stage_complete", "next_stage": InterviewStage.WAT.value}
        
        elif stage == InterviewStage.WAT:
            current_count = len(self.stage_responses.get(stage.value, []))
            total_words = len(self.question_banks[InterviewStage.WAT])
            
            if current_count < total_words:
                next_word = self.question_banks[InterviewStage.WAT][current_count]
                return {
                    "action": "next_word",
                    "word": next_word,
                    "current": current_count + 1,
                    "total": total_words
                }
            else:
                return {"action": "stage_complete", "next_stage": InterviewStage.GPE.value}
        
        elif stage == InterviewStage.GPE:
            return {"action": "stage_complete", "next_stage": InterviewStage.CONFERENCE.value}
        
        return {"action": "interview_complete"}
    
    def _select_question_type(self, analysis: Dict) -> str:
        """Select appropriate question type based on analysis"""
        if analysis.get("red_flags_detected"):
            return "stress_test"
        
        # Rotate through different question types
        question_types = ["depth_probe", "ethical_dilemma", "leadership_test", "scenario_escalation"]
        return random.choice(question_types)
    
    def _generate_feedback(self, analysis: Dict, stage: InterviewStage) -> Dict[str, Any]:
        """Generate detailed feedback for the response"""
        feedback = {
            "overall_impression": analysis.get("overall_assessment", ""),
            "olq_analysis": {},
            "strengths": [],
            "areas_for_improvement": [],
            "red_flags": analysis.get("red_flags_detected", []),
            "green_flags": analysis.get("green_flags_detected", [])
        }
        
        # Extract OLQ-specific feedback
        for olq_name, olq_data in analysis.get("olq_analysis", {}).items():
            if olq_data.get("score", 3) >= 4:
                feedback["strengths"].append(f"Good demonstration of {olq_name}")
            elif olq_data.get("score", 3) < 3:
                feedback["areas_for_improvement"].append(
                    f"Need to work on {olq_name}: {olq_data.get('assessment', '')}"
                )
        
        return feedback
    
    def _generate_improvement_tips(self, analysis: Dict) -> List[str]:
        """Generate specific improvement tips"""
        tips = []
        
        # Based on OLQ scores
        for olq_name, olq_data in analysis.get("olq_analysis", {}).items():
            score = olq_data.get("score", 3)
            if score < 3:
                if olq_name == "Power of Expression":
                    tips.append("Practice speaking clearly and structuring your thoughts before speaking.")
                elif olq_name == "Self-Confidence":
                    tips.append("Work on building self-belief through preparation and positive self-talk.")
                elif olq_name == "Sense of Responsibility":
                    tips.append("Focus on taking ownership and showing accountability in your responses.")
                elif olq_name == "Courage":
                    tips.append("Demonstrate willingness to take calculated risks and stand up for what's right.")
                elif olq_name == "Determination":
                    tips.append("Show persistence and resilience in your problem-solving approach.")
        
        # Based on red flags
        if analysis.get("red_flags_detected"):
            tips.append("Avoid responses that show: blaming others, avoiding responsibility, or unethical suggestions.")
        
        return tips
    
    def generate_interview_report(self) -> Dict[str, Any]:
        """
        Generate comprehensive interview report
        
        Returns:
            Complete interview evaluation report
        """
        # Collect all responses for final evaluation
        all_analyses = []
        for stage, responses in self.stage_responses.items():
            for response in responses:
                analysis = self.assessor.analyze_response(response, {"stage": stage})
                all_analyses.append(analysis)
        
        # Generate final evaluation (THE BOARD CONFERENCE)
        # This is where the Brigadier synthesizes Psych, GTO, and IO reports.
        final_evaluation = self.assessor.evaluate_complete_interview(all_analyses)
        final_evaluation['conference_note'] = "The Board President has reviewed the independent evaluations from the Psychologist, GTO, and IO. The final decision is based on the consensus of all three dimensions."

        
        # Add stage-wise breakdown
        stage_summaries = {}
        for stage, responses in self.stage_responses.items():
            stage_analyses = [self.assessor.analyze_response(r, {"stage": stage}) for r in responses]
            stage_eval = self.assessor.evaluate_complete_interview(stage_analyses)
            stage_summaries[stage] = {
                "response_count": len(responses),
                "evaluation": stage_eval
            }
        
        return {
            "candidate_profile": self.candidate_profile,
            "interview_mode": self.mode.value,
            "interview_date": datetime.now().isoformat(),
            "final_evaluation": final_evaluation,
            "stage_summaries": stage_summaries,
            "conversation_history": self.conversation_history,
            "recommendations": self._generate_final_recommendations(final_evaluation)
        }
    
    def _generate_final_recommendations(self, evaluation: Dict) -> Dict[str, Any]:
        """Generate final recommendations based on evaluation"""
        recommendations = {
            "decision": evaluation.get("recommendation", "PENDING"),
            "confidence": evaluation.get("confidence", 0),
            "strengths": evaluation.get("strengths", []),
            "concerns": evaluation.get("concerns", []),
            "development_plan": []
        }
        
        # Generate development plan for concerns
        for concern in evaluation.get("concerns", []):
            if concern == "Sense of Responsibility":
                recommendations["development_plan"].append(
                    "Take on more leadership roles and responsibilities in daily life."
                )
            elif concern == "Courage":
                recommendations["development_plan"].append(
                    "Step out of comfort zone regularly and face challenging situations."
                )
            elif concern == "Determination":
                recommendations["development_plan"].append(
                    "Set long-term goals and work consistently towards them despite obstacles."
                )
            elif concern == "Effective Intelligence":
                recommendations["development_plan"].append(
                    "Practice practical problem-solving through case studies and real scenarios."
                )
        
        return recommendations
    
    def conduct_full_ssb_simulation(self, candidate_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Conduct a complete SSB simulation (all stages)
        
        Args:
            candidate_profile: Candidate information
            
        Returns:
            Complete simulation report
        """
        self.mode = InterviewMode.FULL_SSB
        self.start_interview(candidate_profile)
        
        # Simulate all stages
        stages = [
            InterviewStage.PERSONAL_INTERVIEW,
            InterviewStage.SRT,
            InterviewStage.WAT,
            InterviewStage.GPE
        ]
        
        for stage in stages:
            stage_data = self.start_stage(stage)
            
            # Get appropriate responses based on stage
            if stage == InterviewStage.PERSONAL_INTERVIEW:
                # Simulate interview with multiple exchanges
                for i in range(5):  # 5 questions
                    response = self._generate_simulated_response(stage, stage_data)
                    result = self.process_response(response, stage)
                    stage_data = result.get("next_action", {})
            
            elif stage == InterviewStage.SRT:
                # Process all SRT scenarios
                for i in range(10):
                    response = self._generate_simulated_response(stage, stage_data)
                    result = self.process_response(response, stage)
                    stage_data = result.get("next_action", {})
                    if stage_data.get("action") == "stage_complete":
                        break
            
            elif stage == InterviewStage.WAT:
                # Process all WAT words
                for word in stage_data.get("words", [])[:10]:
                    response = self._generate_simulated_response(stage, {"word": word})
                    result = self.process_response(response, stage)
                    stage_data = result.get("next_action", {})
            
            elif stage == InterviewStage.GPE:
                # Single comprehensive response
                response = self._generate_simulated_response(stage, stage_data)
                self.process_response(response, stage)
        
        # Generate final report
        return self.generate_interview_report()
    
    def _generate_simulated_response(self, stage: InterviewStage, context: Dict) -> str:
        """Generate a simulated candidate response using an LLM"""
        if not self.assessor or not self.assessor.client:
            # Fallback to hardcoded if no client available
            if stage == InterviewStage.PERSONAL_INTERVIEW:
                return "Sir, I believe in leading by example..."
            return "Sample response"
            
        prompt = f"""
        Act as a realistic candidate undergoing the intense Services Selection Board (SSB) interview.
        You are currently in the {stage.value} stage.
        Context/Question: {context}
        
        # INSTRUCTIONS
        - Respond naturally and authentically as a 20-something Indian candidate. Do not break character.
        - DO NOT be perfect. Sometimes give answers that are slightly flawed, defensive, nervous, or overly rehearsed. The goal of this simulation is to train the AI Interviewer, so you must provide realistic "meat" for the Interviewer to attack.
        - Occasionally contradict yourself or stumble under pressure, just like a real stressed candidate.
        - Do not use perfect vocabulary. Speak like an ordinary candidate under a high-stress military interview.
        - Output ONLY your spoken response.
        """
        
        try:
            response = self.assessor.client.models.generate_content(
                model='gemini-flash-latest',
                contents=prompt
            )
            return response.text
        except Exception as e:
            print(f"Simulation generation failed: {e}")
            return "Sir, I would assess the situation and act accordingly."


def create_ssb_simulator(mode: InterviewMode = InterviewMode.ASSESSMENT, model=None) -> SSBInterviewSimulator:
    """Create a new SSB Interview Simulator instance"""
    return SSBInterviewSimulator(mode, model)
