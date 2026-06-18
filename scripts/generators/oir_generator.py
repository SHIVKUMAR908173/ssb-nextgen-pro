import json
import random
import os

# --- QUESTION TEMPLATES & DATA BANKS ---

ANALOGIES = [
    {"q": "Day is to Night as Light is to __________.", "o": ["(1) Bright", "(2) Sun", "(3) Dark", "(4) Bulb", "(5) Heavy"], "a": "3", "e": "Opposites: Day/Night, Light/Dark."},
    {"q": "Car is to Road as Boat is to __________.", "o": ["(1) Wheel", "(2) Water", "(3) Sail", "(4) Sink", "(5) Ocean"], "a": "2", "e": "Travel surface: Car/Road, Boat/Water."},
    {"q": "Doctor is to Hospital as Teacher is to __________.", "o": ["(1) Class", "(2) School", "(3) Student", "(4) Book", "(5) Chalk"], "a": "2", "e": "Workplace: Doctor/Hospital, Teacher/School."},
    {"q": "Knife is to Cut as Pen is to __________.", "o": ["(1) Ink", "(2) Paper", "(3) Write", "(4) Sharp", "(5) Draw"], "a": "3", "e": "Function: Knife/Cut, Pen/Write."},
    {"q": "Lion is to Pride as Wolf is to __________.", "o": ["(1) Pack", "(2) Herd", "(3) Den", "(4) Cub", "(5) Forest"], "a": "1", "e": "Group name: Lion/Pride, Wolf/Pack."},
]

ODD_ONE_OUT = [
    {"q": "Which word does not belong to the same class as others?", "o": ["(1) Apple", "(2) Mango", "(3) Rose", "(4) Banana", "(5) Orange"], "a": "3", "e": "Rose is a flower, others are fruits."},
    {"q": "Which word does not belong to the same class as others?", "o": ["(1) Square", "(2) Triangle", "(3) Circle", "(4) Sphere", "(5) Pentagon"], "a": "4", "e": "Sphere is 3D, others are 2D shapes."},
    {"q": "Which word does not belong to the same class as others?", "o": ["(1) Copper", "(2) Silver", "(3) Gold", "(4) Plastic", "(5) Iron"], "a": "4", "e": "Plastic is a polymer, others are metals."},
    {"q": "Which word does not belong to the same class as others?", "o": ["(1) Car", "(2) Bus", "(3) Truck", "(4) Bicycle", "(5) Boat"], "a": "5", "e": "Boat travels on water, others on land."},
]

MATH_LOGIC = [
    {"q": "If 5 pencils cost 25 rupees, what is the cost of 8 pencils?", "o": ["(1) 35", "(2) 40", "(3) 45", "(4) 50"], "a": "2", "e": "1 pencil costs 5. 8 * 5 = 40."},
    {"q": "If 'DOG' is coded as 26, what is 'CAT' coded as? (A=1, B=2...)", "o": ["(1) 22", "(2) 23", "(3) 24", "(4) 25"], "a": "3", "e": "C=3, A=1, T=20. 3+1+20 = 24."},
    {"q": "How many 7's are there in the sequence which are preceded by 3? 3 7 2 3 7 7 3 5 7", "o": ["(1) 1", "(2) 2", "(3) 3", "(4) 4"], "a": "2", "e": "Sequence '3 7' appears twice."},
]

WORD_REARRANGE = [
    {"q": "Write the LAST letter of the rearranged sentence: many too spoil cooks broth the", "a": "h", "e": "Sentence: 'Too many cooks spoil the broth'. Last letter 'h'."},
    {"q": "Write the FIRST letter of the word to be OMITTED: The loud silent bell rang at noon.", "a": "s", "e": "Word to omit is 'silent'. First letter 's'."},
]

# --- GENERATION LOGIC ---

def generate_set(set_num):
    questions = []
    
    # 5 Justification
    for i in range(1, 6):
        # Placeholder for complex justification, using simple ones for demo
        questions.append({
            "question_number": i,
            "category": "Statement Justification & Logic",
            "question_text": f"Statement {i}: Education is the key to success because it provides knowledge and skills.",
            "options": ["(1) True", "(2) Probable", "(3) False", "(4) Absurd"],
            "correct_option": "1",
            "explanation": "True. Education is universally recognized as a tool for progress."
        })
        
    # 5 Word Rearrange
    for i in range(6, 11):
        tpl = random.choice(WORD_REARRANGE)
        questions.append({
            "question_number": i,
            "category": "Sentence & Word Rearrangement",
            "question_text": tpl["q"],
            "options": [],
            "correct_option": tpl["a"],
            "explanation": tpl["e"]
        })

    # 10 Analogies
    for i in range(11, 21):
        tpl = random.choice(ANALOGIES)
        questions.append({
            "question_number": i,
            "category": "Verbal Analogies",
            "question_text": tpl["q"],
            "options": tpl["o"],
            "correct_option": tpl["a"],
            "explanation": tpl["e"]
        })

    # 5 Odd One Out
    for i in range(21, 26):
        tpl = random.choice(ODD_ONE_OUT)
        questions.append({
            "question_number": i,
            "category": "Odd One Out (Verbal)",
            "question_text": tpl["q"],
            "options": tpl["o"],
            "correct_option": tpl["a"],
            "explanation": tpl["e"]
        })

    # 15 Mixed (Math/Logic/Sequence)
    for i in range(26, 41):
        tpl = random.choice(MATH_LOGIC)
        questions.append({
            "question_number": i,
            "category": "Math, Counting & Logical Operations",
            "question_text": tpl["q"],
            "options": tpl["o"],
            "correct_option": tpl["a"],
            "explanation": tpl["e"]
        })

    return questions

def save_missing_sets(missing_sets):
    output_dir = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets"
    frontend_dir = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\frontend\src\data"
    
    for s_num in missing_sets:
        data = generate_set(s_num)
        filename = f"oir_set{s_num}_verbal.json"
        
        # Save to database datasets
        with open(os.path.join(output_dir, filename), 'w') as f:
            json.dump(data, f, indent=2)
            
        # Save to frontend data
        with open(os.path.join(frontend_dir, filename), 'w') as f:
            json.dump(data, f, indent=2)
            
    print(f"Successfully generated {len(missing_sets)} sets.")

if __name__ == "__main__":
    # From previous check:
    missing = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 77]
    save_missing_sets(missing)
