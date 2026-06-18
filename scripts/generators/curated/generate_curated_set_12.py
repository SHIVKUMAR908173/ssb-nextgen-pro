import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_12_data = {
  "set_id": "SET_12",
  "description": "High-Quality Curated SSB Dataset - Set 12",
  "TAT": [
    {"pic_no": 1, "description": "A group of students staring intently at a highly complex equation on a blackboard.", "image_url": "https://picsum.photos/seed/tat_set12_1/800/600"},
    {"pic_no": 2, "description": "A woman reading a map while sitting next to a bicycle with a flat tire on a deserted road.", "image_url": "https://picsum.photos/seed/tat_set12_2/800/600"},
    {"pic_no": 3, "description": "A soldier in full uniform saluting a simple, unmarked grave.", "image_url": "https://picsum.photos/seed/tat_set12_3/800/600"},
    {"pic_no": 4, "description": "A young child looking through a large telescope at the night sky.", "image_url": "https://picsum.photos/seed/tat_set12_4/800/600"},
    {"pic_no": 5, "description": "A person handing a thick envelope to another person in a dimly lit alley.", "image_url": "https://picsum.photos/seed/tat_set12_5/800/600"},
    {"pic_no": 6, "description": "A team of researchers excitedly looking at a small glowing plant in a greenhouse.", "image_url": "https://picsum.photos/seed/tat_set12_6/800/600"},
    {"pic_no": 7, "description": "An athlete sitting alone in the locker room, holding their head in their hands.", "image_url": "https://picsum.photos/seed/tat_set12_7/800/600"},
    {"pic_no": 8, "description": "A farmer examining a completely dried up, cracked piece of land.", "image_url": "https://picsum.photos/seed/tat_set12_8/800/600"},
    {"pic_no": 9, "description": "A person rapidly typing on a laptop with several empty coffee cups around.", "image_url": "https://picsum.photos/seed/tat_set12_9/800/600"},
    {"pic_no": 10, "description": "Two hikers standing at a fork in the trail, pointing in opposite directions.", "image_url": "https://picsum.photos/seed/tat_set12_10/800/600"},
    {"pic_no": 11, "description": "A crowd of people looking up and pointing at something out of frame.", "image_url": "https://picsum.photos/seed/tat_set12_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "High", "Low", "Big", "Small", "Tall", "Short", "Wide", "Narrow", "Deep", "Shallow",
    "Near", "Far", "Close", "Distant", "Here", "There", "Everywhere", "Nowhere", "Some", "Many",
    "Few", "All", "None", "One", "Two", "Three", "Number", "Count", "Add", "Subtract",
    "Multiply", "Divide", "Share", "Keep", "Give", "Take", "Borrow", "Lend", "Rent", "Own",
    "Master", "Servant", "Slave", "Free", "Lead", "Guide", "Show", "Point", "Direction", "North",
    "South", "East", "West", "Up", "Down", "Center", "Core", "Heart", "Soul", "Mind"
  ],

  "SRT": [
    "He discovers that the college principal is taking bribes for admissions. He...",
    "While returning from a late-night shift, his car breaks down in a heavy thunderstorm. He...",
    "His team member constantly takes unauthorized breaks, delaying the entire project. He...",
    "He sees a group of boys ragging a junior student very aggressively. He...",
    "He is participating in a marathon and gets a severe muscle cramp 2 km before the finish line. He...",
    "He discovers that his newly bought expensive smartphone is a fake model. He...",
    "He is supposed to perform on stage, but his partner backs out at the last minute. He...",
    "While swimming in the sea, he feels a strong undercurrent pulling him away from the shore. He...",
    "His roommate throws a late-night party the day before his most important exam. He...",
    "He finds a stray, heavily injured puppy on the highway in the middle of heavy rain. He...",
    "He is driving and a traffic cop demands a bribe for a violation he didn't commit. He...",
    "He is locked out of his house at 1 AM and his parents are out of town. He...",
    "He sees a colleague secretly deleting important files from the company server. He...",
    "His best friend confesses to cheating on a crucial final exam. He...",
    "He is on a trek and his group runs out of food supplies halfway through. He...",
    "He is stuck in a lift with a person who has severe claustrophobia and starts panicking. He...",
    "He finds an unattended laptop in a public library. He...",
    "He is leading a project, but his ideas are constantly ridiculed by a senior member. He...",
    "He sees a snake in his friend's sleeping bag during a camping trip. He...",
    "He is given a highly sensitive task, but he lacks the required technical knowledge. He...",
    "He is in a crowded market and suddenly hears a gunshot. He...",
    "His flight gets canceled and he has to attend a life-changing interview the next morning. He...",
    "He finds out his brother has stolen money from their father's wallet. He...",
    "He is trekking in a dense forest and his compass breaks. He...",
    "He is wrongly accused of misbehaving with a female colleague. He...",
    "He is riding his bike and the chain breaks in a deserted area at night. He...",
    "He is appointed team captain, but the coach constantly interferes with his decisions. He...",
    "He sees a venomous spider on his teammate's shoulder. He...",
    "He is trapped inside a burning building with thick smoke filling the room. He...",
    "He finds a massive discrepancy in the company's financial audit. He...",
    "He is trekking in the snow and begins to experience severe altitude sickness. He...",
    "He is at a restaurant and a waiter spills hot soup on him. He...",
    "He sees a person attempting to steal a car. He...",
    "He is studying for a crucial exam, but his neighbor throws a loud party. He...",
    "He discovers a major error in a report his team is about to submit to the director. He...",
    "He is in a foreign country and gets severely sick. He...",
    "He is appointed team captain, but half the team protests the decision. He...",
    "He sees a man beating his wife on the street. He...",
    "He is driving and a tire bursts at high speed. He...",
    "He is trapped inside a bank during an armed robbery. He...",
    "He receives a package containing illegal drugs delivered to him by mistake. He...",
    "He is preparing for the SSB, but falls severely ill a week before. He...",
    "He is hiking and his friend falls into a deep ravine, breaking his leg. He...",
    "He is cooking and hot oil spills on his hand. He...",
    "He is on a boat that starts taking on water rapidly. He...",
    "He sees a colleague stealing office supplies. He...",
    "He is walking home and a gang of youths demands his phone and wallet. He...",
    "He is at a busy intersection and the traffic lights fail, causing a massive jam. He...",
    "He is given a task that requires specialized software he doesn't know how to use. He...",
    "He is in a movie theater and smells smoke coming from the projector room. He...",
    "He finds out his brother has massive gambling debts. He...",
    "He is leading a patrol and his radio breaks down in hostile territory. He...",
    "He sees a child playing dangerously close to an open manhole. He...",
    "He is taking a shower and the water supply suddenly stops completely. He...",
    "He is unfairly passed over for a promotion in favor of the boss's nephew. He...",
    "He is in a crowded bus and feels someone picking his pocket. He...",
    "He is trekking and a thick fog rolls in, reducing visibility to zero. He...",
    "He is presenting a project and a senior manager constantly interrupts him aggressively. He...",
    "He is walking in the woods and gets bitten by a snake. He...",
    "He finds a briefcase full of cash on a park bench. He..."
  ],

  "PPDT": {
    "image_url": "https://picsum.photos/seed/ppdt_set12/800/600?blur=5",
    "description": "Hazy picture of a person carrying two heavy buckets, walking up a steep incline."
  },

  "PI": [
    "Tell me about a time when you had to work with a team that had very low morale.",
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
    "Why is adaptability crucial for an officer in the Armed Forces?",
    "Tell me about a time you had to make a decision that upset your parents.",
    "What are the major challenges facing the Indian agricultural sector today?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to improve in yourself?"
  ],

  "Lecturette": [
    "Artificial Intelligence in Defence",
    "Naxalism in India: Causes and Solutions",
    "Electoral Reforms in India",
    "Namami Gange: The Clean Ganga Mission"
  ],

  "GD": [
    "Should massive funds be spent on space exploration when there is widespread poverty?",
    "Is the concept of non-violence (Ahimsa) still practically relevant in today's world?"
  ],

  "GPE": {
    "narrative": "You are a group of 6 forest rangers patrolling near a river. It is 1400 hours. A local tribal informs you: 1. A rare elephant calf has fallen into a deep trench 3 km North and is trapped. 2. A solo hiker has gone missing and was last seen near the steep cliffs 4 km South. 3. Upstream, a dam has opened its gates without warning, and the river will rise dangerously, flooding the nearby tribal settlement (2 km East) in exactly 2 hours. You have a rugged 4x4 jeep (seats 6), ropes, and basic first aid. The nearest forest headquarters is 15 km away, across the river, accessible via a narrow bridge. How will you rescue the calf, find the hiker, and evacuate the settlement before the flood hits at 1600 hours?",
    "map_url": "https://picsum.photos/seed/gpe_map_set12/800/600"
  },

  "GTO": {
    "PGT": "Progressive Group Task: 4 progressive obstacles emphasizing precision and careful bridging. Resources: 1 long Plank, 1 short Balli, 2 Ropes. Time: 45 mins. Strict 'no touching red' rules.",
    "HGT": "Half Group Task: 1 complex obstacle involving a suspended drum. Resources: 1 Plank, 1 Balli, 1 Rope. Time: 15 mins.",
    "IO": "Individual Obstacles: 10 obstacles (High Jump, Double Ditch, Zig-Zag Balance, Tarzan Swing, Commando Walk, Tiger Leap, Rope Climbing, Screen Jump, Burma Bridge, Monkey Crawl). Time: 3 mins.",
    "FGT": "Final Group Task: 1 long, complex obstacle requiring the entire group to extract a 'hostage' dummy from a confined space using limited ropes. Resources: Plank, Balli, 3 Ropes. Time: 15 mins."
  },

  "CPSS": [
    "Spatial orientation: If the turn coordinator shows a rate-1 turn to the left but the slip indicator ball is deflected to the right, how should you correct the rudder?",
    "Artificial Horizon: The horizon bar is pitched up 10 degrees and banked 30 degrees to the right. Describe the aircraft's current attitude.",
    "Altimeter Reading: Read the three-pointer altimeter displaying the 10,000-ft pointer between 2 and 3, the 1,000-ft pointer at 4, and the 100-ft pointer at 8. What is the current altitude?",
    "Instrument Landing System: The localizer needle is deflected to the right and the glide slope needle is deflected upwards. Where is the aircraft relative to the correct glide path?",
    "Visual Spatial Reasoning: An unfolded 2D cross pattern has faces marked A, B, C, D, E, F. If folded into a 3D cube, which face will be opposite to C?",
    "Cognitive Memory Challenge: Study the radar screen featuring 6 hazard symbols for 5 seconds. Identify the coordinates of the symbol that changes position.",
    "Compass Heading: The aircraft is heading 210 degrees (South-West). You receive a command to make a standard rate turn to a heading of 030 degrees. How many degrees of turn are required?",
    "Multi-tasking Psychomotor Test: Maintain the flight simulator joystick within the green tracking zone while solving double-digit addition problems shown on the Head-Up Display (HUD).",
    "Aircraft Recognition: Identify the silhouette of the indigenous light combat aircraft (LCA) Tejas based on its compound delta wing design.",
    "Reaction Time & Auditory Vigilance: Press the primary weapon launch button within 250 milliseconds only when the radar target locks (turns green) and a high-frequency acoustic warning is heard."
  ]
}

with open(os.path.join(OUTPUT_DIR, "set_12.json"), 'w', encoding='utf-8') as f:
    json.dump(set_12_data, f, indent=2)

print("Set 12 created successfully with CPSS.")
