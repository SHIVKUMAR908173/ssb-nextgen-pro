import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_01_data = {
  "set_id": "SET_01",
  "description": "High-Quality Curated SSB Dataset - Set 1",
  
  "TAT": [
    {"pic_no": 1, "description": "A young boy sitting at a desk with a book open, looking out the window.", "image_url": "https://picsum.photos/seed/tat_set1_1/800/600"},
    {"pic_no": 2, "description": "A farmer standing in a drought-affected field looking at the sky.", "image_url": "https://picsum.photos/seed/tat_set1_2/800/600"},
    {"pic_no": 3, "description": "Two people in uniform discussing over a map on a table.", "image_url": "https://picsum.photos/seed/tat_set1_3/800/600"},
    {"pic_no": 4, "description": "A person climbing a steep cliff with a rope.", "image_url": "https://picsum.photos/seed/tat_set1_4/800/600"},
    {"pic_no": 5, "description": "A group of villagers gathered around a well.", "image_url": "https://picsum.photos/seed/tat_set1_5/800/600"},
    {"pic_no": 6, "description": "A young woman standing near a hospital bed holding someone's hand.", "image_url": "https://picsum.photos/seed/tat_set1_6/800/600"},
    {"pic_no": 7, "description": "A person running in a forest looking behind.", "image_url": "https://picsum.photos/seed/tat_set1_7/800/600"},
    {"pic_no": 8, "description": "An elderly person sitting alone on a park bench.", "image_url": "https://picsum.photos/seed/tat_set1_8/800/600"},
    {"pic_no": 9, "description": "A rescue team lifting debris from a collapsed building.", "image_url": "https://picsum.photos/seed/tat_set1_9/800/600"},
    {"pic_no": 10, "description": "A group of students protesting with banners.", "image_url": "https://picsum.photos/seed/tat_set1_10/800/600"},
    {"pic_no": 11, "description": "A man addressing a small crowd in a rural setting.", "image_url": "https://picsum.photos/seed/tat_set1_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Attack", "Country", "Duty", "Fear", "Failure", "Blood", "Dark", "Ghost", "Enemy", "Friend",
    "Mother", "Sister", "Step", "Problem", "Life", "Death", "Leader", "Courage", "Weapon", "Defeat",
    "Success", "Win", "Lose", "Team", "Command", "Impossible", "Think", "Quick", "Help", "Save",
    "Danger", "Climb", "Fall", "Run", "Fire", "Water", "War", "Peace", "Love", "Hate",
    "Anger", "Work", "Play", "Book", "Time", "Sleep", "Rest", "Dream", "Night", "Day",
    "Mountain", "River", "Ocean", "Sky", "Earth", "Sun", "Moon", "Star", "Alone", "Snake"
  ],

  "SRT": [
    "He was returning home late at night and saw three men harassing a girl. He...",
    "During a patrol, his team is ambushed and the radio operator is shot. He...",
    "His final exams are starting tomorrow, but his best friend meets with an accident. He...",
    "He is the captain of the football team, but his star player refuses to practice before the final. He...",
    "While traveling in a train, he notices a suspicious unattended bag under his seat. He...",
    "He has to reach an SSB interview in 2 hours, but his train gets delayed indefinitely. He...",
    "His commanding officer gives a tactical order that he strongly believes will result in casualties. He...",
    "He is given a task to complete in 2 hours, but his subordinates are completely uncooperative. He...",
    "He finds a wallet on the street with Rs. 10,000 and important ID cards. He...",
    "While trekking in the mountains, his group loses their way and it starts raining heavily. He...",
    "His parents are forcing him to marry, but he wants to focus on his career first. He...",
    "A fire breaks out in his neighbor's house at midnight. He...",
    "He is participating in a cross-country race and sees a competitor collapse ahead of him. He...",
    "He is made the leader of a group, but some senior members refuse to take his orders. He...",
    "He overhears someone planning a robbery at a local bank. He...",
    "His younger brother is caught stealing money from home. He...",
    "He is waiting for a bus in a deserted area and a car stops, offering a lift. He...",
    "He discovers that his close friend is taking drugs. He...",
    "During a group task, his idea is rejected by the entire group, but he knows it is the only correct one. He...",
    "He is driving and accidentally hits a pedestrian. The crowd gathers aggressively. He...",
    "He is alone at home and a stranger forcefully tries to enter. He...",
    "He fails the NDA entrance exam for the third time. He...",
    "His sister's wedding is in a week, and the caterer suddenly cancels. He...",
    "He is swimming in a river and suddenly gets caught in a strong whirlpool. He...",
    "He sees a snake entering his neighbor's house while the neighbor is asleep. He...",
    "He has an important meeting, but his car breaks down midway in an area with no network. He...",
    "He is managing a college fest, and the chief guest cancels 15 minutes before the event. He...",
    "During a night march, he drops the only compass the group has in a deep gorge. He...",
    "He is falsely accused of cheating in an examination by the invigilator. He...",
    "His father's business goes bankrupt, and the family is under severe financial stress. He...",
    "He sees a mob destroying public property near his college. He...",
    "He is on a boat in a lake, and the boat starts leaking. He...",
    "He is locked inside a room by mistake and the building catches fire. He...",
    "He finds out his teammate is leaking confidential strategy to the opposing team. He...",
    "His bike tyre punctures on a lonely highway at 2 AM. He...",
    "He needs blood for an urgent surgery for his mother, but his blood group is very rare. He...",
    "He is lost in a jungle during a camping trip and has no food or water left. He...",
    "He notices his boss taking bribes from a vendor. He...",
    "A dog attacks a small child playing in the park. He...",
    "He is delivering an important speech on stage and completely forgets his lines. He...",
    "He is given a difficult task with a tight deadline, but half his team calls in sick. He...",
    "He has to choose between an excellent high-paying civilian job and joining the Army. He...",
    "He is appointed head boy, but his best friend expects special favors. He...",
    "During a movie, someone starts smoking in the non-smoking theater. He...",
    "He sees a person drowning in a fast-flowing river. He...",
    "He is returning from a party, and the driver is highly intoxicated. He...",
    "He gets a call from an unknown number threatening his family. He...",
    "He is preparing for an exam and the neighbors play extremely loud music late at night. He...",
    "He realizes he left his admit card at home right at the examination hall gate. He...",
    "He finds a loaded gun abandoned in a public park. He...",
    "He is criticized unfairly by his teacher in front of the whole class. He...",
    "He receives incorrect change from a shopkeeper, giving him Rs. 500 extra. He...",
    "His parachute gets entangled in a tree during a jump. He...",
    "He is trekking and his friend twists his ankle, unable to walk, 10 km from the base camp. He...",
    "He is cooking and the gas cylinder catches fire. He...",
    "He is in an elevator that suddenly stops between floors and the lights go out. He...",
    "He is traveling in an airplane and it suddenly encounters severe turbulence and oxygen masks drop. He...",
    "He is leading a mission and his second-in-command starts panicking. He...",
    "He sees an old man fall from a moving bus. He...",
    "He discovers a major flaw in his own project just hours before submission. He..."
  ],

  "PPDT": {
    "image_url": "https://picsum.photos/seed/ppdt_set1/800/600?blur=5",
    "description": "Hazy picture of 2 figures standing near what looks like a broken bridge or structure."
  },

  "PI": [
    "Tell me about your educational background starting from 10th standard.",
    "Why do you want to join the Armed Forces?",
    "What are your strengths and weaknesses?",
    "How do you spend your spare time?",
    "Tell me about your best friend. What do you like and dislike about them?",
    "How do you resolve conflicts in a team?",
    "What is your opinion on the recent geopolitical developments in the Indo-Pacific region?",
    "Who is your role model and why?",
    "Describe a time when you failed and how you handled it.",
    "What are your future career plans if you don't make it to the defense forces?",
    "How do you manage stress during exams or difficult situations?",
    "Tell me about your relationship with your parents and siblings.",
    "What steps have you taken to overcome your weaknesses?",
    "Have you ever broken a rule? Why?",
    "What do you know about the history of the Indian Army/Navy/Air Force?",
    "Describe a situation where you had to take a quick decision.",
    "How do you keep yourself physically and mentally fit?",
    "What did you learn from your previous SSB attempts (if any)?",
    "If I give you 1 lakh rupees right now, what will you do with it?",
    "Why should we select you?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to improve in yourself?"
  ],

  "Lecturette": [
    "Cyber Security in India",
    "The role of sports in character building",
    "India's Space Program (ISRO)",
    "Global Warming and Climate Change"
  ],

  "GD": [
    "Is Artificial Intelligence a threat to human jobs or an opportunity?",
    "Should women be allowed in combat roles in the Armed Forces?"
  ],

  "GPE": {
    "narrative": "You are a group of 8 college students returning from a trek in a forest. You reach a highway crossing at 1600 hours. You have to catch a train from the nearest railway station 15 km away at 1800 hours. Suddenly, a local villager runs to you and informs you that: 1. A man has been bitten by a poisonous snake in a nearby field (2 km away). 2. A gang of dacoits is planning to rob the local bank in the nearby village at 1700 hours. 3. A bridge on the railway track ahead has been damaged by heavy rains, and the express train is due to cross it at 1730 hours. You have two bicycles, a first aid kit, and your trekking gear. A hospital is located 5 km away, and a police station is 10 km away. How will you solve these problems?",
    "map_url": "https://picsum.photos/seed/gpe_map_set1/800/600"
  },

  "GTO": {
    "PGT": "Progressive Group Task: 4 progressive obstacles of increasing difficulty. Available resources: 1 Wooden Plank, 1 Balli (Wooden pole), 1 Rope. Standard color rules apply (White, Red, Blue/Yellow). Time: 45 mins.",
    "HGT": "Half Group Task: The group is divided into two. Each subgroup faces 1 obstacle similar to PGT but requires more cooperation. Time: 15 mins.",
    "IO": "Individual Obstacles: 10 obstacles including High Jump, Barrel Jump, Tarzan Swing, Monkey Crawl, Double Ditch, Tiger Leap, Commando Walk, Rope Climbing, etc. Time: 3 mins.",
    "FGT": "Final Group Task: 1 long obstacle for the entire group. Resources: Plank, Balli, Rope. Time: 15 mins."
  },

  "CPSS": [
    "Identify the correct heading based on the compass dial showing South-East.",
    "If the artificial horizon shows blue on the left and brown on the right, what is the aircraft's attitude?",
    "Reaction Time Test: Press the corresponding colored button when the light flashes on the screen.",
    "Spatial orientation: Which of the following 3D figures matches the unfolded 2D pattern?",
    "Read the altimeter showing 10,500 feet and select the correct corresponding dial.",
    "Determine the shortest path between two points on the radar screen avoiding restricted zones.",
    "Memory Test: Memorize the sequence of 5 flashing lights and reproduce them.",
    "Coordinate mapping: Enter the X, Y coordinates of the moving target.",
    "Auditory task: Listen to the radio transmission and identify the specific call sign.",
    "Simultaneous capacity: Maintain the joystick crosshair on a moving target while answering simple math questions."
  ]
}

with open(os.path.join(OUTPUT_DIR, "set_01.json"), 'w', encoding='utf-8') as f:
    json.dump(set_01_data, f, indent=2)

print("Set 1 created successfully.")
