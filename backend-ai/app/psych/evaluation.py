import json

class PsychometricScoringEngine:
    """
    Engine to evaluate raw psychological test data (TAT, WAT, SRT)
    and map it to the 15 Officer-Like Qualities (OLQs).
    """
    
    OLQ_FACTORS = {
        "Factor I: Planning and Organising": ["Effective Intelligence", "Reasoning Ability", "Organising Ability", "Power of Expression"],
        "Factor II: Social Adjustment": ["Social Adaptability", "Cooperation", "Sense of Responsibility"],
        "Factor III: Social Effectiveness": ["Initiative", "Self-Confidence", "Speed of Decision", "Ability to Influence the Group"],
        "Factor IV: Dynamic (Action)": ["Liveliness", "Determination", "Courage", "Stamina"]
    }

    def evaluate_tat_story(self, story_text: str, time_taken_seconds: int) -> dict:
        """
        Evaluates a TAT story. In production, this uses an LLM.
        This represents the programmatic scoring matrix.
        """
        # Mock programmatic evaluation
        score_matrix = {
            "Effective Intelligence": 0.0,
            "Optimism": 0.0,
            "Sense of Responsibility": 0.0,
            "Courage": 0.0
        }
        
        lower_story = story_text.lower()
        
        # 1. Structural Check
        has_resolution = any(word in lower_story for word in ["finally", "resolved", "succeeded", "won", "completed"])
        if has_resolution:
            score_matrix["Optimism"] += 0.4
            
        # 2. Initiative Check
        has_initiative = any(word in lower_story for word in ["decided", "organized", "led", "jumped in"])
        if has_initiative:
            score_matrix["Sense of Responsibility"] += 0.5
            
        # 3. Time Penalty (Strict Temporal Boundaries)
        if time_taken_seconds > 240: # 4 minutes limit
            penalty = (time_taken_seconds - 240) * 0.01
            for k in score_matrix:
                score_matrix[k] = max(0.0, score_matrix[k] - penalty)
                
        return {
            "scores": score_matrix,
            "flags": ["time_limit_exceeded"] if time_taken_seconds > 240 else []
        }

    def evaluate_wat_response(self, stimulus_word: str, response: str, latency_ms: int) -> dict:
        """
        Evaluates a Word Association Test response.
        """
        score_matrix = {
            "Speed of Decision": 1.0 if latency_ms < 5000 else 0.5,
            "Self-Confidence": 0.0
        }
        
        if len(response.split()) > 2 and "not" not in response.lower():
            score_matrix["Self-Confidence"] = 0.8
            
        return {
            "scores": score_matrix,
            "latency_ms": latency_ms
        }
