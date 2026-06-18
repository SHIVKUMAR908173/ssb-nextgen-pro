from fastapi import APIRouter, HTTPException
import json
import random
import os

router = APIRouter()

# Determine the path to the frontend data directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
FRONTEND_DATA_DIR = os.path.join(BASE_DIR, "frontend", "src", "data")

def load_json_dataset(filename: str):
    filepath = os.path.join(FRONTEND_DATA_DIR, filename)
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None

@router.get("/datasets/{test_type}/random", summary="Get a random test set from the datasets")
async def get_random_test_dataset(test_type: str, limit: int = 10):
    """
    Fetches a random subset of questions from the requested dataset.
    Supported types: 'wat', 'srt', 'lecturette', 'interview', 'gd', 'psych'
    """
    dataset_map = {
        "wat": "wat_word_bank.json",
        "srt": "srt_situation_bank.json",
        "lecturette": "lecturette_topics.json",
        "interview": "interview_question_bank.json",
        "gd": "gd_topics.json",
        "psych": "psych_scenario_bank.json"
    }

    if test_type not in dataset_map:
        raise HTTPException(status_code=400, detail="Invalid test type. Supported types: wat, srt, lecturette, interview, gd, psych")

    data = load_json_dataset(dataset_map[test_type])
    if not data:
        raise HTTPException(status_code=500, detail="Failed to load dataset.")

    # Flatten or extract the list of items based on the known schemas
    items = []
    if test_type == "wat":
        for cat in data.get("categories", []):
            items.extend(cat.get("words", []))
    elif test_type == "srt":
        for cat in data.get("sets", []):
            items.extend(cat.get("situations", []))
    elif test_type == "lecturette":
        for cat in data.get("categories", []):
            items.extend(cat.get("topics", []))
    elif test_type == "interview":
        for stage in data.get("stages", []):
            items.extend(stage.get("questions", []))
    elif test_type == "gd":
        items = data.get("topics", [])
    elif test_type == "psych":
        # Psych has tat_stimuli, ppdt_stimuli, gpe_scenarios, sd_sections
        items = data.get("tat_stimuli", []) + data.get("ppdt_stimuli", []) + data.get("gpe_scenarios", [])

    if not items:
        return {"status": "success", "data": []}

    # Return a random sample
    sample_size = min(limit, len(items))
    random_sample = random.sample(items, sample_size)
    
    return {"status": "success", "count": len(random_sample), "data": random_sample}

@router.get("/datasets/oir/random", summary="Get a random OIR test set")
async def get_random_oir_dataset():
    """
    Randomly selects one of the 96 OIR sets.
    """
    # Simply load the master bank and pick a random set
    # Wait, master bank is 2.8MB, it might be slow to load entirely every time.
    # We will pick a random file from oir_set1 to oir_set96 if we want, or just load master.
    try:
        master_path = os.path.join(FRONTEND_DATA_DIR, "oir_master_bank.json")
        with open(master_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        sets = data.get("sets", [])
        if not sets:
            return {"status": "error", "detail": "No sets found in master bank."}
            
        random_set = random.choice(sets)
        return {"status": "success", "data": random_set}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load OIR master bank: {e}")
