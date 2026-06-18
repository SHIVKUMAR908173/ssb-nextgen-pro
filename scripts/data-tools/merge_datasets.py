import json
import os
import re

dataset_dir = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets"
output_file = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\oir_master_bank.json"
frontend_output = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\frontend\src\data\oir_master_bank.json"

master_bank = {
    "verbal": {},
    "visual": {}
}

files = sorted(os.listdir(dataset_dir))

for filename in files:
    if not filename.endswith(".json") or "master" in filename:
        continue
    
    # Match oir_setX_type... or oir_premium_setX
    match = re.match(r"oir_(set\d+|premium_set\d+)_([a-z]+)", filename)
    if not match:
        continue
        
    set_id = match.group(1)
    type_key = match.group(2) # verbal or visual
    
    path = os.path.join(dataset_dir, filename)
    try:
        with open(path, 'r') as f:
            data = json.load(f)
            
            if set_id not in master_bank[type_key]:
                master_bank[type_key][set_id] = []
            
            # Append questions (extend list)
            if isinstance(data, list):
                master_bank[type_key][set_id].extend(data)
            else:
                master_bank[type_key][set_id].append(data)
                
    except Exception as e:
        print(f"Error processing {filename}: {e}")

# Deduplicate by ID just in case
for t in ["verbal", "visual"]:
    for sid in master_bank[t]:
        seen_ids = set()
        unique_qs = []
        for q in master_bank[t][sid]:
            qid = q.get('id')
            if qid not in seen_ids:
                unique_qs.append(q)
                seen_ids.add(qid)
        master_bank[t][sid] = sorted(unique_qs, key=lambda x: x.get('id', 0))

with open(output_file, 'w') as f:
    json.dump(master_bank, f, indent=2)

with open(frontend_output, 'w') as f:
    json.dump(master_bank, f, indent=2)

print(f"Master bank created with {len(master_bank['verbal'])} verbal and {len(master_bank['visual'])} visual sets.")
