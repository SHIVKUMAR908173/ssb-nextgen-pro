import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_03_data = {
  "set_id": "SET_03",
  "description": "High-Quality Curated SSB Dataset - Set 3",
  
  "TAT": [
    {"pic_no": 1, "description": "A scientist looking intently through a microscope in a laboratory.", "image_url": "https://picsum.photos/seed/tat_set3_1/800/600"},
    {"pic_no": 2, "description": "A woman sitting on a chair, crying with an open letter in her hand.", "image_url": "https://picsum.photos/seed/tat_set3_2/800/600"},
    {"pic_no": 3, "description": "Soldiers heavily equipped, patrolling a snowy border at night.", "image_url": "https://picsum.photos/seed/tat_set3_3/800/600"},
    {"pic_no": 4, "description": "A man carefully building a brick wall, wiping sweat from his forehead.", "image_url": "https://picsum.photos/seed/tat_set3_4/800/600"},
    {"pic_no": 5, "description": "A group of children looking longingly at a toy shop window.", "image_url": "https://picsum.photos/seed/tat_set3_5/800/600"},
    {"pic_no": 6, "description": "A young man helping an elderly person cross a flooded street.", "image_url": "https://picsum.photos/seed/tat_set3_6/800/600"},
    {"pic_no": 7, "description": "Two individuals having a heated argument over a desk full of papers.", "image_url": "https://picsum.photos/seed/tat_set3_7/800/600"},
    {"pic_no": 8, "description": "A person sitting alone on a mountaintop, looking at the sunrise.", "image_url": "https://picsum.photos/seed/tat_set3_8/800/600"},
    {"pic_no": 9, "description": "A doctor rushing through a hospital corridor with a serious expression.", "image_url": "https://picsum.photos/seed/tat_set3_9/800/600"},
    {"pic_no": 10, "description": "A mechanic repairing a broken down car on a deserted highway.", "image_url": "https://picsum.photos/seed/tat_set3_10/800/600"},
    {"pic_no": 11, "description": "A teacher pointing at a blackboard, explaining something to an empty classroom.", "image_url": "https://picsum.photos/seed/tat_set3_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Family", "Brother", "Goal", "Hardwork", "Rest", "Gun", "Discipline", "Habit", "Order", "Mess",
    "Clean", "Dirty", "Future", "Past", "Present", "Wait", "Act", "Speed", "Slow", "Decide",
    "Confuse", "Focus", "Aim", "Target", "Hit", "Miss", "Score", "Judge", "Jury", "Court",
    "Law", "Free", "Jail", "Bind", "Cut", "Join", "Break", "Glue", "Fix", "Ruin",
    "Build", "Home", "House", "Tent", "Camp", "March", "Halt", "Stand", "Sit", "Sleep",
    "Wake", "Dream", "Reality", "Illusion", "Magic", "Trick", "Honest", "Deceive", "Loyal", "Traitor"
  ],

  "SRT": [
    "He finds a 5-year-old child crying and lost in a massive village fair. He...",
    "While returning from a party, he sees a car skid off a bridge into a river. He...",
    "He is the team leader for a college project, but his teammates are not contributing at all. He...",
    "He has an important job interview, but his only formal shirt gets ruined 30 minutes before. He...",
    "During a train journey, a co-passenger suffers a severe asthma attack and has no inhaler. He...",
    "He notices his roommate is secretly reading his personal diary. He...",
    "He is given a task to complete in 2 days, which normally takes a week. He...",
    "He sees two men eve-teasing a girl at a bus stop, but the crowd is ignoring it. He...",
    "His father tells him to drop his dream of joining the Army and take up a safe corporate job. He...",
    "He is trekking and his water bottle leaks, leaving him with no water in a dry area. He...",
    "He discovers that his close friend has been spreading rumors about him. He...",
    "He is riding his bike and a stray dog suddenly jumps in front of his wheel. He...",
    "He is writing his final exam and his pen runs out of ink, and nobody has a spare. He...",
    "He sees a suspicious person taking photos of a military installation. He...",
    "He is participating in a debate competition and completely forgets his points on stage. He...",
    "His younger sister wants to go on a trip with friends, but his parents are against it. He...",
    "He is driving on a highway and realizes his car's brakes have failed. He...",
    "He is in a theater and a sudden stampede occurs due to a false fire alarm. He...",
    "He finds out his teammate is physically abusing a junior player. He...",
    "He is stranded at a railway station at 2 AM with no money and no phone battery. He...",
    "He is asked to give a presentation to the CEO, but he has severe stage fright. He...",
    "He sees a senior citizen being scammed by a fake lottery agent. He...",
    "He is camping in a forest and hears a loud scream from a nearby tent. He...",
    "He is leading a group in the mountains and a sudden avalanche blocks their path back. He...",
    "He is falsely accused by his boss of leaking company secrets to a rival. He...",
    "His bike runs out of petrol on a lonely road late at night. He...",
    "He is given a leadership role, but a senior colleague constantly undermines his authority. He...",
    "He sees a venomous snake in his bathroom while taking a shower. He...",
    "He is in an elevator that gets stuck between floors and the emergency button doesn't work. He...",
    "He finds a loaded revolver in a public toilet. He...",
    "He is trekking in the snow and begins to experience snow blindness. He...",
    "He is at a restaurant and realizes he forgot his wallet after eating. He...",
    "He sees a person attempting to jump off a bridge. He...",
    "He is studying for a crucial exam, but his neighbor throws a loud party. He...",
    "He discovers a major error in a report his team is about to submit to the director. He...",
    "He is in a foreign country and loses all his documents and money. He...",
    "He is appointed captain, but half the team protests the decision. He...",
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
    "image_url": "https://picsum.photos/seed/ppdt_set3/800/600?blur=5",
    "description": "Hazy picture of someone sitting on a rock by a fast-flowing river, looking down."
  },

  "PI": [
    "What was the most difficult subject for you in school and how did you tackle it?",
    "How do you handle peer pressure, especially when it goes against your values?",
    "Tell me about a time you took the initiative to organize an event.",
    "If you are the commander and your unit refuses to advance due to heavy fire, what will you do?",
    "What are the major challenges the Indian economy is facing today?",
    "Describe your daily routine. How much time do you dedicate to self-improvement?",
    "What is the difference between a good manager and a good leader?",
    "Tell me about a situation where you had to work with a difficult person.",
    "How do you keep yourself updated with current affairs?",
    "What is your opinion on the Uniform Civil Code?",
    "Why did you choose your specific stream/degree in graduation?",
    "Have you ever been in a physical fight? What was the outcome?",
    "What are your views on the increasing use of Artificial Intelligence?",
    "Tell me about a time you made a severe mistake and how you rectified it.",
    "If you could have dinner with any historical figure, who would it be and why?",
    "What role does discipline play in your life?",
    "How do you deal with failure or rejection?",
    "What are the core values that guide your life?",
    "Tell me about your relationship with your teachers and mentors.",
    "If you don't make it into the Armed Forces, what is your plan B?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to improve in yourself?"
  ],

  "Lecturette": [
    "Uniform Civil Code",
    "Electric Vehicles in India",
    "Women Empowerment in Armed Forces",
    "Terrorism in Jammu & Kashmir"
  ],

  "GD": [
    "Is privatization of Public Sector Undertakings (PSUs) beneficial for the Indian economy?",
    "Impact of OTT platforms on the youth: Good or Bad?"
  ],

  "GPE": {
    "narrative": "You are a group of 10 NCC cadets camping in a forest near a village. It is 1400 hours. A forest guard approaches your camp and informs you that: 1. A massive forest fire has started 5 km North of your camp and is spreading rapidly towards the village. 2. Two tourists are trapped on a cliff 3 km East of your camp. 3. The main bridge connecting the village to the nearest town (10 km away) is about to collapse due to heavy water flow. 4. An old woman in the village has suffered a severe heart attack and needs immediate medical attention. You have one jeep (can seat 4), two motorcycles, camping gear, and basic first aid kits. The nearest hospital and fire station are in the town across the bridge. How will you plan your actions to save the village, the tourists, and the woman before the fire reaches at 1600 hours?",
    "map_url": "https://picsum.photos/seed/gpe_map_set3/800/600"
  },

  "GTO": {
    "PGT": "Progressive Group Task: 4 progressive obstacles requiring bridging gaps over out-of-bounds areas. Resources: 2 Planks (one short, one long), 1 Balli, 2 Ropes. Time: 45 mins. Strict 'no touching red' rules.",
    "HGT": "Half Group Task: 1 complex obstacle involving a fulcrum mechanism. Resources: 1 Plank, 1 Balli, 1 Rope. Time: 15 mins.",
    "IO": "Individual Obstacles: 10 obstacles (High Jump, Double Ditch, Zig-Zag Balance, Tarzan Swing, Commando Walk, Tiger Leap, Rope Climbing, Screen Jump, Burma Bridge, Monkey Crawl). Time: 3 mins.",
    "FGT": "Final Group Task: 1 long, complex obstacle requiring the entire group to transport a heavy 'bomb' (drum) across a wide gap. Resources: Plank, Balli, Rope. Time: 15 mins."
  },

  "CPSS": [
    "Auditory Tracking: Listen to the varying pitch and press the button only when it matches the target frequency.",
    "Instrument Reading: Interpret the Artificial Horizon showing a 30-degree bank to the right and a 10-degree pitch up.",
    "Spatial logic: Identify the correct 3D object that matches the 2D orthographic projections provided.",
    "Coordinate mapping: Enter the grid coordinates for 3 simultaneous moving targets within 5 seconds.",
    "Memory Test: Recall the sequence of 8 colored lights flashed at 0.5-second intervals.",
    "Reaction Time: Press the corresponding pedal when the red light flashes, but ignore the blue light.",
    "Compass Reading: If the aircraft is heading South-West and makes a 135-degree turn to the left, what is the new heading?",
    "Multi-tasking: Keep the joystick crosshair on the moving target while mentally calculating 45 + 17 - 12.",
    "Identify the aircraft silhouette that matches the Dassault Rafale.",
    "Determine the correct runway approach path based on wind direction (crosswind of 20 knots from the right)."
  ]
}

with open(os.path.join(OUTPUT_DIR, "set_03.json"), 'w', encoding='utf-8') as f:
    json.dump(set_03_data, f, indent=2)

print("Set 3 created successfully.")
