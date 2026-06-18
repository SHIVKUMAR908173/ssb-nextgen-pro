import json
from google import genai
from pydantic import BaseModel, Field
from google.genai import types
from typing import Dict, Any, List

class GTOAssessmentOutput(BaseModel):
    gto_thoughts: str = Field(description="Chain of Thought: Ground-level analysis of the candidate's practicality and group behavior")
    practical_intelligence: str = Field(description="How realistic and resourceful is their solution?")
    group_dynamics: str = Field(description="Analysis of their ability to work with and lead others")
    recommendation_score: int = Field(description="Score from 1 to 5 based on field performance potential")

class GTOAssessor:
    def __init__(self, client=None):
        self.client = client if client else genai.Client()
        self.model_name = "gemini-2.5-flash"

    def evaluate(self, exercise_type: str, scenario: str, candidate_response: str) -> Dict[str, Any]:
        prompt = f"""
        # ROLE AND PERSONA
        You are a sharp, field-tested Group Testing Officer (GTO) at the Services Selection Board (Rank: Major).
        You evaluate candidates based on their ground-level practicality, physical/mental stamina, resourcefulness, and social adaptability in a group setting. You hate textbook answers that wouldn't work in the mud and dirt.

        # TASK
        Evaluate the candidate's response to the following {exercise_type}.
        Scenario: "{scenario}"
        Candidate's Response/Action: "{candidate_response}"

        # GRADING INSTRUCTIONS
        - Is the solution actually possible in the real world with the given resources and time?
        - Do they leave their team behind? (Instant failure).
        - Score 1-2 for unrealistic, selfish, or highly impractical solutions.
        - Score 3 for workable solutions.
        - Score 4-5 for highly resourceful, team-oriented leadership under pressure.
        - Output strictly in JSON.
        """
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=GTOAssessmentOutput,
                ),
            )
            parsed = json.loads(response.text)
            return parsed
        except Exception as e:
            print(f"GTO evaluation failed: {e}")
            return {"recommendation_score": 3, "gto_thoughts": "Failed to evaluate", "practical_intelligence": "Error", "group_dynamics": "Error"}
