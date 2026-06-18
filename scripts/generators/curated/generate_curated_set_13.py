import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_13_data = {
  "set_id": "SET_13",
  "description": "High-Quality Curated SSB Dataset - Set 13",
  "TAT": [
    {"pic_no": 1, "description": "A young student speaking passionately at a national level debate, with a large audience listening.", "image_url": "https://picsum.photos/seed/tat_set13_1/800/600"},
    {"pic_no": 2, "description": "An engineer examining a prototype drone in a high-tech workshop.", "image_url": "https://picsum.photos/seed/tat_set13_2/800/600"},
    {"pic_no": 3, "description": "A group of villagers carrying sacks of grain across a newly constructed suspension bridge.", "image_url": "https://picsum.photos/seed/tat_set13_3/800/600"},
    {"pic_no": 4, "description": "A mountaineer helping their teammate climb over a tricky ice wall.", "image_url": "https://picsum.photos/seed/tat_set13_4/800/600"},
    {"pic_no": 5, "description": "A doctor writing a prescription while comforting an elderly patient.", "image_url": "https://picsum.photos/seed/tat_set13_5/800/600"},
    {"pic_no": 6, "description": "A teacher writing on a blackboard in an open-air school in a rural area.", "image_url": "https://picsum.photos/seed/tat_set13_6/800/600"},
    {"pic_no": 7, "description": "A soldier standing alert on a patrol post in a dense jungle.", "image_url": "https://picsum.photos/seed/tat_set13_7/800/600"},
    {"pic_no": 8, "description": "A young girl planting a tree sapling in a barren field.", "image_url": "https://picsum.photos/seed/tat_set13_8/800/600"},
    {"pic_no": 9, "description": "Two business associates shaking hands in a modern conference room.", "image_url": "https://picsum.photos/seed/tat_set13_9/800/600"},
    {"pic_no": 10, "description": "An artist painting a massive mural on a city wall, with onlookers admiring.", "image_url": "https://picsum.photos/seed/tat_set13_10/800/600"},
    {"pic_no": 11, "description": "A rescue worker carrying a child away from a waterlogged street.", "image_url": "https://picsum.photos/seed/tat_set13_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Work", "Play", "Win", "Lose", "Rule", "Lead", "Follow", "Break", "Make", "Build", 
    "Destroy", "Create", "Innovate", "Change", "Grow", "Learn", "Teach", "Help", "Share", "Care", 
    "Love", "Hate", "Fear", "Brave", "Coward", "Hero", "Villain", "Truth", "Lie", "Honest", 
    "Deceive", "Loyal", "Traitor", "Trust", "Doubt", "Faith", "Hope", "Despair", "Joy", "Sorrow", 
    "Happy", "Sad", "Angry", "Calm", "Peace", "War", "Fight", "Peaceful", "Hostile", "Friend", 
    "Enemy", "Ally", "Rival", "Partner", "Solo", "Team", "Group", "Crowd", "Alone", "Together"
  ],

  "SRT": [
    "He is leading a trekking expedition and one of the members complains of chest pain. He...",
    "His parent has a strong bias against his chosen career path and refuses to pay his fees. He...",
    "He discovers that his classmate is sharing confidential team project files with a rival team. He...",
    "While returning home late at night, he sees a street light sparking and catching fire near a thatched roof house. He...",
    "He is the captain of his college football team, and his star player gets injured right before the final match. He...",
    "He finds a wallet containing money and an ID card on the seat of a local bus. He...",
    "He is preparing for his exams, but the power goes out completely in his area for three days. He...",
    "His neighbor's dog gets trapped in a deep, dry well in the backyard. He...",
    "He is on a train and realizes his co-passenger has left their bag behind after deboarding. He...",
    "He is accused of cheating by a teacher during an exam, though he was innocent. He...",
    "He is organizing a charity drive, but the volunteers back out at the last moment due to a conflict. He...",
    "He is stuck in a massive traffic jam and his job interview starts in 15 minutes. He...",
    "He sees a shopkeeper selling expired baby food to a poor customer. He...",
    "He gets lost in a dense forest area during an adventure camp with no mobile network. He...",
    "He is selected for a prestigious course, but he lacks the finances to enroll. He...",
    "He notices a crack in the railway track while walking near the local station. He...",
    "His boss asks him to fabricate the quarterly sales figures to show high growth. He...",
    "He goes to a government office and the clerk demands a speed money to process his certificate. He...",
    "He is staying in a hostel and his roommate falls severely ill at midnight. He...",
    "He is participating in a group discussion, and another participant makes a highly offensive personal remark against him. He...",
    "He is on a hike and a heavy landslide blocks the only exit path. He...",
    "He finds out that his close friend is abusing prescription drugs. He...",
    "He is traveling by road and witnesses a hit-and-run accident where a pedestrian is injured. He...",
    "He is assigned a task with a team member who is extremely lazy and uncooperative. He...",
    "His younger brother is demotivated and wants to drop out of school. He...",
    "He is visiting a historical monument and sees someone defacing the walls. He...",
    "He is cooking and a gas leak is detected in the kitchen. He...",
    "He is accused of copying a colleague's project design, which he had made independently. He...",
    "He is heading a committee and the members have completely divergent opinions, leading to a deadlock. He...",
    "While crossing a river by boat, the engine stops working and the boat starts drifting towards a waterfall. He...",
    "He realizes he has left his wallet and phone at home after eating a meal at a restaurant. He...",
    "He finds that his signature has been forged on a bank document. He...",
    "He is in a library and sees a group of students talking loudly, disturbing others. He...",
    "He is on a vacation and a sudden curfew is imposed in the city. He...",
    "His friend asks for his motorcycle, but he knows the friend does not have a license. He...",
    "He is tasked with managing a high-profile event, but the budget is slashed by 50% at the last minute. He...",
    "He sees a child crying on the road, looking for their mother. He...",
    "He is in a meeting and realizes he has brought the wrong presentation slides. He...",
    "He finds a snake inside his bathroom in the morning. He...",
    "His team is losing a debate competition, and it is his turn to speak next. He...",
    "He is on a trek and the guide abandons the group after taking the money. He...",
    "He is working on a group assignment and the laptop crashes, wiping out all the data before submission. He...",
    "He sees a classmate stealing a book from the library. He...",
    "He is riding a bicycle and the brakes fail on a steep downhill slope. He...",
    "He finds a fire breaking out in the electric meter room of his apartment building. He...",
    "His team member takes credit for all the hard work he did on a project. He...",
    "He is traveling in a desert area and the water bottle leaks, leaving him with no water. He...",
    "He sees a passenger trying to board a moving train and slipping. He...",
    "He is asked to lead a project in a language he is not fully fluent in. He...",
    "He is at home and hears a loud noise of glass breaking from the neighbor's locked house. He...",
    "He finds a severe error in the bill of a restaurant that charged him much less than actual. He...",
    "His friends force him to consume alcohol, but he is a teetotaler. He...",
    "He is running a marathon and a child suddenly runs onto the track in front of him. He...",
    "He is stuck in a lift during a power cut with an elderly person who starts feeling breathless. He...",
    "He is in a forest and realizes he is being followed by a wild animal. He...",
    "He is selected for an interview, but the call letter arrives on the day of the interview. He...",
    "He finds out his friend is planning to run away from home. He...",
    "He is riding a pillion on a motorcycle and the rider starts speeding recklessly. He...",
    "He finds a stray dog shivering in the cold rain outside his gate. He...",
    "He is attending a seminar and the speaker makes an inaccurate technical statement. He..."
  ],

  "PPDT": {
    "image_url": "https://picsum.photos/seed/ppdt_set13/800/600?blur=5",
    "description": "Hazy picture of three people discussing something around a large table with papers scattered."
  },

  "PI": [
    "What is your strategy to handle feedback from peers that you disagree with?",
    "If you are given a task that you have never done before, how do you approach it?",
    "How do you contribute to your family's daily household chores and responsibilities?",
    "Tell me about a time you had to make a sacrifice for a friend or family member.",
    "What are the major defence acquisitions India has made in the last three years?",
    "How do you keep yourself physically fit and mentally alert?",
    "Tell me about a project or initiative you started on your own in college or school.",
    "If you could change one decision you made in the last five years, what would it be?",
    "How do you manage your monthly pocket money or expenses?",
    "What is your view on the privatization of key sectors like defence manufacturing?",
    "Tell me about a time you had to deal with a highly emotional situation at home.",
    "Why do you want to join the Armed Forces instead of a corporate job?",
    "What is the difference between a boss and a leader, in your opinion?",
    "How do you deal with a team member who is not performing up to the mark?",
    "What role does social service or volunteering play in your life?",
    "Tell me about a time you had to organize a major family function or gathering.",
    "What are your views on India's bilateral relations with neighboring countries?",
    "If you are not selected this time, what is your alternate plan?",
    "How do you handle stress during exam preparation or high-pressure situations?",
    "What is the most adventurous thing you have ever done in your life?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends or colleagues think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to develop in yourself?"
  ],

  "Lecturette": [
    "Self-Reliance in Defence Manufacturing (Aatmanirbharta)",
    "The Role of Social Media in Modern Warfare",
    "Renewable Energy: India's Achievements and Targets",
    "Global Warming and its Impact on Glaciers"
  ],

  "GD": [
    "Is cryptocurrency a viable future currency or a speculative bubble?",
    "Should education be completely digitized, or is the traditional classroom irreplaceable?"
  ],

  "GPE": {
    "narrative": "You are a group of 6 college students on a trekking trip near a mountainous village. It is 1300 hours. A local farmer approaches you with the following information: 1. A forest fire is spreading fast from the West and will reach the village (3 km away) in exactly 3 hours. 2. A child has been injured by a fall near the rocky cliffs 5 km North-East and needs urgent medical aid. 3. A group of wild elephants has entered the nearby farms (2 km East), and the village elder needs help calling the forest department. You have a rugged pickup truck (seats 5), ropes, a first aid box, and one functional mobile phone with weak signal. The nearest forest ranger post is 10 km away. How will you divide your group and prioritize these tasks to ensure the safety of the child, protect the village, and notify the forest department before the fire reaches at 1600 hours?",
    "map_url": "https://picsum.photos/seed/gpe_map_set13/800/600"
  },

  "GTO": {
    "PGT": "Progressive Group Task: 4 progressive obstacles emphasizing balance and leverage. Resources: 1 long Plank, 1 short Balli, 2 Ropes. Time: 40 mins.",
    "HGT": "Half Group Task: 1 complex obstacle involving a tricky cantilever bridge. Resources: 1 Plank, 1 Balli, 1 Rope. Time: 15 mins.",
    "IO": "Individual Obstacles: 10 standard GTO obstacles. Time: 3 mins.",
    "FGT": "Final Group Task: A coordinated effort to carry a heavy load across a final barrier using all resources. Resources: 1 Plank, 1 Balli, 2 Ropes. Time: 15 mins."
  },

  "CPSS": [
    "Spatial orientation: If the slip indicator ball is deflected to the left during a left turn, how should you correct the rudder?",
    "Artificial Horizon: The horizon bar is pitched down 20 degrees and banked 30 degrees to the left. Describe the aircraft's current attitude.",
    "Altimeter Reading: Read the altimeter showing the 10,000-ft pointer at 3, the 1,000-ft pointer at 1, and the 100-ft pointer at 9. What is the current altitude?",
    "Instrument Landing System: The localizer needle is deflected to the left and the glide slope needle is deflected downwards. Where is the aircraft relative to the correct glide path?",
    "Visual Spatial Reasoning: An unfolded 2D pattern shaped like a cross has faces marked 1 to 6. If folded into a 3D cube, which face will be opposite to 4?",
    "Cognitive Memory Challenge: Study the radar display featuring 6 aircraft tracks for 5 seconds. Identify which track number has changed its altitude.",
    "Compass Heading: The aircraft is heading 045 degrees (North-East). You receive a command to make a standard rate turn to a heading of 225 degrees. How many degrees of turn are required?",
    "Multi-tasking Psychomotor Test: Maintain the flight simulator joystick within the target green circle while solving basic arithmetic problems shown on the Head-Up Display (HUD).",
    "Aircraft Recognition: Identify the silhouette of the MiG-21 fighter aircraft based on its delta wing and nose intake design.",
    "Reaction Time & Auditory Vigilance: Press the fire button within 250 milliseconds only when the radar target locks (turns green) and a high-pitch beep is heard."
  ]
}

with open(os.path.join(OUTPUT_DIR, "set_13.json"), 'w', encoding='utf-8') as f:
    json.dump(set_13_data, f, indent=2)

print("Set 13 created successfully with CPSS.")
