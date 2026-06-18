#!/usr/bin/env python3
import json

with open('../practice_questions/oir_practice_bank.json') as f:
    data = json.load(f)

print(f"Total sets: {len(data['sets'])}")
print(f"Verbal sets: {sum(1 for s in data['sets'] if s['type'] == 'verbal')}")
print(f"Non-verbal sets: {sum(1 for s in data['sets'] if s['type'] == 'non_verbal')}")
print(f"Set 1 type: {data['sets'][0]['type']}")
print(f"Set 49 type: {data['sets'][48]['type']}")
print(f"Questions per set: {len(data['sets'][0]['questions'])}")
print(f"Total questions: {len(data['sets']) * len(data['sets'][0]['questions'])}")