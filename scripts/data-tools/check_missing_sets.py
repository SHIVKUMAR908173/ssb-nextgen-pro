import os
import re

dataset_dir = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets"
files = os.listdir(dataset_dir)

sets = set()
for f in files:
    match = re.search(r"set(\d+)", f)
    if match:
        sets.add(int(match.group(1)))

missing = []
for i in range(1, 97):
    if i not in sets:
        missing.append(i)

print(f"Total sets found: {len(sets)}")
print(f"Missing sets: {missing}")
