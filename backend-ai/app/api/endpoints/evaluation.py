"""
Comprehensive AI Evaluation Endpoints for SSB Tests

This module provides evaluation endpoints for all SSB psychology tests:
- WAT (Word Association Test)
- TAT (Thematic Apperception Test)
- SRT (Situation Reaction Test)
- SD (Self Description)
- GPE (Group Planning Exercise)
- PPDT (Picture Perception and Description Test)

All evaluations use the Brigadier AI Assessor for OLQ-based analysis.
"""

from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from datetime import datetime
import json
import os

# Import the Brigadier Assessor
from app.agents.brigadier_assessor import get_brigadier_assessor, OLQ_FRAMEWORK

router = APIRouter()

# Get singleton instance of Brigadier Assessor
assessor = get_brigadier_assessor()


# ==================== Request/Response Models ====================

class WATRequest(BaseModel):
    word: str
    response: str
    time_taken: Optional[int] = None


class WATResponse(BaseModel):
    score: float
    olq_mapping: Dict[str, float]
    feedback: str
    suggestions: List[str]
    is_positive: bool


class TATRequest(BaseModel):
    image_id: str
    story: str
    time_taken: Optional[int] = None
    themes_identified: Optional[List[str]] = None


class TATResponse(BaseModel):
    overall_score: float
    olq_analysis: Dict[str, Dict[str, Any]]
    themes_analysis: Dict[str, float]
    feedback: str
    strengths: List[str]
    areas_for_improvement: List[str]
    story_structure_score: float


class SRTRequest(BaseModel):
    scenario_id: str
    scenario_text: str
    response: str
    time_taken: Optional[int] = None


class SRTResponse(BaseModel):
    score: float
    olq_analysis: Dict[str, float]
    feedback: str
    ideal_response_points: List[str]
    red_flags: List[str]
    green_flags: List[str]


class SDRequest(BaseModel):
    section: str
    description: str
    word_count: Optional[int] = None


class SDResponse(BaseModel):
    score: float
    olq_indicators: Dict[str, float]
    feedback: str
    authenticity_score: float
    suggestions: List[str]


class GPERequest(BaseModel):
    scenario_id: str
    plan: str
    priorities_identified: Optional[List[str]] = None
    resources_allocated: Optional[Dict[str, str]] = None
    time_allocation: Optional[str] = None


class GPEResponse(BaseModel):
    overall_score: float
    planning_score: float
    prioritization_score: float
    resource_allocation_score: float
    olq_analysis: Dict[str, float]
    feedback: str
    strengths: List[str]
    weaknesses: List[str]
    ideal_approach: str


class PPDTRequest(BaseModel):
    image_description: str
    story: str
    narration: Optional[str] = None
    oir_rating: Optional[int] = 1
    characters_identified: Optional[List[str]] = None
    themes_identified: Optional[List[str]] = None
    time_taken: Optional[int] = None


class PPDTResponse(BaseModel):
    overall_score: float
    perception_score: float
    story_score: float
    narration_score: float
    screening_probability: str
    olq_analysis: Dict[str, float]
    feedback: str
    character_analysis: Dict[str, str]
    theme_analysis: Dict[str, float]


# ==================== Helper Functions ====================


def evaluate_olq_response(response: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
    """Core function to evaluate any response using Brigadier AI"""
    if context is None:
        context = {}
    return assessor.analyze_response(response, context)


def extract_olq_scores(olq_analysis: Dict) -> Dict[str, float]:
    """Extract numerical scores from OLQ analysis"""
    scores = {}
    for olq_name, analysis in olq_analysis.items():
        scores[olq_name] = analysis.get("score", 3.0)
    return scores


# ==================== WAT Evaluation ====================

@router.post("/evaluate-wat", response_model=WATResponse)
async def evaluate_wat(request: WATRequest):
    """Evaluate Word Association Test response"""
    try:
        context = {"test_type": "WAT", "word": request.word, "time_taken": request.time_taken}
        analysis = evaluate_olq_response(request.response, context)
        olq_scores = extract_olq_scores(analysis.get("olq_analysis", {}))
        
        positive_indicators = len(analysis.get("green_flags_detected", []))
        negative_indicators = len(analysis.get("red_flags_detected", []))
        
        base_score = sum(olq_scores.values()) / len(olq_scores) if olq_scores else 3.0
        positivity_bonus = min(1.0, positive_indicators * 0.2)
        negativity_penalty = min(1.0, negative_indicators * 0.3)
        
        final_score = min(5.0, max(1.0, base_score + positivity_bonus - negativity_penalty))
        is_positive = final_score >= 3.0 and negative_indicators == 0
        
        feedback = (
            "Excellent response!" if final_score >= 4.5 else
            "Good response with clear OLQ indicators." if final_score >= 3.5 else
            "Average response. Focus on leadership and responsibility." if final_score >= 2.5 else
            "Response needs improvement. Avoid negative connotations."
        )
        
        suggestions = []
        if negative_indicators > 0:
            suggestions.append("Avoid negative or pessimistic language")
        if not any(v >= 4 for k, v in olq_scores.items() if k == "Sense of Responsibility"):
            suggestions.append("Incorporate sense of duty and accountability")
        if not any(v >= 4 for k, v in olq_scores.items() if k == "Initiative"):
            suggestions.append("Show proactive thinking and action")
        
        return WATResponse(
            score=round(final_score, 2),
            olq_mapping=olq_scores,
            feedback=feedback,
            suggestions=suggestions,
            is_positive=is_positive
        )
    except Exception as e:
        import logging
        logging.error(f"Internal Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# ==================== TAT Evaluation ====================

@router.post("/evaluate-tat", response_model=TATResponse)
async def evaluate_tat(request: TATRequest):
    """Evaluate Thematic Apperception Test story"""
    try:
        context = {
            "test_type": "TAT",
            "image_id": request.image_id,
            "time_taken": request.time_taken,
            "themes_identified": request.themes_identified
        }
        
        analysis = evaluate_olq_response(request.story, context)
        olq_analysis = analysis.get("olq_analysis", {})
        olq_scores = extract_olq_scores(olq_analysis)
        
        # Story structure analysis
        story_length = len(request.story.split())
        structure_score = min(5.0, max(1.0, 3.0 + (story_length - 100) / 50))
        
        # Theme analysis
        themes_analysis = {}
        if request.themes_identified:
            for theme in request.themes_identified:
                themes_analysis[theme] = 4.0 if theme.lower() in request.story.lower() else 2.0
        
        # Overall score
        base_score = sum(olq_scores.values()) / len(olq_scores) if olq_scores else 3.0
        final_score = (base_score * 0.7) + (structure_score * 0.3)
        
        # Extract strengths and weaknesses
        strengths = [k for k, v in olq_scores.items() if v >= 4.0]
        areas_for_improvement = [k for k, v in olq_scores.items() if v < 3.0]
        
        feedback = (
            "Outstanding story with strong OLQ demonstration." if final_score >= 4.5 else
            "Good story structure with clear themes." if final_score >= 3.5 else
            "Story needs better development of themes and characters." if final_score >= 2.5 else
            "Story lacks direction and OLQ indicators."
        )
        
        return TATResponse(
            overall_score=round(final_score, 2),
            olq_analysis={k: {"score": v, "assessment": olq_analysis[k].get("assessment", "")} 
                         for k, v in olq_scores.items()},
            themes_analysis=themes_analysis,
            feedback=feedback,
            strengths=strengths,
            areas_for_improvement=areas_for_improvement,
            story_structure_score=round(structure_score, 2)
        )
    except Exception as e:
        import logging
        logging.error(f"Internal Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# ==================== SRT Evaluation ====================

@router.post("/evaluate-srt", response_model=SRTResponse)
async def evaluate_srt(request: SRTRequest):
    """Evaluate Situation Reaction Test response"""
    try:
        context = {
            "test_type": "SRT",
            "scenario_id": request.scenario_id,
            "scenario_text": request.scenario_text,
            "time_taken": request.time_taken
        }
        
        analysis = evaluate_olq_response(request.response, context)
        olq_scores = extract_olq_scores(analysis.get("olq_analysis", {}))
        
        red_flags = analysis.get("red_flags_detected", [])
        green_flags = analysis.get("green_flags_detected", [])
        
        # Calculate score
        base_score = sum(olq_scores.values()) / len(olq_scores) if olq_scores else 3.0
        green_bonus = min(1.0, len(green_flags) * 0.2)
        red_penalty = min(1.5, len(red_flags) * 0.4)
        
        final_score = min(5.0, max(1.0, base_score + green_bonus - red_penalty))
        
        # Ideal response points based on scenario
        ideal_points = [
            "Take immediate action to address the situation",
            "Consider safety and well-being of all involved",
            "Seek help from authorities when needed",
            "Demonstrate leadership and responsibility",
            "Show practical and realistic approach"
        ]
        
        feedback = (
            "Excellent response showing strong leadership and practical thinking." if final_score >= 4.5 else
            "Good response with appropriate action orientation." if final_score >= 3.5 else
            "Response is adequate but could show more initiative." if final_score >= 2.5 else
            "Response needs significant improvement in showing leadership."
        )
        
        return SRTResponse(
            score=round(final_score, 2),
            olq_analysis=olq_scores,
            feedback=feedback,
            ideal_response_points=ideal_points,
            red_flags=red_flags,
            green_flags=green_flags
        )
    except Exception as e:
        import logging
        logging.error(f"Internal Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# ==================== SD Evaluation ====================

@router.post("/evaluate-sd", response_model=SDResponse)
async def evaluate_sd(request: SDRequest):
    """Evaluate Self Description response"""
    try:
        context = {
            "test_type": "SD",
            "section": request.section,
            "word_count": request.word_count
        }
        
        analysis = evaluate_olq_response(request.description, context)
        olq_scores = extract_olq_scores(analysis.get("olq_analysis", {}))
        
        # Authenticity score based on specificity and consistency
        word_count = len(request.description.split())
        authenticity_score = min(5.0, max(1.0, 3.0 + (word_count - 50) / 30))
        
        # Adjust for section-specific expectations
        section_olq_focus = {
            "self": ["Self-Confidence", "Determination", "Initiative"],
            "parents": ["Sense of Responsibility", "Cooperation", "Social Adaptability"],
            "friends": ["Social Adaptability", "Cooperation", "Liveliness"],
            "teachers": ["Sense of Responsibility", "Effective Intelligence", "Power of Expression"]
        }
        
        focused_olqs = section_olq_focus.get(request.section, [])
        if focused_olqs:
            focused_score = sum(olq_scores.get(olq, 3.0) for olq in focused_olqs) / len(focused_olqs)
        else:
            focused_score = 3.0
        
        olq_average = (sum(olq_scores.values()) / len(olq_scores)) if olq_scores else 3.0
        final_score = (olq_average * 0.6) + (focused_score * 0.4)
        
        # Generate suggestions
        suggestions = []
        if word_count < 80:
            suggestions.append("Provide more detailed and specific examples")
        if request.section == "self" and olq_scores.get("Self-Confidence", 3.0) < 3.5:
            suggestions.append("Express more confidence in your abilities")
        if request.section == "parents" and olq_scores.get("Sense of Responsibility", 3.0) < 3.5:
            suggestions.append("Highlight your sense of duty towards family")
        
        feedback = (
            "Excellent self-awareness and authentic expression." if final_score >= 4.5 else
            "Good self-description with clear insights." if final_score >= 3.5 else
            "Description is adequate but could be more specific." if final_score >= 2.5 else
            "Description lacks depth and self-awareness."
        )
        
        return SDResponse(
            score=round(final_score, 2),
            olq_indicators=olq_scores,
            feedback=feedback,
            authenticity_score=round(authenticity_score, 2),
            suggestions=suggestions
        )
    except Exception as e:
        import logging
        logging.error(f"Internal Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# ==================== GPE Evaluation ====================

@router.post("/evaluate-gpe", response_model=GPEResponse)
async def evaluate_gpe(request: GPERequest):
    """Evaluate Group Planning Exercise response"""
    try:
        context = {
            "test_type": "GPE",
            "scenario_id": request.scenario_id,
            "priorities_identified": request.priorities_identified,
            "resources_allocated": request.resources_allocated
        }
        
        analysis = evaluate_olq_response(request.plan, context)
        olq_scores = extract_olq_scores(analysis.get("olq_analysis", {}))
        
        # Planning score based on structure and completeness
        planning_elements = 0
        if request.priorities_identified:
            planning_elements += len(request.priorities_identified)
        if request.resources_allocated:
            planning_elements += len(request.resources_allocated)
        if request.time_allocation:
            planning_elements += 1
        
        planning_score = min(5.0, max(1.0, 2.0 + planning_elements * 0.5))
        
        # Prioritization score
        prioritization_score = 3.0
        if request.priorities_identified:
            # Check if life-related priorities are first
            life_priorities = ["life", "safety", "medical", "rescue", "emergency"]
            if request.priorities_identified and any(
                p.lower() in ' '.join(request.priorities_identified[:2]).lower() 
                for p in life_priorities
            ):
                prioritization_score = 4.5
        
        # Resource allocation score
        resource_allocation_score = 3.0
        if request.resources_allocated and len(request.resources_allocated) >= 3:
            resource_allocation_score = 4.0
        
        # Overall score
        olq_average = (sum(olq_scores.values()) / len(olq_scores)) if olq_scores else 3.0
        final_score = (
            olq_average * 0.4 +
            planning_score * 0.25 +
            prioritization_score * 0.2 +
            resource_allocation_score * 0.15
        )
        
        strengths = [k for k, v in olq_scores.items() if v >= 4.0]
        weaknesses = [k for k, v in olq_scores.items() if v < 3.0]
        
        feedback = (
            "Excellent planning with strong leadership and organization." if final_score >= 4.5 else
            "Good plan with clear prioritization and resource allocation." if final_score >= 3.5 else
            "Plan is adequate but needs better prioritization." if final_score >= 2.5 else
            "Plan lacks structure and practical approach."
        )
        
        ideal_approach = """
        1. Identify all problems and prioritize based on urgency and importance
        2. Human life and safety are always the top priority
        3. Allocate resources efficiently considering time constraints
        4. Ensure all group members have clear roles and responsibilities
        5. Have contingency plans for unexpected situations
        6. Coordinate with local authorities when needed
        """
        
        return GPEResponse(
            overall_score=round(final_score, 2),
            planning_score=round(planning_score, 2),
            prioritization_score=round(prioritization_score, 2),
            resource_allocation_score=round(resource_allocation_score, 2),
            olq_analysis=olq_scores,
            feedback=feedback,
            strengths=strengths,
            weaknesses=weaknesses,
            ideal_approach=ideal_approach
        )
    except Exception as e:
        import logging
        logging.error(f"Internal Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# ==================== PPDT Evaluation ====================

@router.post("/evaluate-ppdt", response_model=PPDTResponse)
async def evaluate_ppdt(request: PPDTRequest):
    """Evaluate Picture Perception and Description Test response"""
    try:
        context = {
            "test_type": "PPDT",
            "characters_identified": request.characters_identified,
            "themes_identified": request.themes_identified,
            "time_taken": request.time_taken
        }
        
        # Evaluate image description (perception)
        perception_context = {**context, "evaluation_focus": "perception"}
        perception_analysis = evaluate_olq_response(request.image_description, perception_context)
        
        # Evaluate story
        story_context = {**context, "evaluation_focus": "story"}
        story_analysis = evaluate_olq_response(request.story, story_context)

        # Evaluate narration if provided
        narration_score = 3.0
        narration_olq = {}
        if request.narration:
            narration_context = {**context, "evaluation_focus": "group discussion narration"}
            narration_analysis = evaluate_olq_response(request.narration, narration_context)
            narration_olq = extract_olq_scores(narration_analysis.get("olq_analysis", {}))
            narration_score = sum(narration_olq.values()) / len(narration_olq) if narration_olq else 3.0
        
        # Combine OLQ scores
        perception_olq = extract_olq_scores(perception_analysis.get("olq_analysis", {}))
        story_olq = extract_olq_scores(story_analysis.get("olq_analysis", {}))
        
        # Combined OLQ scores (weighted towards story and narration)
        combined_olq = {}
        all_olqs = set(list(perception_olq.keys()) + list(story_olq.keys()) + list(narration_olq.keys()))
        for olq in all_olqs:
            p_score = perception_olq.get(olq, 3.0)
            s_score = story_olq.get(olq, 3.0)
            n_score = narration_olq.get(olq, s_score) # fallback to story score if no narration
            combined_olq[olq] = round(p_score * 0.2 + s_score * 0.5 + n_score * 0.3, 2)
        
        # Perception score
        perception_score = sum(perception_olq.values()) / len(perception_olq) if perception_olq else 3.0
        
        # Story score
        story_length = len(request.story.split())
        story_score = min(5.0, max(1.0, 2.0 + (story_length - 50) / 40))
        
        # Theme analysis
        theme_analysis = {}
        if request.themes_identified:
            for theme in request.themes_identified:
                theme_analysis[theme] = 4.0 if theme.lower() in request.story.lower() else 2.0
        
        # Character analysis
        character_analysis = {}
        if request.characters_identified:
            for char in request.characters_identified:
                character_analysis[char] = "Well developed" if char.lower() in request.story.lower() else "Needs development"
        
        # Overall score including OIR Rating
        # OIR 1 = 5.0, OIR 2 = 4.0, OIR 3 = 3.0, OIR 4 = 2.0, OIR 5 = 1.0
        oir_score = 6.0 - float(request.oir_rating) if request.oir_rating else 5.0
        
        # In real SSB, OIR is the baseline, Story & Narration are critical qualifiers
        final_score = (oir_score * 0.35) + (perception_score * 0.15) + (story_score * 0.25) + (narration_score * 0.25)
        
        if final_score >= 4.0:
            screening_prob = "High Chances of Screening In (Excellent OIR & Narrative)"
        elif final_score >= 3.0:
            screening_prob = "Borderline (Heavily dependent on GD performance)"
        else:
            screening_prob = "Low Chances (OIR/Story/Narration needs significant improvement)"

        feedback = (
            "Outstanding performance across OIR, Perception, Story, and Narration." if final_score >= 4.5 else
            "Good overall screening profile with solid storytelling." if final_score >= 3.5 else
            "Screening profile is borderline. Needs better fluency and story structure." if final_score >= 2.5 else
            "Low screening probability. Focus on improving OIR speed, story quality, and narration confidence."
        )
        
        return PPDTResponse(
            overall_score=round(final_score, 2),
            perception_score=round(perception_score, 2),
            story_score=round(story_score, 2),
            narration_score=round(narration_score, 2),
            screening_probability=screening_prob,
            olq_analysis=combined_olq,
            feedback=feedback,
            character_analysis=character_analysis,
            theme_analysis=theme_analysis
        )
    except Exception as e:
        import logging
        logging.error(f"Internal Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# ==================== Comprehensive Assessment ====================

@router.post("/comprehensive-assessment")
async def comprehensive_assessment(
    wat_responses: Optional[List[Dict]] = None,
    tat_stories: Optional[List[Dict]] = None,
    srt_responses: Optional[List[Dict]] = None,
    sd_responses: Optional[List[Dict]] = None
):
    """
    Provide comprehensive OLQ assessment based on multiple test responses
    """
    try:
        all_olq_scores = {}
        total_responses = 0
        
        # Aggregate scores from all tests
        if wat_responses:
            for resp in wat_responses:
                analysis = evaluate_olq_response(resp.get("response", ""), {"test_type": "WAT"})
                scores = extract_olq_scores(analysis.get("olq_analysis", {}))
                for olq, score in scores.items():
                    if olq not in all_olq_scores:
                        all_olq_scores[olq] = []
                    all_olq_scores[olq].append(score)
                total_responses += 1
        
        if tat_stories:
            for resp in tat_stories:
                analysis = evaluate_olq_response(resp.get("story", ""), {"test_type": "TAT"})
                scores = extract_olq_scores(analysis.get("olq_analysis", {}))
                for olq, score in scores.items():
                    if olq not in all_olq_scores:
                        all_olq_scores[olq] = []
                    all_olq_scores[olq].append(score)
                total_responses += 1
        
        if srt_responses:
            for resp in srt_responses:
                analysis = evaluate_olq_response(resp.get("response", ""), {"test_type": "SRT"})
                scores = extract_olq_scores(analysis.get("olq_analysis", {}))
                for olq, score in scores.items():
                    if olq not in all_olq_scores:
                        all_olq_scores[olq] = []
                    all_olq_scores[olq].append(score)
                total_responses += 1
        
        # Calculate average scores
        final_olq_scores = {}
        for olq, scores in all_olq_scores.items():
            final_olq_scores[olq] = round(sum(scores) / len(scores), 2)
        
        # Identify strengths and weaknesses
        strengths = [olq for olq, score in final_olq_scores.items() if score >= 4.0]
        weaknesses = [olq for olq, score in final_olq_scores.items() if score < 3.0]
        
        # Overall recommendation
        avg_score = sum(final_olq_scores.values()) / len(final_olq_scores) if final_olq_scores else 3.0
        
        if avg_score >= 4.0:
            recommendation = "STRONGLY RECOMMENDED"
        elif avg_score >= 3.5:
            recommendation = "RECOMMENDED"
        elif avg_score >= 3.0:
            recommendation = "BORDERLINE"
        else:
            recommendation = "NEEDS IMPROVEMENT"
        
        return {
            "olq_scores": final_olq_scores,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "average_score": round(avg_score, 2),
            "recommendation": recommendation,
            "total_responses_analyzed": total_responses,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        import logging
        logging.error(f"Internal Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# ==================== Analytics Endpoint ====================

@router.get("/analytics/olq-summary")
async def get_olq_summary():
    """Get OLQ framework summary for frontend reference"""
    return {
        "olq_framework": {
            olq_name: {
                "description": olq_info["description"],
                "category": olq_info["category"].value,
                "weight": olq_info["weight"],
                "critical": olq_info["critical"]
            }
            for olq_name, olq_info in OLQ_FRAMEWORK.items()
        },
        "categories": list(set(olq_info["category"].value for olq_info in OLQ_FRAMEWORK.values()))
    }
# ==================== Comprehensive Psych Battery Evaluation ====================

class ComprehensivePsychRequest(BaseModel):
    tat_responses: List[Dict[str, Any]]
    wat_responses: List[Dict[str, Any]]
    srt_responses: List[Dict[str, Any]]
    sdt_responses: Dict[str, Any]

@router.post("/evaluate-comprehensive-psych")
async def evaluate_comprehensive_psych(request: ComprehensivePsychRequest):
    """
    Evaluates the full 2-hour psych battery (TAT, WAT, SRT, SDT).
    The AI acts as the Chief Psychologist synthesizing data across all 4 tests
    to generate a final Board Verdict.
    """
    try:
        # We will use the Brigadier Assessor to synthesize all responses
        # Formatting the payload to send to the LLM
        prompt = f"""
        Act as the Chief Psychologist of the Services Selection Board (SSB).
        You are evaluating a candidate who has just completed the full 2-hour Psychological Assessment Battery.
        
        You have their responses for:
        1. TAT (Thematic Apperception Test): {len(request.tat_responses)} stories
        2. WAT (Word Association Test): {len(request.wat_responses)} words
        3. SRT (Situation Reaction Test): {len(request.srt_responses)} situations
        4. SDT (Self Description Test): {json.dumps(request.sdt_responses)}
        
        Analyze cross-test consistency. Does their TAT hero match their SDT self-assessment? 
        Are their WAT subconscious reactions aligned with their conscious SRT decisions?
        
        Generate a JSON report with the following structure:
        {{
            "status": "success",
            "evaluation": {{
                "verdict": "A 2-3 sentence final board verdict (e.g. Recommended, Borderline, Not Recommended).",
                "overall_score": <int 1-100>,
                "strengths": ["list 3-5 core strengths demonstrated across tests"],
                "weaknesses": ["list 2-4 fatal red flags or areas of concern"],
                "consistency_analysis": "A paragraph analyzing if they were authentic or faking it across tests."
            }}
        }}
        
        Return ONLY valid JSON.
        """
        
        response = await assessor.generate_text(
            prompt=prompt,
            system_instruction="You are the Chief Psychologist of the Indian Armed Forces SSB. Be extremely strict, perceptive, and analytical. Look for Officer Like Qualities (OLQs)."
        )
        
        # Clean response (remove markdown code blocks if any)
        cleaned_response = response.replace('```json', '').replace('```', '').strip()
        parsed_data = json.loads(cleaned_response)
        
        return parsed_data
        
    except Exception as e:
        print(f"Error in comprehensive psych evaluation: {str(e)}")
        import logging
        logging.error(f"Internal Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
