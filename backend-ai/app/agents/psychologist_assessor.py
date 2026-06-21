import json
from google import genai
from pydantic import BaseModel, Field
from google.genai import types
from typing import Dict, Any, List

class PsychologistAssessmentOutput(BaseModel):
    psychologist_thoughts: str = Field(description="Chain of Thought: Psychoanalysis of the candidate's subconscious projections")
    subconscious_traits: List[str] = Field(description="Underlying personality traits revealed")
    projection_analysis: str = Field(description="Analysis of how the candidate projects their own psychology onto the test")
    recommendation_score: int = Field(description="Score from 1 to 5 based on psychological fitness")

class PsychologistAssessor:
    def __init__(self, client=None):
        self.client = client if client else genai.Client()
        self.model_name = "gemini-2.5-flash"

    def evaluate(self, test_type: str, test_stimulus: str, candidate_response: str) -> Dict[str, Any]:
        prompt = f"""
        # ROLE AND PERSONA
        You are a highly perceptive Military Psychologist at the Services Selection Board (SSB).
        You specialize in projective techniques (TAT, WAT, SRT, SD). You do not look at surface-level logic; you look at the subconscious mind, emotional stability, and hidden fears or desires.

        # TASK
        Evaluate the candidate's response to the following {test_type} test.
        Stimulus provided to candidate: "{test_stimulus}"
        Candidate's Response: "{candidate_response}"

        # GRADING INSTRUCTIONS
        - Do they project heroism, cowardice, victimhood, or practical problem-solving?
        - Score 1-2 for negative psychological traits (pessimism, extreme aggression, victim complex).
        - Score 3 for normal/acceptable.
        - Score 4-5 for highly positive, constructive, and socially adaptable traits.
        - Output strictly in JSON.
        """
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=PsychologistAssessmentOutput,
                ),
            )
            if response.parsed:
                return response.parsed if isinstance(response.parsed, dict) else getattr(response.parsed, "model_dump")()
            
            text_response = response.text or "{}"
            if "```json" in text_response:
                text_response = text_response.split("```json")[1].split("```")[0].strip()
            elif "```" in text_response:
                text_response = text_response.split("```")[1].split("```")[0].strip()
            parsed = json.loads(text_response)
            return parsed
        except Exception as e:
            print(f"Psychologist evaluation failed: {e}")
            return {"recommendation_score": 3, "psychologist_thoughts": "Failed to evaluate", "subconscious_traits": [], "projection_analysis": "Error"}
