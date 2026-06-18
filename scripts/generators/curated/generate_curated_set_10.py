import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_10_data = {
  "set_id": "SET_10",
  "description": "High-Quality Curated SSB Dataset - Set 10",
  "TAT": [
    {"pic_no": 1, "description": "A person standing in front of a mirror, but the reflection looks angry while the person is calm.", "image_url": "https://picsum.photos/seed/tat_set10_1/800/600"},
    {"pic_no": 2, "description": "Two people standing at the edge of a completely broken wooden bridge over a deep ravine.", "image_url": "https://picsum.photos/seed/tat_set10_2/800/600"},
    {"pic_no": 3, "description": "A family sitting around a dinner table, but everyone looks extremely tense and quiet.", "image_url": "https://picsum.photos/seed/tat_set10_3/800/600"},
    {"pic_no": 4, "description": "A man running desperately towards a train that is just leaving the platform.", "image_url": "https://picsum.photos/seed/tat_set10_4/800/600"},
    {"pic_no": 5, "description": "A young girl handing a thick book to an elderly man in a library.", "image_url": "https://picsum.photos/seed/tat_set10_5/800/600"},
    {"pic_no": 6, "description": "A soldier looking at a faded photograph while sitting in a trench.", "image_url": "https://picsum.photos/seed/tat_set10_6/800/600"},
    {"pic_no": 7, "description": "A group of workers protesting outside a locked factory gate.", "image_url": "https://picsum.photos/seed/tat_set10_7/800/600"},
    {"pic_no": 8, "description": "A woman aggressively pointing her finger at a man who is looking down.", "image_url": "https://picsum.photos/seed/tat_set10_8/800/600"},
    {"pic_no": 9, "description": "A person sitting alone on a park bench under a streetlamp in heavy rain.", "image_url": "https://picsum.photos/seed/tat_set10_9/800/600"},
    {"pic_no": 10, "description": "A doctor holding a stethoscope, looking worriedly at a patient's chart.", "image_url": "https://picsum.photos/seed/tat_set10_10/800/600"},
    {"pic_no": 11, "description": "A group of friends laughing and taking a selfie on a mountain peak.", "image_url": "https://picsum.photos/seed/tat_set10_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Mind", "Body", "Soul", "Spirit", "Ghost", "Fear", "Courage", "Brave", "Coward", "Run",
    "Hide", "Face", "Confront", "Meet", "Greet", "Smile", "Frown", "Angry", "Calm", "Storm",
    "Weather", "Rain", "Snow", "Ice", "Melt", "Freeze", "Fire", "Burn", "Ash", "Dust",
    "Earth", "Planet", "Star", "Sun", "Moon", "Light", "Dark", "Shadow", "Bright", "Dull",
    "Sharp", "Blunt", "Knife", "Sword", "Shield", "Defend", "Attack", "Protect", "Guard", "Safe",
    "Risk", "Hazard", "Danger", "Secure", "Lock", "Key", "Door", "Window", "Wall", "Break"
  ],

  "SRT": [
    "He is returning from a late-night movie and sees a car hit a pedestrian and speed away. He...",
    "During his final semester exams, his father suffers a severe heart attack and is hospitalized. He...",
    "He is the organizer of a debate competition, but the judges fail to arrive due to a flight cancellation. He...",
    "He notices that the shopkeeper has mistakenly given him change for Rs. 2000 instead of Rs. 500. He...",
    "He is participating in a group discussion, and everyone starts shouting, creating chaos. He...",
    "His best friend is heavily influenced by a bad crowd and starts taking drugs. He...",
    "He is given a critical task at work, but his laptop crashes and all data is lost. He...",
    "He is driving on a highway and realizes his car's brakes have failed. He...",
    "He sees a senior citizen struggling to carry heavy bags across a busy street. He...",
    "His younger brother wants to drop out of college to pursue an unconventional career. He...",
    "He is driving a friend to the hospital for an emergency and gets pulled over by a cop for speeding. He...",
    "He is in a crowded mall and hears a loud explosion from the food court. He...",
    "He finds out his teammate is taking performance-enhancing drugs before a major tournament. He...",
    "He is stranded at an airport due to a canceled flight with no money for a hotel. He...",
    "He is asked to give a speech on a topic he knows absolutely nothing about, in 5 minutes. He...",
    "He sees a neighbor beating their pet dog mercilessly. He...",
    "He is leading a group in the forest and realizes his compass is broken. He...",
    "He is falsely accused of ragging a junior student. He...",
    "His bike breaks down in a notoriously unsafe neighborhood late at night. He...",
    "He is given a critical task, but his immediate superior is completely incompetent. He...",
    "He sees a snake crawling into a child's school bag. He...",
    "He is in an elevator with a pregnant woman who goes into labor. He...",
    "He finds an unattended briefcase at a bus stop. He...",
    "He is trekking in the snow and begins to feel symptoms of hypothermia. He...",
    "He is at a restaurant and a customer at the next table starts choking on food. He...",
    "He sees a person trying to break into his neighbor's car. He...",
    "He is studying for a crucial exam, but his roommate insists on having friends over. He...",
    "He discovers a major accounting error in his company's records. He...",
    "He is in a foreign country and gets severely sick. He...",
    "He is appointed team captain, but the previous captain is actively sabotaging him. He...",
    "He sees a man harassing a female colleague at an office party. He...",
    "He is driving and a rock shatters his windshield on a highway. He...",
    "He is trapped inside a building during a severe earthquake. He...",
    "He receives a blackmail email threatening to release private photos. He...",
    "He is preparing for the SSB, but his family faces a sudden, massive financial crisis. He...",
    "He is hiking and his friend falls into a fast-flowing river. He...",
    "He is cooking and a small grease fire starts on the stove. He...",
    "He is on a ferry that engines fail and is drifting towards rocks. He...",
    "He sees a colleague taking credit for his idea in front of the boss. He...",
    "He is walking home and a gang of youths demands his expensive watch. He...",
    "He is at a busy intersection and sees an ambulance stuck in traffic. He...",
    "He is given a task that requires a large budget, but is given zero funds. He...",
    "He is in a movie theater and someone is constantly talking loudly on their phone. He...",
    "He finds out his brother is involved in a street gang. He...",
    "He is leading a patrol and one of his men refuses to obey a direct order. He...",
    "He sees a child wandering alone near a busy railway track. He...",
    "He is taking a shower and the geyser bursts, filling the room with steam. He...",
    "He is unfairly passed over for a promotion and his junior is promoted instead. He...",
    "He is in a crowded bus and a passenger faints. He...",
    "He is trekking and a thick fog rolls in, reducing visibility to zero. He...",
    "He is presenting a project and his laptop battery dies with no charger around. He...",
    "He is walking in the woods and gets hopelessly lost. He...",
    "He finds a wallet with Rs. 50,000 and an ID card belonging to a poor laborer. He...",
    "He is on a train and a group of rowdies starts harassing passengers. He...",
    "He is participating in a marathon and gets a severe muscle cramp 2 km before the finish line. He...",
    "He discovers that his newly bought expensive smartphone is a fake model. He...",
    "He is supposed to perform on stage, but his partner backs out at the last minute. He...",
    "While swimming in the sea, he feels a strong undercurrent pulling him away from the shore. He...",
    "His roommate throws a late-night party the day before his most important exam. He...",
    "He finds a stray, heavily injured puppy on the highway in the middle of heavy rain. He..."
  ],

  "PPDT": {
    "image_url": "https://picsum.photos/seed/ppdt_set10/800/600?blur=5",
    "description": "Hazy picture of a person running swiftly while carrying a heavy bag or sack on their back."
  },

  "PI": [
    "Tell me about a time you had to manage a sudden, unexpected crisis in your family.",
    "What are your views on the increasing commercialization of sports in India?",
    "Describe a time when you had to work with a team that had very low morale.",
    "If you could solve one major problem in the world, what would it be and how?",
    "What is your opinion on the impact of reality TV shows on the younger generation?",
    "How do you handle situations where you receive highly negative feedback on your work?",
    "What is the most difficult physical or mental obstacle you have overcome?",
    "Tell me about a time you had to negotiate a difficult deal or compromise.",
    "How do you ensure you are continuously learning and growing as a person?",
    "What are your views on India's space exploration missions like Chandrayaan and Gaganyaan?",
    "Have you ever felt completely isolated or alone? How did you deal with it?",
    "What are the three most important qualities of a successful leader?",
    "If you are leading a team and you realize you made a terrible mistake, how do you handle it?",
    "What is your biggest fear regarding your career?",
    "Tell me about a time you had to stand up to a figure of authority.",
    "How do you define happiness?",
    "What role does reading or literature play in your life?",
    "Tell me about a time you had to manage a project with a very tight deadline.",
    "If you had the power to change one thing about your personality, what would it be?",
    "Why is adaptability crucial for an officer in the Armed Forces?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to improve in yourself?"
  ],

  "Lecturette": [
    "Space Exploration: Benefits vs. Costs",
    "Poverty Eradication Strategies in India",
    "Right to Information (RTI) Act: Empowering Citizens",
    "Nuclear Energy: A Sustainable Alternative?"
  ],

  "GD": [
    "Should single-use plastics be completely banned globally?",
    "Is the youth of India moving away from its traditional culture?"
  ],

  "GPE": {
    "narrative": "You are a group of 6 tourists on a boating trip on a large lake. It is 1500 hours. A panicked local fisherman rows up to you and says: 1. A tourist houseboat 3 km away has been hijacked by armed smugglers. 2. A 10-year-old child from the village has gone missing near the dense marshlands (2 km away). 3. The only bridge connecting the lake resort to the main town is scheduled to be closed for repairs at 1630 hours. 4. A severe thunderstorm warning has been issued, and it will hit the lake at 1700 hours. You have a fast motorboat (seats 6), basic first aid, and mobile phones with poor network. The nearest police station is in the main town across the bridge (12 km away). How will you divide your group and prioritize these tasks to ensure everyone's safety before the storm hits?",
    "map_url": "https://picsum.photos/seed/gpe_map_set10/800/600"
  },

  "GTO": {
    "PGT": "Progressive Group Task: 4 progressive obstacles emphasizing teamwork and communication over long distances. Resources: 2 Planks (one short, one long), 1 Balli, 2 Ropes, 1 Pulley. Time: 40 mins.",
    "HGT": "Half Group Task: 1 complex obstacle involving a tricky cantilever over a 'water' hazard. Resources: 1 Plank, 1 Balli, 1 Rope. Time: 15 mins.",
    "IO": "Individual Obstacles: 10 obstacles (High Jump, Double Ditch, Zig-Zag Balance, Tarzan Swing, Commando Walk, Tiger Leap, Rope Climbing, Screen Jump, Burma Bridge, Monkey Crawl). Time: 3 mins.",
    "FGT": "Final Group Task: 1 long, complex obstacle requiring the entire group to transport a 'precious artifact' across a wide gap without dropping it. Resources: Plank, Balli, 3 Ropes. Time: 15 mins."
  },

  "CPSS": [
    "Spatial orientation: If the compass shows heading 315 (North-West) and you are instructed to turn 180 degrees, what is your new heading?",
    "Artificial Horizon: The horizon bar is pitched up 5 degrees and banked 15 degrees to the left. Describe the aircraft's current attitude.",
    "Altimeter Reading: Read the altimeter showing the 10,000-ft pointer between 0 and 1, the 1,000-ft pointer at 8, and the 100-ft pointer at 2. What is the current altitude?",
    "Instrument Landing System: The localizer needle is deflected to the left and the glide slope needle is centered. Where is the aircraft relative to the correct glide path?",
    "Visual Spatial Reasoning: An unfolded 2D pattern shaped like an L has faces marked A, B, C, D, E, F. If folded into a 3D cube, which face will be opposite to D?",
    "Cognitive Memory Challenge: Study the radar display featuring 5 active target tracks for 5 seconds. Identify the track number of the target that speeds up.",
    "Compass Heading: The aircraft is heading 180 degrees (South). You receive a command to make a standard rate turn to a heading of 360 degrees. How many degrees of turn are required?",
    "Multi-tasking Psychomotor Test: Maintain the flight simulator joystick within the target diamond while identifying odd numbers flashed on the Head-Up Display (HUD).",
    "Aircraft Recognition: Identify the silhouette of the MiG-29 fighter aircraft based on its twin vertical tails and large underwing engine nacelles.",
    "Reaction Time & Auditory Vigilance: Press the weapon launch trigger within 250 milliseconds only when the lock-on reticle turns yellow and a high-pitch tone is heard."
  ]
}

with open(os.path.join(OUTPUT_DIR, "set_10.json"), 'w', encoding='utf-8') as f:
    json.dump(set_10_data, f, indent=2)

print("Set 10 created successfully with CPSS.")
