import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_16_data = {
  "set_id": "SET_16",
  "description": "High-Quality Curated SSB Dataset - Set 16",
  "TAT": [
    {"pic_no": 1, "description": "A young team lead explaining architectural blueprints to group of construction workers.", "image_url": "https://picsum.photos/seed/tat_set16_1/800/600"},
    {"pic_no": 2, "description": "A researcher looking into a large modern electron microscope in a nanotechnology laboratory.", "image_url": "https://picsum.photos/seed/tat_set16_2/800/600"},
    {"pic_no": 3, "description": "A group of volunteers clearing weeds and plastic from a local lake using small rowboats.", "image_url": "https://picsum.photos/seed/tat_set16_3/800/600"},
    {"pic_no": 4, "description": "A firefighter in heavy gear carrying a hose towards a smoking building exit.", "image_url": "https://picsum.photos/seed/tat_set16_4/800/600"},
    {"pic_no": 5, "description": "A doctor examining a patient's throat using a medical light in a rural clinic.", "image_url": "https://picsum.photos/seed/tat_set16_5/800/600"},
    {"pic_no": 6, "description": "An outdoor instructor teaching basic knot tying to a circle of attentive scout trainees.", "image_url": "https://picsum.photos/seed/tat_set16_6/800/600"},
    {"pic_no": 7, "description": "A naval officer tracking radar sweeps in a submarine control room.", "image_url": "https://picsum.photos/seed/tat_set16_7/800/600"},
    {"pic_no": 8, "description": "A student volunteering to organize books in a dusty town library.", "image_url": "https://picsum.photos/seed/tat_set16_8/800/600"},
    {"pic_no": 9, "description": "Two researchers comparing graphs on a computer screen in a wind tunnel lab.", "image_url": "https://picsum.photos/seed/tat_set16_9/800/600"},
    {"pic_no": 10, "description": "A sculptor refining a clay statue of a historical leader in a bright studio.", "image_url": "https://picsum.photos/seed/tat_set16_10/800/600"},
    {"pic_no": 11, "description": "A rescue boat steering through debris to rescue a dog stranded on a rooftop.", "image_url": "https://picsum.photos/seed/tat_set16_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Task", "Goal", "Aspir", "Climb", "Leap", "Bold", "Sure", "Grit", "Will", "Force", 
    "Power", "Order", "Guide", "Build", "Forge", "Carve", "Create", "Shape", "Mold", "Form", 
    "New", "Fresh", "Pure", "True", "Sinc", "Heart", "Soul", "Mind", "Brain", "Sharp", 
    "Swift", "Quick", "Speed", "Fast", "Run", "Race", "Win", "Glory", "Honor", "Pride", 
    "Brave", "Pluck", "Stout", "Firm", "Stiff", "Tough", "Hard", "Soft", "Mild", "Kind", 
    "Help", "Save", "Guard", "Shield", "Cover", "Warm", "Bright", "Glow", "Light", "Cheer"
  ],

  "SRT": [
    "He is leading a cycling patrol in a mountainous border area and a rider suffers a severe puncture. He...",
    "His sister's wedding clashes with his final selection interview for a prestigious fellowship. He...",
    "He discovers that a colleague is leaking key client data to a competitor company. He...",
    "While returning home, he sees a tree branch collapse on an overhead high-tension wire. He...",
    "He is organizing a college alumni meet, and the keynote speaker cancels at the very last moment. He...",
    "He finds a camera bag with lens accessories in the waiting area of a metro station. He...",
    "He is preparing for his entrance exam, but the nearby temple plays loudspeaker prayers all night. He...",
    "A wild boar enters the farming fields of his village, threatening to destroy crops. He...",
    "He is on an interstate bus and a co-passenger starts experiencing severe chest pain. He...",
    "He is accused of copying a research project, which he actually did through original lab trials. He...",
    "He is managing a sports event and the referee fails to show up on the field. He...",
    "He is stuck in a lift with a claustrophobic passenger who begins to hyperventilate. He...",
    "He sees a taxi driver cheating an illiterate commuter on the fare. He...",
    "He gets caught in a dense dust storm while driving back from a remote outpost. He...",
    "He is selected for a mountain expedition, but he sprains his wrist a day before departure. He...",
    "He notices a heavily overloaded vehicle driving dangerously near a school zone. He...",
    "His supervisor asks him to alter the environmental safety report of a new chemical plant. He...",
    "A government clerk delays issuing his passport, hinting at an extra payment. He...",
    "He is staying in a university hostel and his neighbor has a severe diabetic shock at midnight. He...",
    "He is presenting a project, and the evaluator rejects his method as totally flawed. He...",
    "He is on a high-altitude trek and his companion begins to suffer from severe hypothermia. He...",
    "He finds out that his close relative is running an illegal betting racket. He...",
    "While driving on a state highway, he witnesses a head-on collision between two cars. He...",
    "He is assigned to a group project with a team member who is extremely arrogant and uncooperative. He...",
    "His childhood friend is depressed due to multiple job rejections. He...",
    "He sees a group of children throwing stones at a nest of birds. He...",
    "He is working on his tablet and the charger sparks, catching fire. He...",
    "He is falsely blamed for leaking department information to a rival college. He...",
    "He is leading a student council and the members are deadlocked on the budget allocation. He...",
    "While boating in a lake, the engine catches fire and thick smoke fills the deck. He...",
    "He discovers his wallet was picked while buying snacks in a crowded market. He...",
    "He finds that someone has created a fake profile using his identity to solicit money. He...",
    "He is in a library and sees a visitor tearing pages from an encyclopedia. He...",
    "He is on a journey and a sudden landslide blocks the only connecting road. He...",
    "His younger cousin demands to ride his motorcycle, but has no valid license. He...",
    "He is organizing a tree planting drive and the vendor delivers dry saplings. He...",
    "He sees a blind man trying to cross a chaotic intersection with no pedestrian signal. He...",
    "He is writing an exam and the power goes out, leaving the room pitch dark. He...",
    "He finds a large swarm of wasps building a nest near his entrance gate. He...",
    "His team is playing a tournament match and the platform server crashes mid-game. He...",
    "He is on a trek and his teammate gets a deep cut on their thigh from a sharp branch. He...",
    "He is preparing a digital project and his hard drive gets corrupted, wiping out the work a day before the review. He...",
    "He sees a candidate using a cheat sheet during a national competition. He...",
    "He is riding a motorcycle and the clutch cable snaps on a busy flyover. He...",
    "He notices a strong smell of gas from a neighbor's kitchen, and the door is locked from inside. He...",
    "His project partner takes all the credit for a research paper they co-authored. He...",
    "He is traveling and the vehicle's radiator starts overheating rapidly in a deserted area. He...",
    "He sees a passenger's jacket catch fire from a stray spark during a festival crowd. He...",
    "He is asked to give a presentation on an advanced technical topic in place of an absent colleague. He...",
    "He is at home at night and hears someone trying to break open the back door lock. He...",
    "He finds a severe error in his salary slip showing a large overpayment. He...",
    "His friends try to pressure him into trying synthetic drugs during a vacation trip. He...",
    "He is participating in a high-jump event and the landing mattress gets torn and deflated. He...",
    "He is stuck in a passenger lift with an expectant mother who starts feeling labor pains. He...",
    "He is in a national park and spots a small forest fire starting near a dry leaf pile. He...",
    "He is selected for an interview, but the calling letter reaches him with only 2 hours to spare. He...",
    "He finds out his friend is planning to leave college due to severe exam stress. He...",
    "He is riding a pillion on a motorcycle and the rider starts driving on the wrong side of the road. He...",
    "He finds an injured kingfisher bird near his garden pond. He...",
    "He is attending a scientific seminar and the presenter makes a highly controversial statement. He..."
  ],

  "PPDT": {
    "image_url": "https://picsum.photos/seed/ppdt_set16/800/600?blur=5",
    "description": "Hazy picture of four people standing together on a muddy track, looking towards a distant valley."
  },

  "PI": [
    "How do you build team chemistry when working with diverse individuals?",
    "Tell me about a time you had to adapt to a sudden, highly disruptive change.",
    "What is your view on the growing influence of space debris on international security?",
    "How do you maintain your composure when everything seems to go wrong?",
    "Tell me about a time you had to defend a weak colleague from unfair treatment.",
    "What are the most critical bilateral challenges facing India and its neighboring countries?",
    "How do you manage your hobbies and passions alongside rigorous academic demands?",
    "Tell me about a time you had to pick up a highly technical skill over a weekend.",
    "If you are given a project with ambiguous goals, how do you construct a clear plan?",
    "What is your opinion on the security challenges posed by modern deepfakes?",
    "Tell me about a time you had to convey bad news to your parents or seniors.",
    "Why do you believe you are suited for the rigorous lifestyle of a military officer?",
    "What is the difference between physical resilience and mental toughness, in your opinion?",
    "How do you motivate a team member who is underperforming due to family issues?",
    "What role does integrity play in everyday leadership?",
    "Tell me about a time you organized a blood donation or vaccination camp.",
    "What are your views on India's target of achieving net-zero emissions by 2070?",
    "If you are not selected in this attempt, what backup option have you planned?",
    "How do you handle severe negative feedback on a project you worked hard on?",
    "What is the most daring rescue or emergency situation you have ever handled?"
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
    "The Future of Artificial Intelligence in Military Strategy",
    "Bilateral Relations between India and South-East Asia",
    "The Importance of Renewable Energy in Remote Areas"
  ],

  "GD": [
    "Is the shift to electric vehicles happening fast enough to counter air pollution in major cities?",
    "Should high-tech surveillance be universally adopted to counter crime, or does it violate basic privacy rights?"
  ],

  "GPE": {
    "narrative": "You are a group of 6 environment volunteers visiting a riverbank conservation site. It is 1400 hours. A local boatman runs up to you with critical news: 1. A sudden flash flood warning has been issued, and the low-lying riverbank village (3 km downstream) will be flooded in exactly 2 hours (1600 hours). 2. A tourist jeep has got stuck in a sandy marsh 4 km North, and the passengers are stranded without food or water. 3. A flock of rare migratory birds is trapped in a netting trap set illegally by poachers 2 km East. You have a pickup vehicle (seats 5), some towing ropes, a first aid box, and a satellite phone with limited charge. The forest conservation office is 12 km away across the river. How will you divide your group and prioritize these tasks to ensure the village is evacuated, the tourists are towed out, and the poachers' traps are cleared before the flood hits?",
    "map_url": "https://picsum.photos/seed/gpe_map_set16/800/600"
  },

  "GTO": {
    "PGT": "Progressive Group Task: 4 progressive obstacles emphasizing balance and load bearing. Resources: 1 long Plank, 1 short Balli, 2 Ropes, 1 wooden block. Time: 40 mins.",
    "HGT": "Half Group Task: 1 complex obstacle involving crossing a suspended platform. Resources: 1 Plank, 1 Balli, 1 Rope. Time: 15 mins.",
    "IO": "Individual Obstacles: 10 standard GTO obstacles. Time: 3 mins.",
    "FGT": "Final Group Task: A coordinated team effort to transport a heavy ammunition canister across the final defensive line. Resources: 1 Plank, 1 Balli, 2 Ropes. Time: 15 mins."
  },

  "CPSS": [
    "Spatial orientation: If the slip indicator ball is deflected to the left during a right turn, how should you correct the rudder?",
    "Artificial Horizon: The horizon bar is pitched up 10 degrees and banked 30 degrees to the left. Describe the aircraft's current attitude.",
    "Altimeter Reading: Read the altimeter showing the 10,000-ft pointer at 6, the 1,000-ft pointer at 5, and the 100-ft pointer at 3. What is the current altitude?",
    "Instrument Landing System: The localizer needle is deflected to the right and the glide slope needle is deflected downwards. Where is the aircraft relative to the correct glide path?",
    "Visual Spatial Reasoning: An unfolded 2D pattern shaped like a T has faces marked A to F. If folded into a 3D cube, which face will be opposite to C?",
    "Cognitive Memory Challenge: Study the radar display featuring 6 aircraft tracks for 5 seconds. Identify which track number has changed its bearing.",
    "Compass Heading: The aircraft is heading 270 degrees (West). You receive a command to make a standard rate turn to a heading of 090 degrees. How many degrees of turn are required?",
    "Multi-tasking Psychomotor Test: Maintain the flight simulator joystick within the target green circle while solving basic addition problems on the Head-Up Display (HUD).",
    "Aircraft Recognition: Identify the silhouette of the Su-30MKI fighter aircraft based on its twin tails and canards.",
    "Reaction Time & Auditory Vigilance: Press the missile launch button within 250 milliseconds only when the radar target locks (turns green) and a high-pitch warning beep is heard."
  ]
}

with open(os.path.join(OUTPUT_DIR, "set_16.json"), 'w', encoding='utf-8') as f:
    json.dump(set_16_data, f, indent=2)

print("Set 16 created successfully with CPSS.")
