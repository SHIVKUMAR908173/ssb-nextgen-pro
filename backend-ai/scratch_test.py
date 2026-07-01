import os
from google import genai

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("No API key")
    exit(1)

client = genai.Client(api_key=api_key)
print("Client initialized")

try:
    response = client.models.generate_content(
        model='gemini-flash-latest',
        contents='Tell me a very short joke about testing.'
    )
    print("Response received:", response.text)
except Exception as e:
    print("Error:", str(e))
