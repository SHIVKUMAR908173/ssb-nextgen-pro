from fastapi import APIRouter, HTTPException, Body
import os
import google.generativeai as genai
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter()

# Configure Gemini AI for backend chatbot
_api_key = os.environ.get("GEMINI_API_KEY", "")
if _api_key:
    genai.configure(api_key=_api_key)

class ChatMessage(BaseModel):
    role: str # 'user' or 'model'
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

def get_brigadier_persona() -> str:
    return """
You are a highly decorated Brigadier in the Indian Armed Forces and the current President of the Services Selection Board (SSB). 
You have over 30 years of military experience and have assessed thousands of candidates.

YOUR PERSONA:
- You are strict, highly disciplined, yet deeply encouraging to genuine aspirants.
- You speak with absolute authority, clarity, and precision. You do not use fluff or excessive emojis.
- You refer to the user as "Cadet" or "Gentleman/Lady".
- Your goal is to guide cadets through the rigorous SSB process (OIR, PPDT, TAT, WAT, SRT, GTO tasks, and Personal Interview).
- If a cadet asks about a specific test (e.g., "How do I write a good TAT story?"), you provide highly tactical, actionable advice focusing on the 15 Officer Like Qualities (OLQs).
- You despise excuses, laziness, and "coached" or fake responses. You emphasize originality, raw truth, and practical leadership.
- If asked an irrelevant question (e.g., coding, movies, non-defense topics), strictly redirect them back to their mission of becoming an Armed Forces Officer.

Remember your rank and prestige. Deliver your guidance like a commanding officer mentoring a young cadet.
"""

@router.post("/ask", summary="Chat with the Brigadier (SSB President)")
async def chat_with_brigadier(request: ChatRequest):
    """
    Conversational endpoint where cadets can ask questions about the SSB process.
    The AI acts strictly as a Brigadier / SSB President.
    """
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Convert frontend messages to Gemini format
        formatted_history = []
        for msg in request.messages[:-1]: # Exclude the latest message for history
            formatted_history.append({
                "role": "user" if msg.role == "user" else "model",
                "parts": [msg.content]
            })
            
        latest_message = request.messages[-1].content

        # Start a chat session with the persona instruction
        chat = model.start_chat(
            history=formatted_history
        )
        
        # We inject the persona context silently by appending it to the user's actual prompt,
        # ensuring the model always stays in character without breaking the chat history flow.
        instruction_injection = f"[SYSTEM INSTRUCTION: {get_brigadier_persona()}]\n\nCadet asks: {latest_message}"

        response = chat.send_message(
            instruction_injection,
            generation_config=genai.GenerationConfig(
                temperature=0.4, # Slight temperature for conversational flow, but kept low for strictness
            )
        )
        
        return {"status": "success", "reply": response.text}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
