import json
import os

CURATED_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
SOURCE_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\60_sets"

os.makedirs(CURATED_DIR, exist_ok=True)

# List of source files
FILES = {
    "TAT": "tat_60_sets.json",
    "WAT": "wat_60_sets.json",
    "SRT": "srt_60_sets.json",
    "PPDT": "ppdt_60_sets.json",
    "PI": "pi_60_sets.json",
    "SD": "sd_60_sets.json",
    "Lecturette": "lecturette_60_sets.json",
    "GD": "gd_60_sets.json",
    "GPE": "gpe_60_sets.json",
    "GTO": "gto_60_sets.json",
    "CPSS": "cpss_60_sets.json"
}

# Load all source files
source_data = {}
for test_type, filename in FILES.items():
    filepath = os.path.join(SOURCE_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            source_data[test_type] = json.load(f)
        print(f"Loaded {test_type} source data: {len(source_data[test_type])} sets.")
    else:
        print(f"Warning: {filepath} does not exist.")

# Generate sets 13 to 60
for set_num in range(1, 61):
    set_id = f"SET_{set_num:02d}"
    target_path = os.path.join(CURATED_DIR, f"set_{set_num:02d}.json")
    
    # Check if sets 1 to 60 already exist and preserve them
    if set_num <= 60 and os.path.exists(target_path):
        print(f"Preserving existing custom curated set: set_{set_num:02d}.json")
        continue

    print(f"Generating set_{set_num:02d}.json from source files...")
    
    curated_set = {
        "set_id": set_id,
        "description": f"High-Quality Curated SSB Dataset - Set {set_num}"
    }
    
    # 1. TAT
    tat_set = next((s for s in source_data.get("TAT", []) if s["set_id"] == set_id), None)
    if tat_set:
        curated_set["TAT"] = []
        for q in tat_set.get("questions", []):
            pic_no = q.get("pic_no")
            img_url = q.get("image_url")
            q_type = q.get("type", "picture")
            
            desc = "BLANK PICTURE" if q_type == "blank" else f"Theme-based TAT image sequence pic_no {pic_no}"
            curated_set["TAT"].append({
                "pic_no": pic_no,
                "description": desc,
                "image_url": img_url
            })
    
    # 2. WAT
    wat_set = next((s for s in source_data.get("WAT", []) if s["set_id"] == set_id), None)
    if wat_set:
        curated_set["WAT"] = [q.get("word") for q in wat_set.get("questions", [])]
        
    # 3. SRT
    srt_set = next((s for s in source_data.get("SRT", []) if s["set_id"] == set_id), None)
    if srt_set:
        curated_set["SRT"] = [q.get("situation") for q in srt_set.get("questions", [])]
        
    # 4. PPDT
    ppdt_set = next((s for s in source_data.get("PPDT", []) if s["set_id"] == set_id), None)
    if ppdt_set and ppdt_set.get("questions"):
        q = ppdt_set["questions"][0]
        curated_set["PPDT"] = {
            "image_url": q.get("image_url"),
            "description": q.get("description", "Hazy picture of an ambiguous scene.")
        }
        
    # 5. PI
    pi_set = next((s for s in source_data.get("PI", []) if s["set_id"] == set_id), None)
    if pi_set:
        curated_set["PI"] = [q.get("question") for q in pi_set.get("questions", [])]
        
    # 6. SD
    sd_set = next((s for s in source_data.get("SD", []) if s["set_id"] == set_id), None)
    if sd_set:
        curated_set["SD"] = [q.get("prompt") for q in sd_set.get("questions", [])]
        
    # 7. Lecturette
    lec_set = next((s for s in source_data.get("Lecturette", []) if s["set_id"] == set_id), None)
    if lec_set:
        curated_set["Lecturette"] = [q.get("topic") for q in lec_set.get("questions", [])]
        
    # 8. GD
    gd_set = next((s for s in source_data.get("GD", []) if s["set_id"] == set_id), None)
    if gd_set:
        curated_set["GD"] = [q.get("topic") for q in gd_set.get("questions", [])]
        
    # 9. GPE
    gpe_set = next((s for s in source_data.get("GPE", []) if s["set_id"] == set_id), None)
    if gpe_set and gpe_set.get("questions"):
        q = gpe_set["questions"][0]
        curated_set["GPE"] = {
            "narrative": q.get("narrative"),
            "map_url": q.get("map_url")
        }
        
    # 10. GTO
    gto_set = next((s for s in source_data.get("GTO", []) if s["set_id"] == set_id), None)
    if gto_set:
        curated_set["GTO"] = {}
        for q in gto_set.get("questions", []):
            curated_set["GTO"][q.get("task")] = q.get("description")
            
    # 11. CPSS
    cpss_set = next((s for s in source_data.get("CPSS", []) if s["set_id"] == set_id), None)
    if cpss_set:
        curated_set["CPSS"] = [q.get("question") for q in cpss_set.get("questions", [])]

    # Save curated set to file
    with open(target_path, 'w', encoding='utf-8') as f:
        json.dump(curated_set, f, indent=2)

print("All 60 curated sets are fully ready and built!")
