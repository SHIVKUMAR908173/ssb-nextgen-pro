import re
from typing import Tuple, List

# Patterns that indicate prompt injection attempts
INJECTION_PATTERNS = [
    r"ignore\s+(all\s+)?previous\s+instructions",
    r"forget\s+(all\s+)?previous",
    r"you\s+are\s+now",
    r"new\s+instructions?:",
    r"system\s*prompt",
    r"override\s+instructions",
    r"act\s+as\s+(?!a\s+candidate)",  # "act as" except "act as a candidate"
    r"output\s+(?:the\s+following|this)\s+json",
    r"score.*?:\s*5",  # Attempting to dictate score
    r"strongly\s+recommend",
    r"\{.*?\"score\".*?:.*?\d.*?\}",  # JSON injection attempt
]

def sanitize_candidate_input(text: str) -> Tuple[str, List[str]]:
    """Sanitize candidate input and detect injection attempts.
    
    Returns:
        Tuple of (sanitized_text, list_of_detected_injections)
    """
    detected_injections = []
    sanitized = text
    
    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            detected_injections.append(pattern)
    
    # Strip potential JSON payloads
    sanitized = re.sub(r'\{[^}]*"score"[^}]*\}', '[REDACTED]', sanitized)
    
    # Truncate excessively long inputs (DoS protection)
    MAX_RESPONSE_LENGTH = 5000
    if len(sanitized) > MAX_RESPONSE_LENGTH:
        sanitized = sanitized[:MAX_RESPONSE_LENGTH] + "... [TRUNCATED]"
    
    return sanitized, detected_injections
