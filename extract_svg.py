import json
with open(r'C:\Users\Shivkumar\.gemini\antigravity\brain\4afddb1d-6e44-4059-8c85-06ace9db1406\.system_generated\logs\transcript.jsonl', encoding='utf-8') as f:
    for line in f:
        if '"type":"USER_INPUT"' in line and 'svg' in line.lower():
            print(json.loads(line)['content'])
