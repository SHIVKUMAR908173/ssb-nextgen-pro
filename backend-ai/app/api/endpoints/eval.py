from fastapi import APIRouter, HTTPException, Body
import os
import json
import google.generativeai as genai
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

# Configure Gemini AI for backend evaluation
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))

class OLQScore(BaseModel):
    olq: str
    score: int
    verdict: str

class SituationAnalysis(BaseModel):
    situation: str
    candidate_response: str
    initiative_level: str
    failure_analysis: str
    ideal_ssb_response: str
    board_score: int

class EvaluationResult(BaseModel):
    board_president_verdict: str
    leadership_pattern: str
    olq_scores: List[OLQScore]
    situation_deep_dive: List[SituationAnalysis]
    recurring_psychological_gaps: str
    training_prescription: str
    overall_srt_score: int

def get_brigadier_evaluator_persona() -> str:
    return """
You are a highly decorated Brigadier in the Indian Armed Forces and the current President of the Services Selection Board (SSB).
You have over 30 years of military experience and have assessed thousands of candidates. 
You are strict, highly disciplined, and brutally analytical. You do not tolerate 'coached' or fake responses.
You are evaluating this candidate to see if they possess the 15 Officer Like Qualities (OLQs).
"""

def get_srt_elite_prompt(responses: list) -> str:
    return f"""
{get_brigadier_evaluator_persona()}

You are conducting a Situation Reaction Test (SRT) evaluation. Do NOT hold back. 

### THE FEW-SHOT TRAINING SET (WHAT SUCCESS & FAILURE LOOKS LIKE)
Situation: "He saw a man drowning in a river while he was going for an urgent exam."
- POOR RESPONSE (Rating: 2/10): "He will jump in the river, save the man, and then go to the exam." (Analysis: Unrealistic timeline, ignores consequences of wet clothes/delay, solo-hero syndrome.)
- ELITE RESPONSE (Rating: 9/10): "Threw a nearby rope to the man, pulled him to the bank, handed him over to locals for first aid, and quickly resumed journey to reach the exam on time." (Analysis: Resourceful, practical, prioritizes life while still completing the mission).

### CANDIDATE'S SRT RESPONSES TO EVALUATE:
{json.dumps(responses, indent=2)}

### EVALUATION PROTOCOL:
1. PRACTICAL VIABILITY: Reject superhuman or philosophical answers. Officers solve problems with available resources.
2. INITIATIVE LADDER (A to D): 'A' is proactive resource-management. 'D' is avoidance.
3. OLQ MAPPING: Map responses to Courage, Initiative, Resourcefulness, and Sense of Responsibility.

You must output your evaluation strictly matching the JSON schema below.

OUTPUT SCHEMA (Must be valid JSON):
{{
  "board_president_verdict": "Authoritative judgment on their officer potential.",
  "leadership_pattern": "A|B|C|D — categorize their dominant reaction pattern with explanation.",
  "olq_scores": [
    {{ "olq": "Courage", "score": 8, "verdict": "Short specific observation." }}
  ],
  "situation_deep_dive": [
    {{
      "situation": "The exact situation text",
      "candidate_response": "What they wrote",
      "initiative_level": "A",
      "failure_analysis": "What OLQ is missing and WHY the response would concern the board.",
      "ideal_ssb_response": "The EXACT response an elite board-recommended officer would give.",
      "board_score": 8
    }}
  ],
  "recurring_psychological_gaps": "Dangerous psychological patterns observed.",
  "training_prescription": "5 specific, daily practice scenarios to rewire their brain.",
  "overall_srt_score": 85
}}
"""

@router.post("/srt", summary="Evaluate SRT responses using Elite-Trained Gemini AI")
async def evaluate_srt(responses: list = Body(..., embed=True)):
    """
    Highly trained AI endpoint that evaluates SRTs with few-shot prompting
    and enforces a strict JSON output structure using elite psychological frameworks.
    """
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        system_instruction = get_srt_elite_prompt(responses)
        
        response = model.generate_content(
            contents=[{"role": "user", "parts": [system_instruction]}],
            generation_config=genai.GenerationConfig(
                temperature=0.2, # Low temperature for highly clinical, analytical outputs
                response_mime_type="application/json"
            )
        )
        
        # In a full setup, we would validate via `EvaluationResult.parse_raw(response.text)`
        evaluation_result = json.loads(response.text)
        return {"status": "success", "evaluation": evaluation_result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/wat", summary="Evaluate WAT responses using Elite-Trained Gemini AI")
async def evaluate_wat(words: list = Body(..., embed=True)):
    """
    Word Association Test (WAT) Evaluator.
    """
    try:
        prompt = f"""
{get_brigadier_evaluator_persona()}

You are evaluating the following WAT (Word Association Test) responses.
Look for constructive imagination, positivity, and action-orientation.
Reject pre-conceived idioms, universal truths (e.g., 'Honesty is the best policy'), and negative projections.

Candidate's Words and Responses:
{json.dumps(words, indent=2)}

You must output your evaluation strictly matching the JSON schema below.
Return ONLY valid JSON, NO markdown.

OUTPUT SCHEMA:
{{
  "mindset_summary": "A deeply analytical paragraph revealing the candidate's dominant personality traits, subconscious mindset, and psychological fitness for command.",
  "strengths": ["Specific strength tied to exact WAT responses", "Another strength"],
  "weaknesses": ["Specific weakness or negative projection observed", "Another weakness"],
  "recommendations": "3-5 specific, actionable mental exercises and writing techniques the candidate MUST practice before their next board.",
  "score": 80
}}
"""
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(
            contents=[{"role": "user", "parts": [prompt]}],
            generation_config=genai.GenerationConfig(temperature=0.2, response_mime_type="application/json")
        )
        return {"status": "success", "evaluation": json.loads(response.text)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
