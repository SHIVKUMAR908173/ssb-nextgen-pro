import json
import os

dataset_dir = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets"
files = [f for f in os.listdir(dataset_dir) if "visual" in f and f.endswith(".json")]

issues = []

for filename in files:
    path = os.path.join(dataset_dir, filename)
    try:
        with open(path, 'r') as f:
            data = json.load(f)
            for i, q in enumerate(data):
                q_id = q.get('id', q.get('question_number', i+1))
                if 'correct_option' not in q or not q['correct_option']:
                    issues.append(f"{filename} - Q{q_id}: Missing correct_option")
                if 'explanation' not in q or not q['explanation']:
                    issues.append(f"{filename} - Q{q_id}: Missing explanation")
                if 'options' not in q or len(q['options']) == 0:
                    issues.append(f"{filename} - Q{q_id}: No options")
    except Exception as e:
        issues.append(f"{filename}: Error loading - {str(e)}")

if issues:
    print(f"Found {len(issues)} issues:")
    for issue in issues[:20]: # Show first 20
        print(issue)
else:
    print("No issues found in visual sets.")
