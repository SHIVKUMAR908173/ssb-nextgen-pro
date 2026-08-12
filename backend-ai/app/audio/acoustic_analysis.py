import io
import asyncio
import numpy as np
import librosa

MAX_AUDIO_BYTES = 5 * 1024 * 1024  # 5MB max

def _analyze_sync(audio_bytes: bytes) -> dict:
    """Synchronous analysis function"""

    try:
        y, sr = librosa.load(io.BytesIO(audio_bytes), sr=16000, duration=30.0)  # Cap at 30s
        
        f0, voiced_flag, voiced_probs = librosa.pyin(y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
        valid_f0 = f0[voiced_flag]
        
        if len(valid_f0) > 0:
            pitch_variance = float(np.var(valid_f0))
            pitch_stability = max(0.0, 1.0 - (pitch_variance / 5000.0))
        else:
            pitch_stability = 0.5
        
        rms = librosa.feature.rms(y=y)[0]
        silence_ratio = float(np.sum(rms < 0.01) / len(rms))
        
        confidence_score = (pitch_stability * 0.7) + ((1.0 - silence_ratio) * 0.3)

        return {
            "pitch_stability": min(1.0, pitch_stability),
            "silence_ratio": silence_ratio,
            "confidence_score": min(1.0, confidence_score),
            "micro_tremors_detected": False
        }
    except Exception as e:
        return {"error": str(e), "pitch_stability": 0.0, "confidence_score": 0.0}

class AcousticAnalyzer:
    def __init__(self):
        pass

    async def analyze_audio_chunk(self, audio_bytes: bytes) -> dict:
        """
        Analyzes a raw audio byte stream and extracts acoustic biomarkers asynchronously.
        """
        if len(audio_bytes) > MAX_AUDIO_BYTES:
            return {"error": f"Audio too large ({len(audio_bytes)} bytes). Max: {MAX_AUDIO_BYTES}"}
        if len(audio_bytes) < 100:
            return {"error": "Audio too small to analyze"}
            
        return await asyncio.to_thread(_analyze_sync, audio_bytes)
