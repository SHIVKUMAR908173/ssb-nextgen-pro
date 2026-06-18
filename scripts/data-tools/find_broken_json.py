import json
import os

dataset_dir = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets"
files = [f for f in os.listdir(dataset_dir) if f.endswith(".json")]

for filename in files:
    path = os.path.join(dataset_dir, filename)
    try:
        with open(path, 'r') as f:
            json.load(f)
    except json.JSONDecodeError as e:
        print(f"BROKEN FILE: {filename} - {str(e)}")
