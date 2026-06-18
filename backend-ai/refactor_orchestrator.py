import json

filepath = r'c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\backend-ai\app\agents\interview_orchestrator.py'

content = """import os
from google import genai
from pydantic import BaseModel, Field
from google.genai import types
from typing import List, Dict, Any

class EvaluatedTraits(BaseModel):
    effective_intelligence: float = Field(description="Score between 0.0 and 1.0")
    self_confidence: float = Field(description="Score between 0.0 and 1.0")
    reasoning_ability: float = Field(description="Score between 0.0 and 1.0")

# Multi-Agent Orchestrator for the SSB Virtual Interview

class InterviewOrchestrator:
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)
        self.model_name = "gemini-2.5-flash"
    
    async def process_turn(self, candidate_transcript: str, history: List[Dict[str, str]], candidate_profile: dict) -> dict:
        \"\"\"
        Orchestrates the multi-agent pipeline for a single conversational turn.
        Agents: Answer Analysis -> Question Generation -> Feedback/Summary Update
        \"\"\"
        # 1. Answer Analysis Agent
        analysis = await self._analyze_answer(candidate_transcript, candidate_profile)
        
        # 2. Question Generation Agent
        next_question = await self._generate_next_question(analysis, history, candidate_profile)
        
        # 3. Dynamic Evaluation Update (Logging traits like Confidence, Logic)
        evaluation_delta = await self._evaluate_traits(analysis)
        
        return {
            "reply": next_question,
            "analysis": analysis,
            "evaluation_delta": evaluation_delta
        }

    async def _analyze_answer(self, transcript: str, profile: dict) -> str:
        prompt = f\"\"\"
        Act as the 'Answer Analysis Agent'. Analyze the following candidate response.
        Candidate Profile: {profile}
        Response: "{transcript}"
        Extract:
        1. Core Argument
        2. Logical Fallacies
        3. Displayed OLQs (Officer Like Qualities)
        \"\"\"
        # Note: In a production async environment, we'd use client.aio.models.generate_content
        # but for simplicity we assume client.models.generate_content (blocking) is okay 
        # or we could use the standard async client.
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt
        )
        return response.text

    async def _generate_next_question(self, analysis: str, history: List[Dict[str, str]], profile: dict) -> str:
        history_text = "\\n".join([f"{msg['role']}: {msg['content']}" for msg in history[-4:]])
        prompt = f\"\"\"
        Act as the 'Question Agent' (Major Yashkumar Yadav).
        Recent History: {history_text}
        Latest Answer Analysis: {analysis}
        
        Task: Generate a highly targeted, slightly stressful follow-up question that challenges the candidate's logic or forces them to apply their principles to a real-world scenario. Keep it brief and authoritative.
        \"\"\"
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt
        )
        return response.text

    async def _evaluate_traits(self, analysis: str) -> dict:
        prompt = f\"\"\"
        Evaluate the candidate's traits based on the following analysis of their recent answer:
        
        Analysis: {analysis}
        
        Provide your evaluation as a strict JSON scoring Effective Intelligence, Self Confidence, and Reasoning Ability.
        \"\"\"
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=EvaluatedTraits,
                ),
            )
            parsed = json.loads(response.text)
            return {
                "Effective Intelligence": parsed.get("effective_intelligence", 0.5),
                "Self Confidence": parsed.get("self_confidence", 0.5),
                "Reasoning Ability": parsed.get("reasoning_ability", 0.5)
            }
        except Exception as e:
            print(f"Trait evaluation failed: {e}")
            return {
                "Effective Intelligence": 0.5,
                "Self Confidence": 0.5,
                "Reasoning Ability": 0.5
            }
"""

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated orchestrator")
