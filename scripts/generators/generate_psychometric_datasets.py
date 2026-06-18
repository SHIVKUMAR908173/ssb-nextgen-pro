import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets"

# Ensure directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def save_json(filename, data):
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

def generate_datasets():
    # 1. Word Association Test (WAT) Repository
    wat_words = [
        {"id": "W1", "word": "Courage", "difficulty": "Medium"},
        {"id": "W2", "word": "Defeat", "difficulty": "Hard"},
        {"id": "W3", "word": "Weapon", "difficulty": "Medium"},
        {"id": "W4", "word": "Compromise", "difficulty": "Hard"},
        {"id": "W5", "word": "Mother", "difficulty": "Easy"},
        {"id": "W6", "word": "Failure", "difficulty": "Hard"},
        {"id": "W7", "word": "Blood", "difficulty": "Hard"},
        {"id": "W8", "word": "Command", "difficulty": "Medium"},
        {"id": "W9", "word": "Impossible", "difficulty": "Hard"},
        {"id": "W10", "word": "Team", "difficulty": "Easy"}
    ]
    # In production, this would scale to 1000+ words.
    save_json("wat_repository.json", wat_words)

    # 2. Situation Reaction Test (SRT) Scenarios
    srt_scenarios = [
        {"id": "S1", "scenario": "He was riding his bike and saw a man bleeding on the roadside. He...", "category": "Emergency Response"},
        {"id": "S2", "scenario": "During a patrol, his commander is suddenly injured by a sniper and unconscious. He...", "category": "Combat Leadership"},
        {"id": "S3", "scenario": "His exams are tomorrow, but his best friend needs urgent financial help for a hospital bill. He...", "category": "Social Adjustment"},
        {"id": "S4", "scenario": "He is the captain of the football team, but his star player refuses to practice before the final match. He...", "category": "Team Management"},
        {"id": "S5", "scenario": "While traveling in a train, he notices a suspicious unattended bag under his seat. He...", "category": "Vigilance"}
    ]
    save_json("srt_scenarios.json", srt_scenarios)

    # 3. Self-Description Test (SDT) Prompts
    sdt_prompts = [
        {"id": "SDT1", "perspective": "Parents", "prompt": "What is the opinion of your parents about you?"},
        {"id": "SDT2", "perspective": "Teachers", "prompt": "What do your teachers or employers think about you?"},
        {"id": "SDT3", "perspective": "Friends", "prompt": "What do your friends think about you?"},
        {"id": "SDT4", "perspective": "Self", "prompt": "What is your own opinion about yourself?"},
        {"id": "SDT5", "perspective": "Future", "prompt": "What are the qualities you would like to improve in yourself?"}
    ]
    save_json("sdt_prompts.json", sdt_prompts)

    # 4. The 15 Officer-Like Qualities (OLQ) Matrix
    olq_matrix = {
        "Factor I: Planning and Organising": [
            {"name": "Effective Intelligence", "description": "Ability to find practical solutions to complex problems."},
            {"name": "Reasoning Ability", "description": "Ability to grasp the essentials of a problem and arrive at logical conclusions."},
            {"name": "Organising Ability", "description": "Ability to arrange resources in a systematic manner."},
            {"name": "Power of Expression", "description": "Ability to put across one's ideas clearly and with ease."}
        ],
        "Factor II: Social Adjustment": [
            {"name": "Social Adaptability", "description": "Ability to adapt oneself to the social environment."},
            {"name": "Cooperation", "description": "Ability to willingly work with others in a group."},
            {"name": "Sense of Responsibility", "description": "Understanding one's duties and discharging them faithfully."}
        ],
        "Factor III: Social Effectiveness": [
            {"name": "Initiative", "description": "Ability to originate an action and sustain it."},
            {"name": "Self-Confidence", "description": "Faith in one's own abilities to meet stressful situations."},
            {"name": "Speed of Decision", "description": "Ability to arrive at workable decisions quickly."},
            {"name": "Ability to Influence the Group", "description": "Capacity to persuade others to achieve a common objective."}
        ],
        "Factor IV: Dynamic": [
            {"name": "Liveliness", "description": "Capacity to remain buoyant and cheerful in adversity."},
            {"name": "Determination", "description": "Sustained effort to achieve an objective in spite of obstacles."},
            {"name": "Courage", "description": "Ability to take calculated risks willingly."},
            {"name": "Stamina", "description": "Capacity to withstand prolonged physical and mental strain."}
        ]
    }
    save_json("olq_matrix.json", olq_matrix)

    # 5. PIQ to CIQ Mapping Database
    piq_ciq_mapping = [
        {
            "piq_trigger": {"field": "sports", "condition": "None"},
            "ciq_question": "I see you haven't actively participated in sports. How do you maintain your physical stamina and teamwork skills without athletic involvement?"
        },
        {
            "piq_trigger": {"field": "previous_attempts", "condition": "> 0"},
            "ciq_question": "You were screened out/conferenced out previously. What specific structural failures did you identify in your last attempt, and what exact actions have you taken to rectify them?"
        },
        {
            "piq_trigger": {"field": "education_gap", "condition": "Yes"},
            "ciq_question": "There is a gap in your academic record. Walk me through exactly what you were doing during this period and what productive skills you acquired."
        }
    ]
    save_json("piq_ciq_mapping.json", piq_ciq_mapping)

    # 6. "Recommended Candidate" Benchmark Datasets
    benchmark_dataset = [
        {
            "test": "WAT",
            "stimulus": "Defeat",
            "recommended_response": "Defeat is a stepping stone to final victory.",
            "olq_flags": ["Optimism", "Determination"]
        },
        {
            "test": "SRT",
            "stimulus": "He was riding his bike and saw a man bleeding on the roadside. He...",
            "recommended_response": "He immediately stopped, provided first aid using his emergency kit, stopped a passing vehicle to take the man to the nearest hospital, informed the police, and then proceeded to his destination.",
            "olq_flags": ["Speed of Decision", "Sense of Responsibility", "Initiative"]
        }
    ]
    save_json("recommended_benchmarks.json", benchmark_dataset)

    print("Successfully generated all psychological and architectural datasets!")

if __name__ == "__main__":
    generate_datasets()
