import json
import os

output_dir = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets"

def save_json(set_id, data):
    path = os.path.join(output_dir, f"oir_set{set_id}_verbal.json")
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)

# Set 62
set62 = [
    {"id": 1, "category": "Statement Justification", "question_text": "The Earth revolves around the Sun because of the gravitational pull between the two celestial bodies.", "options": ["True", "Probable", "False", "Absurd"], "correct_option": "1", "explanation": "Gravitational pull is the scientific reason for orbital motion."},
    {"id": 2, "category": "Statement Justification", "question_text": "Drinking large amounts of sea water is the safest and most effective way to stay hydrated while lost in a desert.", "options": ["True", "Probable", "False", "Absurd"], "correct_option": "4", "explanation": "Sea water is saline and causes dehydration; it is absurd to use it for hydration."},
    {"id": 3, "category": "Statement Justification", "question_text": "We wear seatbelts while driving in cars because:-", "options": ["They keep our clothes from getting wrinkled", "They prevent our bodies from moving forward due to inertia during a sudden stop", "They are required to keep the engine running", "They help improve our posture"], "correct_option": "2", "explanation": "Seatbelts counteract inertia during sudden deceleration."},
    {"id": 4, "category": "Statement Justification", "question_text": "Modern airplanes have rounded windows instead of square ones because:-", "options": ["They look more aerodynamic", "Square windows create stress corners that can crack under high cabin pressure", "Rounded windows act as magnifying glasses", "It is cheaper to manufacture"], "correct_option": "2", "explanation": "Pressure distribution is more uniform in rounded openings."},
    {"id": 5, "category": "Word Rearrangement", "question_text": "Write the LAST letter of the rearranged sentence: away doctor the keeps day a apple an", "options": ["Y", "A", "E", "R"], "correct_option": "1", "explanation": "An apple a day keeps the doctor away. Last letter is Y."},
    {"id": 6, "category": "Word Rearrangement", "question_text": "Write the LAST letter of the rearranged sentence: never late better than", "options": ["E", "R", "N", "T"], "correct_option": "2", "explanation": "Better late than never. Last letter is R."},
    {"id": 7, "category": "Word Omission", "question_text": "Write the FIRST letter of the word to be OMITTED: The tall short basketball player easily dunked the ball.", "options": ["T", "S", "B", "P"], "correct_option": "2", "explanation": "Omit 'short'. First letter is S."},
    {"id": 8, "category": "Word Omission", "question_text": "Write the LAST letter of the word to be OMITTED: The loud silent explosion startled everyone in the building.", "options": ["D", "T", "S", "E"], "correct_option": "2", "explanation": "Omit 'silent'. Last letter is T."},
    {"id": 9, "category": "Word Rearrangement", "question_text": "Write the SECOND letter of the rearranged word: L C O C K is a device used to tell the time.", "options": ["C", "L", "O", "K"], "correct_option": "2", "explanation": "CLOCK. Second letter is L."},
    {"id": 10, "category": "Word Rearrangement", "question_text": "Write the SECOND letter of the rearranged word: R G A E D N is a piece of land used for growing flowers or vegetables.", "options": ["G", "A", "R", "D"], "correct_option": "2", "explanation": "GARDEN. Second letter is A."},
    {"id": 11, "category": "Analogies", "question_text": "Wet is to Dry as Light is to __________.", "options": ["Heavy", "Sun", "Dark", "Lamp", "Day"], "correct_option": "3", "explanation": "The relationship is antonyms."},
    {"id": 12, "category": "Analogies", "question_text": "Bee is to Hive as Horse is to __________.", "options": ["Field", "Stable", "Ride", "Animal", "Farm"], "correct_option": "2", "explanation": "The relationship is animal and its habitat/home."},
    {"id": 13, "category": "Analogies", "question_text": "Author is to Pen as Warrior is to __________.", "options": ["Battle", "Armor", "Sword", "Shield", "Fight"], "correct_option": "3", "explanation": "The relationship is profession and its primary tool."},
    {"id": 14, "category": "Analogies", "question_text": "Whisper is to Shout as Walk is to __________.", "options": ["Stroll", "Stand", "Run", "Legs", "Shoes"], "correct_option": "3", "explanation": "The relationship is intensity (low to high)."},
    {"id": 15, "category": "Analogies", "question_text": "Ocean is to Water as Desert is to __________.", "options": ["Camel", "Sand", "Heat", "Oasis", "Dry"], "correct_option": "2", "explanation": "The relationship is environment and its primary substance."},
    {"id": 16, "category": "Analogies", "question_text": "Clock is to Time as Thermometer is to __________.", "options": ["Heat", "Fever", "Temperature", "Doctor", "Glass"], "correct_option": "3", "explanation": "The relationship is device and what it measures."},
    {"id": 17, "category": "Logical Order", "question_text": "Which item will stand middle if the following are rearranged in a logical sequence of a hiring process?", "options": ["Selection", "Application", "Appointment", "Interview", "Advertisement"], "correct_option": "4", "explanation": "Ad -> App -> Interview -> Selection -> Appointment. Middle is Interview."},
    {"id": 18, "category": "Logical Order", "question_text": "Which item will stand middle if the following are rearranged in order of physical size (smallest to largest)?", "options": ["Mansion", "Hut", "House", "Castle", "Cabin"], "correct_option": "3", "explanation": "Hut -> Cabin -> House -> Mansion -> Castle. Middle is House."},
    {"id": 19, "category": "Odd One Out", "question_text": "Which word does not belong to the same class as the others?", "options": ["Triangle", "Square", "Pentagon", "Circle", "Hexagon"], "correct_option": "4", "explanation": "Circle has no straight lines or vertices."},
    {"id": 20, "category": "Odd One Out", "question_text": "Which word does not belong to the same class as the others?", "options": ["Iron", "Aluminum", "Copper", "Brass", "Zinc"], "correct_option": "4", "explanation": "Brass is an alloy; the others are pure elements."},
    {"id": 21, "category": "Odd One Out", "question_text": "Which word does not belong to the same class as the others?", "options": ["Cabbage", "Spinach", "Carrot", "Lettuce", "Mint"], "correct_option": "3", "explanation": "Carrot is a root vegetable; the others are leafy greens."},
    {"id": 22, "category": "Odd One Out", "question_text": "Which word does not belong to the same class as the others?", "options": ["Walk", "Run", "Jump", "Sleep", "Sprint"], "correct_option": "4", "explanation": "Sleep is a state of rest; the others are physical movements."},
    {"id": 23, "category": "Odd One Out", "question_text": "Which word does not belong to the same class as the others?", "options": ["Oxygen", "Nitrogen", "Hydrogen", "Water", "Helium"], "correct_option": "4", "explanation": "Water is a compound (H2O); the others are pure elemental gases."},
    {"id": 24, "category": "Dictionary Order", "question_text": "Which word will come LAST in the dictionary?", "options": ["Brain", "Brand", "Brass", "Brave"], "correct_option": "4", "explanation": "Brave follows Brass alphabetically."},
    {"id": 25, "category": "Dictionary Order", "question_text": "Which word will come LAST in the dictionary?", "options": ["Chalk", "Chair", "Chain", "Charm"], "correct_option": "4", "explanation": "Charm follows Chalk alphabetically."},
    {"id": 26, "category": "Dictionary Order", "question_text": "Which word will come LAST in the dictionary?", "options": ["Train", "Track", "Trade", "Trail"], "correct_option": "1", "explanation": "Train follows Trail alphabetically."},
    {"id": 27, "category": "Dictionary Order", "question_text": "Which word will come LAST in the dictionary?", "options": ["Paint", "Paper", "Patch", "Pause"], "correct_option": "4", "explanation": "Pause follows Patch alphabetically."},
    {"id": 28, "category": "Dictionary Order", "question_text": "Which word will come LAST in the dictionary?", "options": ["Sweet", "Swell", "Sweat", "Sweep"], "correct_option": "2", "explanation": "Swell follows Sweet alphabetically."},
    {"id": 34, "category": "Counting", "question_text": "How many 5’s come immediately after 2 in the following sequence? 2 5 3 2 5 8 5 2 4 2 5 9 5 2 5", "options": ["2", "3", "4", "5"], "correct_option": "3", "explanation": "Sequence '2 5' occurs 4 times."},
    {"id": 35, "category": "Math", "question_text": "If 8 apples cost 48 rupees, what is the cost of 12 apples?", "options": ["64", "68", "72", "76"], "correct_option": "3", "explanation": "1 apple = 6. 12 * 6 = 72."},
    {"id": 38, "category": "Coding", "question_text": "If DOG is coded as 26, and CAT is coded as 24, how is BIRD coded?", "options": ["32", "33", "34", "35"], "correct_option": "2", "explanation": "B=2, I=9, R=18, D=4. Sum = 33."}
]

# Set 64
set64 = [
    {"id": 1, "category": "Statement Justification", "question_text": "Photosynthesis is the process by which green plants convert light energy into chemical energy.", "options": ["True", "Probable", "False", "Absurd"], "correct_option": "1", "explanation": "This is a basic biological fact."},
    {"id": 2, "category": "Statement Justification", "question_text": "Eating a dictionary will immediately and permanently improve your spoken vocabulary.", "options": ["True", "Probable", "False", "Absurd"], "correct_option": "4", "explanation": "Digesting paper does not transfer information to the brain."},
    {"id": 3, "category": "Statement Justification", "question_text": "We use refrigerators to store food because:-", "options": ["They eliminate calories", "Cold temperature slows bacterial growth", "Internal light cooks food", "Makes food sweeter"], "correct_option": "2", "explanation": "Low temperature preserves food by inhibiting microbial activity."},
    {"id": 5, "category": "Word Rearrangement", "question_text": "Write the LAST letter of the rearranged sentence: gold glitters is all not that", "options": ["D", "G", "L", "T"], "correct_option": "1", "explanation": "All that glitters is not gold. Last letter is D."},
    {"id": 9, "category": "Word Rearrangement", "question_text": "Write the SECOND letter of the rearranged word: C H L O O S is an institution for educating children.", "options": ["C", "H", "L", "O"], "correct_option": "1", "explanation": "SCHOOL. Second letter is C."},
    {"id": 11, "category": "Analogies", "question_text": "Fire is to Hot as Ice is to __________.", "options": ["Freeze", "Melt", "Cold", "Water", "Winter"], "correct_option": "3", "explanation": "Antonym relationship for intensity."},
    {"id": 19, "category": "Odd One Out", "question_text": "Which word does not belong to the same class as the others?", "options": ["Apple", "Banana", "Potato", "Grape", "Orange"], "correct_option": "3", "explanation": "Potato is a vegetable; the others are fruits."},
    {"id": 35, "category": "Math", "question_text": "If 4 books cost 120 rupees, what is the cost of 7 books?", "options": ["180", "210", "240", "280"], "correct_option": "2", "explanation": "1 book = 30. 7 * 30 = 210."}
]

# Set 66
set66 = [
    {"id": 1, "category": "Statement Justification", "question_text": "Under standard atmospheric pressure, pure liquid water freezes and becomes solid ice at 0 degrees Celsius.", "options": ["True", "Probable", "False", "Absurd"], "correct_option": "1", "explanation": "Standard freezing point of water."},
    {"id": 3, "category": "Statement Justification", "question_text": "We boil raw milk before consuming it because:-", "options": ["Changes color", "Kills harmful bacteria", "Extracts water", "Makes it colder"], "correct_option": "2", "explanation": "Pasteurization/boiling makes milk safe by killing pathogens."},
    {"id": 5, "category": "Word Rearrangement", "question_text": "Write the LAST letter of the rearranged sentence: worm bird the early the catches", "options": ["M", "D", "E", "R"], "correct_option": "1", "explanation": "The early bird catches the worm. Last letter is M."},
    {"id": 12, "category": "Analogies", "question_text": "Sheep is to Flock as Fish is to __________.", "options": ["Ocean", "Swim", "School", "Water", "Herd"], "correct_option": "3", "explanation": "Group noun for fish is school."},
    {"id": 19, "category": "Odd One Out", "question_text": "Which word does not belong to the same class as the others?", "options": ["Physics", "Chemistry", "Biology", "Mathematics", "History"], "correct_option": "5", "explanation": "History is humanities; others are sciences."},
    {"id": 35, "category": "Math", "question_text": "If 5 pens cost 40 rupees, what is the cost of 8 pens?", "options": ["56", "64", "72", "80"], "correct_option": "2", "explanation": "1 pen = 8. 8 * 8 = 64."}
]

save_json("62", set62)
save_json("64", set64)
save_json("66", set66)
print("Saved Sets 62, 64, 66 to JSON.")
