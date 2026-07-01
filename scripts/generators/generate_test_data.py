import os
import json
import argparse
from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel, Field

# Load the backend-ai environment variables to get GEMINI_API_KEY
load_dotenv('../backend-ai/.env')

API_KEY = os.getenv('GEMINI_API_KEY')
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in ../backend-ai/.env")

client = genai.Client(api_key=API_KEY)

# Define Pydantic Models for Structured Output
class ExamQuestion(BaseModel):
    id: str = Field(description="Unique ID, e.g. NDA-M-101")
    topic: str = Field(description="Broad topic, e.g. Calculus")
    subtopic: str = Field(description="Subtopic, e.g. Definite Integrals")
    difficulty: str = Field(description="easy, medium, or hard")
    question_text: str = Field(description="The question text (can use LaTeX format)")
    options: dict[str, str] = Field(description="A dictionary mapping A, B, C, D to options")
    correct_option: str = Field(description="A, B, C, or D")
    explanation: str = Field(description="Detailed explanation of the solution")
    tags: list[str] = Field(description="List of relevant tags")

class QuestionBank(BaseModel):
    questions: list[ExamQuestion]

def generate_nda_math_questions(count: int = 10) -> list[dict]:
    print(f"Generating {count} NDA Math questions...")
    prompt = f"Generate {count} completely original, high-quality mathematics questions suitable for the UPSC NDA (National Defence Academy) entrance exam. Cover topics like Algebra, Calculus, Trigonometry, and Probability. Ensure the questions vary in difficulty. Provide detailed explanations."
    
    response = client.models.generate_content(
        model='gemini-flash-latest',
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_schema': QuestionBank,
            'temperature': 0.7
        }
    )
    
    data = json.loads(response.text)
    return data.get('questions', [])

def append_to_json_file(file_path: str, new_questions: list[dict]):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            bank = json.load(f)
    except FileNotFoundError:
        bank = {"metadata": {}, "questions": []}
        
    bank['questions'].extend(new_questions)
    
    # Update total_questions metadata if exists
    if 'metadata' in bank and 'total_questions' in bank['metadata']:
        bank['metadata']['total_questions'] = len(bank['questions'])
        
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(bank, f, indent=2, ensure_ascii=False)
    
    print(f"Successfully appended {len(new_questions)} questions to {file_path}. Total: {len(bank['questions'])}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate SSB test questions using Gemini AI")
    parser.add_argument("--type", type=str, choices=["nda-math", "cds-english", "afcat", "oir"], required=True)
    parser.add_argument("--count", type=int, default=5, help="Number of questions to generate")
    
    args = parser.parse_args()
    
    # Example: Generating NDA Math
    if args.type == "nda-math":
        questions = generate_nda_math_questions(args.count)
        target_file = '../frontend/src/data/nda_math_bank.json'
        append_to_json_file(target_file, questions)
    else:
        print(f"Generator for {args.type} is not yet fully implemented in this script template.")
