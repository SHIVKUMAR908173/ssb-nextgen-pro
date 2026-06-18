"""
sync_all_60_sets.py — Master Sync Script
=========================================
Syncs ALL 11 modules from database/datasets/60_sets/ → frontend/src/data/
Each module is transformed into a frontend-consumable format with metadata.

Modules: WAT, SRT, TAT, PPDT, SD, GD, GPE, GTO, PI, Lecturette, CPSS
"""

import json
import os

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SOURCE_DIR = os.path.join(BASE, "database", "datasets", "60_sets")
TARGET_DIR = os.path.join(BASE, "frontend", "src", "data")

def load_source(filename):
    path = os.path.join(SOURCE_DIR, filename)
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_target(filename, data):
    path = os.path.join(TARGET_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    size_kb = round(os.path.getsize(path) / 1024, 1)
    print(f"  ✅ Synced → {filename} ({size_kb} KB)")

def sync_wat():
    """WAT: Word Association Test — 60 words per set"""
    print("\n📝 WAT (Word Association Test)")
    data = load_source("wat_60_sets.json")
    frontend = {
        "metadata": {
            "total_words": sum(len(s.get("questions", [])) for s in data),
            "sets": len(data),
            "words_per_set": 60,
            "time_per_word_seconds": 15,
            "source": "SSB Standard WAT Bank — Curated 60 Sets"
        },
        "sets": []
    }
    for item in data:
        set_num = int(item["set_id"].replace("SET_", ""))
        words = [q.get("word", q.get("question", "")) for q in item.get("questions", [])]
        frontend["sets"].append({
            "set_id": set_num,
            "name": f"Set {set_num:02d} — Curated WAT",
            "words": words
        })
    save_target("wat_word_bank.json", frontend)

def sync_srt():
    """SRT: Situation Reaction Test — 60 situations per set"""
    print("\n🎯 SRT (Situation Reaction Test)")
    data = load_source("srt_60_sets.json")
    frontend = {
        "metadata": {
            "total_situations": sum(len(s.get("questions", [])) for s in data),
            "sets": len(data),
            "situations_per_set": 60,
            "time_per_situation_seconds": 30,
            "source": "SSB Standard SRT Bank — Curated 60 Sets"
        },
        "sets": []
    }
    for item in data:
        set_num = int(item["set_id"].replace("SET_", ""))
        situations = [q.get("situation", q.get("question", "")) for q in item.get("questions", [])]
        frontend["sets"].append({
            "set_id": set_num,
            "name": f"Set {set_num:02d} — Curated SRT",
            "situations": situations
        })
    save_target("srt_situation_bank.json", frontend)

def sync_tat():
    """TAT: Thematic Apperception Test — scenarios per set"""
    print("\n🖼️  TAT (Thematic Apperception Test)")
    data = load_source("tat_60_sets.json")
    frontend = {
        "metadata": {
            "total_scenarios": sum(len(s.get("questions", [])) for s in data),
            "sets": len(data),
            "time_per_story_seconds": 270,
            "source": "SSB Standard TAT Bank — Curated 60 Sets"
        },
        "sets": []
    }
    for item in data:
        set_num = int(item["set_id"].replace("SET_", ""))
        scenarios = []
        for q in item.get("questions", []):
            scenarios.append({
                "description": q.get("description", q.get("question", q.get("scenario", ""))),
                "suggested_themes": q.get("suggested_themes", q.get("themes", [])),
                "protagonist_age": q.get("protagonist_age", 25),
                "protagonist_gender": q.get("protagonist_gender", "Neutral")
            })
        frontend["sets"].append({
            "set_id": set_num,
            "name": f"Set {set_num:02d} — Curated TAT",
            "scenarios": scenarios
        })
    save_target("tat_60_sets.json", frontend)

def sync_ppdt():
    """PPDT: Picture Perception & Description Test"""
    print("\n📸 PPDT (Picture Perception & Description Test)")
    data = load_source("ppdt_60_sets.json")
    frontend = {
        "metadata": {
            "total_images": sum(len(s.get("questions", [])) for s in data),
            "sets": len(data),
            "time_per_story_seconds": 270,
            "narration_time_seconds": 60,
            "source": "SSB Standard PPDT Bank — Curated 60 Sets"
        },
        "sets": []
    }
    for item in data:
        set_num = int(item["set_id"].replace("SET_", ""))
        images = []
        for q in item.get("questions", []):
            images.append({
                "description": q.get("description", q.get("question", "")),
                "mood": q.get("mood", "NEUTRAL"),
                "num_characters": q.get("num_characters", q.get("character_count", 2)),
                "action_visible": q.get("action_visible", True),
                "gender_distribution": q.get("gender_distribution", "Mixed")
            })
        frontend["sets"].append({
            "set_id": set_num,
            "name": f"Set {set_num:02d} — Curated PPDT",
            "images": images
        })
    save_target("ppdt_60_sets.json", frontend)

def sync_sd():
    """SD: Self Description Test"""
    print("\n✍️  SD (Self Description Test)")
    data = load_source("sd_60_sets.json")
    frontend = {
        "metadata": {
            "total_prompts": sum(len(s.get("questions", [])) for s in data),
            "sets": len(data),
            "time_limit_minutes": 15,
            "word_limit": "150-200 words per section",
            "source": "SSB Standard SD Bank — Curated 60 Sets"
        },
        "sets": []
    }
    for item in data:
        set_num = int(item["set_id"].replace("SET_", ""))
        prompts = []
        for q in item.get("questions", []):
            prompts.append({
                "perspective": q.get("perspective", q.get("category", "Self")),
                "prompt": q.get("prompt", q.get("question", "")),
                "focus_areas": q.get("focus_areas", q.get("key_points", []))
            })
        frontend["sets"].append({
            "set_id": set_num,
            "name": f"Set {set_num:02d} — Curated SD",
            "prompts": prompts
        })
    save_target("sd_60_sets.json", frontend)

def sync_gd():
    """GD: Group Discussion Topics"""
    print("\n💬 GD (Group Discussion)")
    data = load_source("gd_60_sets.json")
    frontend = {
        "metadata": {
            "total_topics": sum(len(s.get("questions", [])) for s in data),
            "sets": len(data),
            "time_per_discussion_minutes": 20,
            "source": "SSB Standard GD Bank — Curated 60 Sets"
        },
        "sets": []
    }
    for item in data:
        set_num = int(item["set_id"].replace("SET_", ""))
        topics = []
        for q in item.get("questions", []):
            topics.append({
                "topic": q.get("topic", q.get("question", "")),
                "category": q.get("category", "General"),
                "key_points": q.get("key_points", q.get("lead_points", []))
            })
        frontend["sets"].append({
            "set_id": set_num,
            "name": f"Set {set_num:02d} — Curated GD",
            "topics": topics
        })
    save_target("gd_60_sets.json", frontend)

def sync_gpe():
    """GPE: Group Planning Exercise"""
    print("\n🗺️  GPE (Group Planning Exercise)")
    data = load_source("gpe_60_sets.json")
    frontend = {
        "metadata": {
            "total_scenarios": sum(len(s.get("questions", [])) for s in data),
            "sets": len(data),
            "planning_time_minutes": 10,
            "discussion_time_minutes": 20,
            "source": "SSB Standard GPE Bank — Curated 60 Sets"
        },
        "sets": []
    }
    for item in data:
        set_num = int(item["set_id"].replace("SET_", ""))
        scenarios = []
        for q in item.get("questions", []):
            scenarios.append({
                "title": q.get("title", q.get("question", "")),
                "description": q.get("description", q.get("scenario", "")),
                "problems": q.get("problems", []),
                "resources": q.get("resources", q.get("available_resources", {})),
                "urgency": q.get("urgency", "High")
            })
        frontend["sets"].append({
            "set_id": set_num,
            "name": f"Set {set_num:02d} — Curated GPE",
            "scenarios": scenarios
        })
    save_target("gpe_60_sets.json", frontend)

def sync_gto():
    """GTO: Group Testing Officer Tasks"""
    print("\n🏋️  GTO (Group Testing Officer Tasks)")
    data = load_source("gto_60_sets.json")
    frontend = {
        "metadata": {
            "total_tasks": sum(len(s.get("questions", [])) for s in data),
            "sets": len(data),
            "source": "SSB Standard GTO Bank — Curated 60 Sets"
        },
        "sets": []
    }
    for item in data:
        set_num = int(item["set_id"].replace("SET_", ""))
        tasks = []
        for q in item.get("questions", []):
            tasks.append({
                "task_type": q.get("task_type", q.get("type", "PGT")),
                "objective": q.get("objective", q.get("question", "")),
                "description": q.get("description", ""),
                "obstacles": q.get("obstacles", []),
                "materials": q.get("materials", q.get("available_materials", [])),
                "time_limit_minutes": q.get("time_limit_minutes", q.get("time_limit", 15))
            })
        frontend["sets"].append({
            "set_id": set_num,
            "name": f"Set {set_num:02d} — Curated GTO",
            "tasks": tasks
        })
    save_target("gto_60_sets.json", frontend)

def sync_pi():
    """PI: Personal Interview Questions"""
    print("\n🎙️  PI (Personal Interview)")
    data = load_source("pi_60_sets.json")
    frontend = {
        "metadata": {
            "total_questions": sum(len(s.get("questions", [])) for s in data),
            "sets": len(data),
            "interview_duration_minutes": 30,
            "source": "SSB Standard PI Bank — Curated 60 Sets"
        },
        "sets": []
    }
    for item in data:
        set_num = int(item["set_id"].replace("SET_", ""))
        questions = []
        for q in item.get("questions", []):
            questions.append({
                "question": q.get("question", ""),
                "category": q.get("category", "General"),
                "intent": q.get("intent", q.get("assessment_focus", "")),
                "follow_ups": q.get("follow_ups", q.get("follow_up_questions", [])),
                "difficulty": q.get("difficulty", "Medium")
            })
        frontend["sets"].append({
            "set_id": set_num,
            "name": f"Set {set_num:02d} — Curated PI",
            "questions": questions
        })
    save_target("pi_60_sets.json", frontend)

def sync_lecturette():
    """Lecturette: Topics for 3-minute speeches"""
    print("\n🎤 Lecturette Topics")
    data = load_source("lecturette_60_sets.json")
    frontend = {
        "metadata": {
            "total_topics": sum(len(s.get("questions", [])) for s in data),
            "sets": len(data),
            "speech_duration_minutes": 3,
            "preparation_time_seconds": 180,
            "source": "SSB Standard Lecturette Bank — Curated 60 Sets"
        },
        "sets": []
    }
    for item in data:
        set_num = int(item["set_id"].replace("SET_", ""))
        topics = []
        for q in item.get("questions", []):
            topics.append({
                "topic": q.get("topic", q.get("question", "")),
                "category": q.get("category", "General"),
                "key_points": q.get("key_points", q.get("talking_points", [])),
                "difficulty": q.get("difficulty", q.get("difficulty_tier", "Average"))
            })
        frontend["sets"].append({
            "set_id": set_num,
            "name": f"Set {set_num:02d} — Curated Lecturette",
            "topics": topics
        })
    save_target("lecturette_60_sets.json", frontend)

def sync_cpss():
    """CPSS: Command Post & Situational Studies"""
    print("\n🎖️  CPSS (Command Post & Situational Studies)")
    data = load_source("cpss_60_sets.json")
    frontend = {
        "metadata": {
            "total_scenarios": sum(len(s.get("questions", [])) for s in data),
            "sets": len(data),
            "time_per_scenario_minutes": 15,
            "source": "SSB Standard CPSS Bank — Curated 60 Sets"
        },
        "sets": []
    }
    for item in data:
        set_num = int(item["set_id"].replace("SET_", ""))
        scenarios = []
        for q in item.get("questions", []):
            scenarios.append({
                "scenario": q.get("scenario", q.get("question", "")),
                "context": q.get("context", q.get("background", "")),
                "objectives": q.get("objectives", q.get("tasks", [])),
                "constraints": q.get("constraints", []),
                "category": q.get("category", "Tactical")
            })
        frontend["sets"].append({
            "set_id": set_num,
            "name": f"Set {set_num:02d} — Curated CPSS",
            "scenarios": scenarios
        })
    save_target("cpss_60_sets.json", frontend)

def main():
    print("=" * 60)
    print("🚀 SSB NextGen Pro — Master 60-Set Sync")
    print(f"   Source: {SOURCE_DIR}")
    print(f"   Target: {TARGET_DIR}")
    print("=" * 60)

    sync_wat()
    sync_srt()
    sync_tat()
    sync_ppdt()
    sync_sd()
    sync_gd()
    sync_gpe()
    sync_gto()
    sync_pi()
    sync_lecturette()
    sync_cpss()

    print("\n" + "=" * 60)
    print("✅ ALL 11 MODULES SYNCED — 60 sets each — 660 total sets!")
    print("=" * 60)

if __name__ == "__main__":
    main()
