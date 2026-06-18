import json
import os

dataset_dir = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets"
frontend_dir = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\frontend\src\data"

def fix_file(path):
    with open(path, 'r') as f:
        data = json.load(f)
    
    modified = False
    for q in data:
        text = q.get('question_text', '').lower()
        # Fix 1: Cube questions (Alike/Same/Identical)
        if ("cube" in text or "alike" in text or "same" in text or "identical" in text) and not q.get('options'):
            # Only if it expects Yes/No
            if "yes" in text or "no" in text or "alike" in text or "same" in text:
                q['options'] = [
                    {"label": "Yes", "value": "Yes"},
                    {"label": "No", "value": "No"}
                ]
                modified = True
        
        # Fix 2: Class A vs Class B questions missing options
        if "class a" in text and not q.get('options'):
            q['options'] = [
                {"label": "1", "svg": "<!-- Option 1 Placeholder -->"},
                {"label": "2", "svg": "<!-- Option 2 Placeholder -->"},
                {"label": "3", "svg": "<!-- Option 3 Placeholder -->"}
            ]
            modified = True

    if modified:
        with open(path, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    return False

files = [f for f in os.listdir(dataset_dir) if "visual" in f and f.endswith(".json")]
for filename in files:
    if fix_file(os.path.join(dataset_dir, filename)):
        fix_file(os.path.join(frontend_dir, filename))

print("Repaired all visual sets.")
