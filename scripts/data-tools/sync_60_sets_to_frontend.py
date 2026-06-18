import json
import os

SOURCE_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\60_sets"
FRONTEND_DATA_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\frontend\src\data"

# 1. Sync WAT Word Bank
wat_source_path = os.path.join(SOURCE_DIR, "wat_60_sets.json")
wat_target_path = os.path.join(FRONTEND_DATA_DIR, "wat_word_bank.json")

if os.path.exists(wat_source_path):
    with open(wat_source_path, 'r', encoding='utf-8') as f:
        wat_data = json.load(f)
    
    frontend_wat = {
        "metadata": {
            "total_words": len(wat_data) * 60,
            "sets": len(wat_data),
            "words_per_set": 60,
            "time_per_word_seconds": 15,
            "source": "SSB Standard WAT Bank — Curated 60 Sets"
        },
        "sets": []
    }
    
    for item in wat_data:
        set_id = int(item["set_id"].split("_")[1])
        words = [q["word"] for q in item["questions"]]
        frontend_wat["sets"].append({
            "set_id": set_id,
            "name": f"Set {set_id:02d} — Curated WAT",
            "words": words
        })
        
    with open(wat_target_path, 'w', encoding='utf-8') as f:
        json.dump(frontend_wat, f, indent=2)
    print(f"Synced {len(wat_data)} WAT sets to {wat_target_path}")
else:
    print(f"Warning: {wat_source_path} does not exist.")

# 2. Sync SRT Situation Bank
srt_source_path = os.path.join(SOURCE_DIR, "srt_60_sets.json")
srt_target_path = os.path.join(FRONTEND_DATA_DIR, "srt_situation_bank.json")

if os.path.exists(srt_source_path):
    with open(srt_source_path, 'r', encoding='utf-8') as f:
        srt_data = json.load(f)
        
    frontend_srt = {
        "metadata": {
            "total_situations": len(srt_data) * 60,
            "sets": len(srt_data),
            "situations_per_set": 60,
            "time_per_situation_seconds": 30,
            "source": "SSB Standard SRT Bank — Curated 60 Sets"
        },
        "sets": []
    }
    
    for item in srt_data:
        set_id = int(item["set_id"].split("_")[1])
        situations = [q["situation"] for q in item["questions"]]
        frontend_srt["sets"].append({
            "set_id": set_id,
            "name": f"Set {set_id:02d} — Curated SRT",
            "situations": situations
        })
        
    with open(srt_target_path, 'w', encoding='utf-8') as f:
        json.dump(frontend_srt, f, indent=2)
    print(f"Synced {len(srt_data)} SRT sets to {srt_target_path}")
else:
    print(f"Warning: {srt_source_path} does not exist.")
