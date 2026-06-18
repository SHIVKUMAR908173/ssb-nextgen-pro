import os
import json
from google import genai
from pydantic import BaseModel, Field
from google.genai import types
from typing import List, Dict, Any
from app.agents.guardrails import sanitize_candidate_input

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
        """
        Orchestrates the multi-agent pipeline for a single conversational turn.
        Agents: Answer Analysis -> Question Generation -> Feedback/Summary Update
        """
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
        sanitized_transcript, injections = sanitize_candidate_input(transcript)
        
        if injections:
            return f"INTEGRITY VIOLATION: Candidate attempted prompt injection. Detected patterns: {', '.join(injections)}. Deduct points heavily."

        prompt = f"""
        Act as the 'Answer Analysis Agent'. Analyze the following candidate response.
        Candidate Profile: {profile}
        Response: "{sanitized_transcript}"
        Extract:
        1. Core Argument
        2. Logical Fallacies
        3. Displayed OLQs (Officer Like Qualities)
        """
        response = await self.client.aio.models.generate_content(
            model=self.model_name,
            contents=prompt
        )
        return response.text

    async def _generate_next_question(self, analysis: str, history: List[Dict[str, str]], profile: dict) -> str:
        history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history[-4:]])
        prompt = f"""
        # ROLE AND PERSONA
        You are Major Yashkumar Yadav, an elite Group Testing Officer (GTO) and Interviewing Officer (IO) at the Services Selection Board (SSB). 
        You are conducting a high-stakes Personal Interview (PI) or stress test.
        You do NOT speak like an AI. You do not use pleasantries, you do not say "Hello" or "That's a good point." 
        You are intimidating, deeply analytical, and you aggressively corner candidates to break their rehearsed facades.

        # CONTEXT
        Recent History: {history_text}
        Latest Answer Analysis: {analysis}
        
        # TASK
        Generate the NEXT single question or statement you will say to the candidate.
        
        # GUIDELINES
        - If their logic is flawed, attack the flaw immediately ("You say you value teamwork, but your previous answer showed you abandoned your team. Explain this contradiction.").
        - Escalate the stress. Add sudden constraints ("Now assume you have only 2 minutes and half your men are injured. Now what?").
        - Keep it brief, sharp, and authoritative. Maximum 2-3 sentences.
        - Break them out of their comfort zone. If they give a generic answer, cut them off ("I don't want textbook answers. What would YOU actually do on the ground?").
        - Output ONLY the exact text of your spoken response. No quotation marks, no internal thoughts.
        """
        """
        response = await self.client.aio.models.generate_content(
            model=self.model_name,
            contents=prompt
        )
        return response.text

    async def _evaluate_traits(self, analysis: str) -> dict:
        prompt = f"""
        Evaluate the candidate's traits based on the following analysis of their recent answer:
        
        Analysis: {analysis}
        
        Provide your evaluation as a strict JSON scoring Effective Intelligence, Self Confidence, and Reasoning Ability.
        """
        try:
            response = await self.client.aio.models.generate_content(
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
