import os
import re

def fix_trailing_commas(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            path = os.path.join(directory, filename)
            with open(path, 'r') as f:
                content = f.read()
            
            # Remove trailing commas before ] or }
            # Use regex to find commas followed by whitespace and closing bracket/brace
            fixed_content = re.sub(r',\s*([\]}])', r'\1', content)
            
            if fixed_content != content:
                with open(path, 'w') as f:
                    f.write(fixed_content)
                print(f"FIXED SYNTAX: {filename}")

dataset_dir = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets"
frontend_dir = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\frontend\src\data"

fix_trailing_commas(dataset_dir)
fix_trailing_commas(frontend_dir)
