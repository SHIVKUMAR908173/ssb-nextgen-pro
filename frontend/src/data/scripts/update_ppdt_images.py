#!/usr/bin/env python3
"""Update PPDT stimuli with pollinations.ai image URLs"""

import json
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(script_dir, "..", "psych_scenario_bank.json")

with open(json_path, 'r') as f:
    data = json.load(f)

# Update PPDT stimuli with pollinations.ai URLs
count = 0
for ppdt in data.get('ppdt_stimuli', []):
    desc = ppdt.get('description', '')
    # Generate pollinations.ai URL with hazy black and white style
    prompt = f"{desc}. hazy black and white sketch style military psychology test picture"
    encoded_prompt = prompt.replace(' ', '%20')
    ppdt['image_url'] = f'https://image.pollinations.ai/prompt/{encoded_prompt}?width=800&height=600&nologo=true'
    count += 1

with open(json_path, 'w') as f:
    json.dump(data, f, indent=2)

print(f'Updated {count} PPDT stimuli with image URLs')
