import json
import os
import random

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\60_sets"

# Ensure directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def save_json(filename, data):
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

# ==========================================
# SEED DATA FOR PROCEDURAL GENERATION
# ==========================================
WAT_WORDS_BASE = [
    "Courage", "Defeat", "Weapon", "Compromise", "Mother", "Failure", "Blood", "Command",
    "Impossible", "Team", "Leader", "Death", "Fear", "Dark", "Ghost", "Enemy", "Friend",
    "Success", "Win", "Lose", "Duty", "Respect", "Country", "Flag", "Gun", "Shoot",
    "Kill", "Save", "Protect", "Help", "Cry", "Laugh", "Anger", "Love", "Hate",
    "Peace", "War", "Battle", "Fight", "Run", "Hide", "Seek", "Find", "Lose",
    "Give", "Take", "Share", "Care", "Trust", "Betray", "Loyal", "Honest", "Lie",
    "Truth", "False", "Right", "Wrong", "Good", "Bad", "Ugly", "Beautiful", "Smart",
    "Stupid", "Idiot", "Genius", "Crazy", "Sane", "Mad", "Glad", "Sad", "Happy",
    "Joy", "Sorrow", "Pain", "Pleasure", "Hard", "Soft", "Rough", "Smooth", "Sharp",
    "Blunt", "Fast", "Slow", "Quick", "Delay", "Wait", "Hurry", "Rush", "Stop"
] * 40 # Expand base pool

SRT_SUBJECTS = ["He", "She", "You"]
SRT_ACTIONS = ["was returning home from college", "was traveling in a train", "was walking in a dark street", "was leading a patrol", "was preparing for exams", "was attending a party", "was hiking in the mountains", "was driving a car"]
SRT_CRISES = ["when a gang of robbers attacked", "and suddenly saw a house on fire", "but lost the wallet containing important documents", "when a snake bit his friend", "and saw an accident happening right in front", "when the commander got severely injured", "but the train stopped in a deserted area due to track damage", "and realized someone was following"]

PI_CATEGORIES = ["Family", "Education", "Hobbies", "Motivation", "Current Affairs", "Hypothetical"]
GD_TOPICS = ["Women in Armed Forces", "AI in Warfare", "Climate Change and Security", "Privatization of Space", "Impact of Social Media on Youth", "Compulsory Military Training", "Cyber Security", "India's Foreign Policy", "Brain Drain", "Education System in India"]
LECTURETTE_TOPICS = ["Global Warming", "My Favorite Personality", "Indian Economy", "Sports in India", "Terrorism", "Nuclear Energy", "Space Exploration", "Democracy", "Poverty", "Unemployment", "Role of Media", "Water Crisis", "Electric Vehicles", "Make in India", "Agnipath Scheme"]

def generate_sets():
    all_wat = []
    all_srt = []
    all_tat = []
    all_ppdt = []
    all_pi = []
    all_sd = []
    all_lecturette = []
    all_gd = []
    all_gpe = []
    all_gto = []
    all_cpss = []

    for set_num in range(1, 61):
        set_id = f"SET_{set_num:02d}"

        # 1. WAT (60 words)
        wat_set = random.sample(WAT_WORDS_BASE, 60)
        wat_data = [{"word_no": i+1, "word": w} for i, w in enumerate(wat_set)]
        all_wat.append({"set_id": set_id, "test": "WAT", "questions": wat_data})

        # 2. SRT (60 situations)
        srt_data = []
        for i in range(1, 61):
            subj = random.choice(SRT_SUBJECTS)
            act = random.choice(SRT_ACTIONS)
            crisis = random.choice(SRT_CRISES)
            situation = f"{subj} {act} {crisis}. {subj}..."
            srt_data.append({"srt_no": i, "situation": situation})
        all_srt.append({"set_id": set_id, "test": "SRT", "questions": srt_data})

        # 3. TAT (11 pictures + 1 blank)
        tat_data = []
        for i in range(1, 12):
            image_url = f"https://picsum.photos/seed/tat_{set_num}_{i}/800/600"
            tat_data.append({"pic_no": i, "image_url": image_url, "type": "picture"})
        tat_data.append({"pic_no": 12, "image_url": None, "type": "blank"})
        all_tat.append({"set_id": set_id, "test": "TAT", "questions": tat_data})

        # 4. PPDT (1 hazy picture)
        ppdt_data = [{
            "pic_no": 1,
            "image_url": f"https://picsum.photos/seed/ppdt_{set_num}/800/600?blur=4",
            "description": "Hazy picture of 2-3 characters in an ambiguous setting."
        }]
        all_ppdt.append({"set_id": set_id, "test": "PPDT", "questions": ppdt_data})

        # 5. PI (20 questions)
        pi_data = []
        for i in range(1, 21):
            cat = random.choice(PI_CATEGORIES)
            pi_data.append({"q_no": i, "category": cat, "question": f"Question about {cat} - variant {random.randint(1, 100)}"})
        all_pi.append({"set_id": set_id, "test": "PI", "questions": pi_data})

        # 6. SD (1 set of 5 paragraphs)
        sd_data = [
            {"para": "Parents' Opinion", "prompt": "What do your parents think about you?"},
            {"para": "Teachers' Opinion", "prompt": "What do your teachers/employers think about you?"},
            {"para": "Friends' Opinion", "prompt": "What do your friends think about you?"},
            {"para": "Self Opinion", "prompt": "What is your own opinion about yourself?"},
            {"para": "Qualities to Improve", "prompt": "What qualities would you like to improve?"}
        ]
        all_sd.append({"set_id": set_id, "test": "SD", "questions": sd_data})

        # 7. Lecturette (4 topics)
        lec_topics = random.sample(LECTURETTE_TOPICS, min(4, len(LECTURETTE_TOPICS)))
        lec_data = [{"topic_no": i+1, "topic": t} for i, t in enumerate(lec_topics)]
        all_lecturette.append({"set_id": set_id, "test": "Lecturette", "questions": lec_data})

        # 8. GD (2 topics)
        gd_tops = random.sample(GD_TOPICS, min(2, len(GD_TOPICS)))
        gd_data = [{"topic_no": i+1, "topic": t} for i, t in enumerate(gd_tops)]
        all_gd.append({"set_id": set_id, "test": "GD", "questions": gd_data})

        # 9. GPE (1 map and scenario)
        gpe_data = [{
            "scenario_no": 1,
            "map_url": f"https://picsum.photos/seed/gpe_{set_num}/800/600",
            "narrative": f"You are a group of {random.randint(4,10)} students returning from a trip. Suddenly you face 4 different problems of varying urgency..."
        }]
        all_gpe.append({"set_id": set_id, "test": "GPE", "questions": gpe_data})

        # 10. GTO (PGT, HGT, IO, FGT)
        gto_data = [
            {"task": "PGT", "description": "Progressive Group Task with 4 obstacles"},
            {"task": "HGT", "description": "Half Group Task with 1 obstacle"},
            {"task": "IO", "description": "Individual Obstacles (10 obstacles)"},
            {"task": "FGT", "description": "Final Group Task with 1 obstacle"}
        ]
        all_gto.append({"set_id": set_id, "test": "GTO", "questions": gto_data})
        
        # 11. CPSS (10 cognitive questions)
        cpss_data = []
        for i in range(1, 11):
            cpss_data.append({"q_no": i, "question": f"Spatial orientation and dial reading scenario {random.randint(1,100)}"})
        all_cpss.append({"set_id": set_id, "test": "CPSS", "questions": cpss_data})

    # Save everything to JSON files
    save_json("wat_60_sets.json", all_wat)
    save_json("srt_60_sets.json", all_srt)
    save_json("tat_60_sets.json", all_tat)
    save_json("ppdt_60_sets.json", all_ppdt)
    save_json("pi_60_sets.json", all_pi)
    save_json("sd_60_sets.json", all_sd)
    save_json("lecturette_60_sets.json", all_lecturette)
    save_json("gd_60_sets.json", all_gd)
    save_json("gpe_60_sets.json", all_gpe)
    save_json("gto_60_sets.json", all_gto)
    save_json("cpss_60_sets.json", all_cpss)

    print("Successfully generated 60 unique sets for all requested tests (TAT, WAT, GPE, PPDT, PI, SRT, SD, Lecturette, GD, GTO, CPSS) with image URLs!")

if __name__ == "__main__":
    generate_sets()
