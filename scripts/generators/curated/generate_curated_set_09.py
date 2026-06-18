import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_09_data = {
  "set_id": "SET_09",
  "description": "High-Quality Curated SSB Dataset - Set 9 (Without CPSS)",
  
  "TAT": [
    {"pic_no": 1, "description": "A teacher handing a piece of paper to a student who looks extremely disappointed.", "image_url": "https://picsum.photos/seed/tat_set9_1/800/600"},
    {"pic_no": 2, "description": "A man standing in front of a completely ruined, collapsed house.", "image_url": "https://picsum.photos/seed/tat_set9_2/800/600"},
    {"pic_no": 3, "description": "A group of people working together to plant a large tree in a barren field.", "image_url": "https://picsum.photos/seed/tat_set9_3/800/600"},
    {"pic_no": 4, "description": "A doctor operating on a patient under bright surgical lights.", "image_url": "https://picsum.photos/seed/tat_set9_4/800/600"},
    {"pic_no": 5, "description": "Two young boys fighting aggressively over a bicycle.", "image_url": "https://picsum.photos/seed/tat_set9_5/800/600"},
    {"pic_no": 6, "description": "A woman standing alone at a bus stop late at night, looking at her watch.", "image_url": "https://picsum.photos/seed/tat_set9_6/800/600"},
    {"pic_no": 7, "description": "A group of soldiers carrying heavy backpacks up a steep, muddy hill.", "image_url": "https://picsum.photos/seed/tat_set9_7/800/600"},
    {"pic_no": 8, "description": "A person sitting at a desk with their head buried in their hands.", "image_url": "https://picsum.photos/seed/tat_set9_8/800/600"},
    {"pic_no": 9, "description": "An elderly man teaching a young girl how to play a musical instrument.", "image_url": "https://picsum.photos/seed/tat_set9_9/800/600"},
    {"pic_no": 10, "description": "A rescuer pulling a dog out of a fast-flowing river.", "image_url": "https://picsum.photos/seed/tat_set9_10/800/600"},
    {"pic_no": 11, "description": "A man addressing a large, seemingly angry crowd with a megaphone.", "image_url": "https://picsum.photos/seed/tat_set9_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Friend", "Enemy", "Fight", "Make", "Break", "Law", "Rule", "King", "Nation", "Flag",
    "Salute", "Respect", "Old", "Young", "Care", "Cure", "Harm", "Hurt", "Pain", "Endure",
    "Strong", "Weak", "Fast", "Slow", "Time", "Life", "Death", "Save", "Risk", "Safe",
    "Security", "Guard", "Protect", "Shield", "Sword", "Strike", "Stop", "Move", "Ahead", "Back",
    "Look", "Watch", "See", "Blind", "Eye", "Ear", "Hear", "Sound", "Noise", "Silent",
    "Quiet", "Peace", "War", "Battle", "Field", "Farm", "Crop", "Food", "Hunger", "Starve"
  ],

  "SRT": [
    "He notices a colleague constantly taking credit for the work of a junior employee. He...",
    "During a trekking trip, one of his friends is bitten by a snake and the nearest hospital is 20 km away. He...",
    "He finds a bag containing Rs. 2 Lakhs and a bank passbook on a train seat. He...",
    "He is waiting for an interview when he sees another candidate crying due to extreme nervousness. He...",
    "He is organizing a college fest, but the chief guest cancels just one hour before the event starts. He...",
    "His team is trailing by 2 goals in a football match, and only 10 minutes are left. He...",
    "He sees a senior student physically ragging a first-year student in the hostel. He...",
    "His parents are forcing him to take up a highly paid IT job, but he wants to join the Army. He...",
    "He is driving on a highway at night and sees a car overturned in a ditch. He...",
    "He discovers that his younger brother is smoking secretly. He...",
    "He is the captain of a team, but a star player refuses to follow his instructions. He...",
    "He is preparing for his final exams, and a loud religious procession stops outside his house. He...",
    "He accidentally damages a borrowed, expensive camera right before returning it. He...",
    "He is trapped in an elevator with a pregnant woman who suddenly goes into labor. He...",
    "His friend asks him to proxy for his attendance in a crucial lecture. He...",
    "He sees a person drowning in a fast-flowing river. He...",
    "He is traveling on a train and his luggage is stolen while he is asleep. He...",
    "He receives a blackmail email threatening to release morphed photos. He...",
    "He is given a critical task, but his teammates are completely uncooperative. He...",
    "He notices a fire breaking out in the building opposite his apartment. He...",
    "He is driving and accidentally hits a stray animal on the highway. He...",
    "He is falsely accused of cheating during an examination. He...",
    "He finds out that a senior officer is taking credit for his hard work. He...",
    "He is stuck in a massive traffic jam and has to reach a hospital with a critically ill patient. He...",
    "He is given a task that he feels is morally wrong but it is a direct order. He...",
    "He sees a woman being robbed of her purse on a busy street. He...",
    "He is trekking in the mountains and one of his team members gets a severe sprain. He...",
    "He is at a restaurant and a customer at the next table starts choking. He...",
    "He is in a foreign country, loses his passport, and doesn't speak the local language. He...",
    "His best friend confesses to committing a serious crime and asks him to hide him. He...",
    "He is running a marathon and is in the lead, but sees a fellow runner twist their ankle badly. He...",
    "He is in charge of a project and the budget is suddenly cut by 50%. He...",
    "He finds a bag full of explosives near a crowded marketplace. He...",
    "He is wrongly accused of theft by his classmates. He...",
    "He is at a railway station and sees a child slip between the platform and a moving train. He...",
    "His subordinates refuse to work overtime during a critical crisis. He...",
    "He is lost in an unfamiliar city late at night with a dead phone. He...",
    "He witnesses a hit-and-run accident but the driver is the son of a powerful local politician. He...",
    "He is preparing for the SSB, but breaks his leg two weeks before the date. He...",
    "He is a swimmer and sees two people drowning simultaneously in opposite directions. He...",
    "He overhears a conversation planning a terrorist attack. He...",
    "His roommate is highly depressed and talks about ending his life. He...",
    "He is leading a patrol in dense fog and loses radio contact with base. He...",
    "He is managing a cash counter and at the end of the day, finds Rs. 5000 missing. He...",
    "He sees a house on fire and hears a baby crying inside, but the flames are very high. He...",
    "He is on a flight and a passenger suddenly suffers a severe heart attack. He...",
    "He is caught in a stampede at a religious festival. He...",
    "He finds out his brother is taking bribes. He...",
    "He is sailing and a severe storm approaches. He...",
    "He is the captain of a ship and pirates try to board. He...",
    "He is given a completely unfamiliar task with no training. He...",
    "His friend asks to copy his assignment because he was sick. He...",
    "He accidentally breaks an expensive piece of equipment at work. He...",
    "He is stranded on a highway with a flat tire and no spare. He...",
    "He is conducting a meeting and two members start fighting physically. He...",
    "He sees a blind man trying to cross a very busy intersection. He...",
    "He is waiting for an interview and the candidate next to him faints. He...",
    "He is riding a bike and the brakes fail on a steep downhill slope. He...",
    "He is trapped inside a bank during an armed robbery. He...",
    "He finds a confidential military document lying on a public bench. He..."
  ],

  "PPDT": {
    "image_url": "https://picsum.photos/seed/ppdt_set9/800/600?blur=5",
    "description": "Hazy picture of a person climbing a tall ladder against a wall."
  },

  "PI": [
    "Tell me about a time you had to set a difficult goal for yourself. Did you achieve it?",
    "What are your views on the increasing rate of cybercrimes in India?",
    "Describe a time when you were a part of a team, but not the leader, and how you contributed.",
    "If you could have dinner with any historical figure, who would it be and why?",
    "What is your opinion on the privatization of public sector undertakings?",
    "How do you handle situations where you feel completely overwhelmed?",
    "What is the most significant failure you have faced, and what did you learn from it?",
    "Tell me about a time you had to persuade a group of people to agree with your idea.",
    "How do you stay motivated during long periods of tedious work?",
    "What are your views on India's role in the United Nations?",
    "Have you ever been involved in a physical altercation? How did it end?",
    "What are the three things you value most in a friendship?",
    "If you are assigned to a desk job for the rest of your career in the military, how would you react?",
    "What is your biggest fear and how do you face it?",
    "Tell me about a time you had to deliver bad news to someone.",
    "How do you define personal integrity?",
    "What role does sports play in your life?",
    "Tell me about a time you had to take a stand against a popular opinion.",
    "If you had the power to change one law in India, what would it be?",
    "Why do you want to join the Armed Forces instead of a high-paying corporate job?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to improve in yourself?"
  ],

  "Lecturette": [
    "Role of United Nations in the 21st Century",
    "Startups in India: Opportunities and Challenges",
    "Cyber Crime: A Growing Threat",
    "Tourism in India: Potential and Problems"
  ],

  "GD": [
    "Should school uniforms be banned to promote individuality?",
    "Impact of globalization on Indian culture: Positive or Negative?"
  ],

  "GPE": {
    "narrative": "You are a group of 8 college students visiting an industrial area for a study tour. It is 1400 hours. Suddenly, a siren blares and a factory worker runs up to you and says: 1. A highly toxic chemical leak has just occurred in the nearby factory (2 km away), and 5 workers are trapped inside unconscious. 2. The chemical cloud is drifting towards a nearby primary school (3 km downwind). 3. The main road out of the industrial area is blocked by an overturned truck. 4. Your college bus driver has fainted due to the fumes. You have your college bus (which you know how to drive), basic first aid kits, and some wet towels. The nearest fire station and hospital are 10 km away across the blocked road. How will you rescue the trapped workers, evacuate the school, and get help before the toxic cloud reaches the school in 45 minutes?",
    "map_url": "https://picsum.photos/seed/gpe_map_set9/800/600"
  },

  "GTO": {
    "PGT": "Progressive Group Task: 4 progressive obstacles emphasizing problem-solving under time pressure. Resources: 1 Plank, 2 Ballis (different lengths), 2 Ropes, 1 Pulley. Time: 40 mins.",
    "HGT": "Half Group Task: 1 complex obstacle involving a tricky cantilever over a 'water' hazard. Resources: 1 Plank, 1 Balli, 1 Rope. Time: 15 mins.",
    "IO": "Individual Obstacles: 10 obstacles (High Jump, Double Ditch, Zig-Zag Balance, Tarzan Swing, Commando Walk, Tiger Leap, Rope Climbing, Screen Jump, Burma Bridge, Monkey Crawl). Time: 3 mins.",
    "FGT": "Final Group Task: 1 long, complex obstacle requiring the entire group to transport a heavy 'toxic barrel' across a wide gap using limited ropes. Resources: Plank, Balli, 3 Ropes. Time: 15 mins."
  }
}

with open(os.path.join(OUTPUT_DIR, "set_09.json"), 'w', encoding='utf-8') as f:
    json.dump(set_09_data, f, indent=2)

print("Set 9 created successfully without CPSS.")
