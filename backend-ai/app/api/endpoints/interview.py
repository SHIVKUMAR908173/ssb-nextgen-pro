from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.agents.interview_orchestrator import InterviewOrchestrator
from app.audio.acoustic_analysis import AcousticAnalyzer
import os
import json

router = APIRouter()

# Initialize Singletons
orchestrator = InterviewOrchestrator(api_key=os.getenv("GEMINI_API_KEY", ""))
acoustic_analyzer = AcousticAnalyzer()

@router.websocket("/ws/live")
async def live_interview_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    candidate_profile = {"name": "Candidate", "background": "Engineering", "weakness": "Public Speaking"}
    history = []
    
    try:
        # Initial greeting
        greeting = "Major Yashkumar Yadav reporting. I have your PIQ form right here. Are you ready?"
        await websocket.send_json({"type": "ai_response", "text": greeting})
        history.append({"role": "model", "content": greeting})

        while True:
            # Wait for message from client (can be JSON text or binary audio)
            message = await websocket.receive()
            
            candidate_transcript = ""
            
            if "bytes" in message:
                audio_data = message["bytes"]
                # 2. Process Audio if available
                if audio_data:
                    acoustic_metrics = await acoustic_analyzer.analyze_audio_chunk(audio_data)
                    await websocket.send_json({"type": "telemetry", "data": acoustic_metrics})
                
                # 2. In a real scenario, we'd send audio to Whisper API. 
                candidate_transcript = "[Audio processed...]"
                
            elif "text" in message:
                data = json.loads(message["text"])
                candidate_transcript = data.get("text", "")
                current_category = data.get("category", "general")
                candidate_profile["focus_area"] = current_category
            
            if not candidate_transcript:
                continue

            history.append({"role": "user", "content": candidate_transcript})
            
            # 3. Multi-Agent Orchestration
            orchestrator_result = await orchestrator.process_turn(
                candidate_transcript=candidate_transcript,
                history=history,
                candidate_profile=candidate_profile
            )
            
            ai_reply = orchestrator_result["reply"]
            history.append({"role": "model", "content": ai_reply})
            
            # 4. Relay AI response back
            await websocket.send_json({
                "type": "ai_response", 
                "text": ai_reply,
                "analysis": orchestrator_result["analysis"],
                "evaluation_delta": orchestrator_result["evaluation_delta"]
            })

    except WebSocketDisconnect:
        print("Candidate disconnected from interview session.")
