import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_45_data = {
  "set_id": "SET_45",
  "description": "High-Quality Curated SSB Dataset - Set 45",
  "TAT": [
    {"pic_no": 1, "description": "A young technician calibrating a laser Doppler vibrometer on a satellite antenna reflector.", "image_url": "https://picsum.photos/seed/tat_set45_1/800/600"},
    {"pic_no": 2, "description": "A research engineer inspecting a graphene-coated heat shield panel in a plasma wind tunnel.", "image_url": "https://picsum.photos/seed/tat_set45_2/800/600"},
    {"pic_no": 3, "description": "A group of NCC cadets clearing invasive Lantana weeds from a forest nature trail.", "image_url": "https://picsum.photos/seed/tat_set45_3/800/600"},
    {"pic_no": 4, "description": "A student volunteer teaching digital banking operations to elderly residents in a village chaupal.", "image_url": "https://picsum.photos/seed/tat_set45_4/800/600"},
    {"pic_no": 5, "description": "A structural inspector testing the tension of stay cables on a newly built cable-stayed bridge.", "image_url": "https://picsum.photos/seed/tat_set45_5/800/600"},
    {"pic_no": 6, "description": "A flight cadet analyzing a synthetic aperture radar (SAR) image for terrain mapping.", "image_url": "https://picsum.photos/seed/tat_set45_6/800/600"},
    {"pic_no": 7, "description": "A mechanic replacing a heavy-duty hydraulic actuator on a motion-based flight simulator.", "image_url": "https://picsum.photos/seed/tat_set45_7/800/600"},
    {"pic_no": 8, "description": "A student volunteer organizing a queue at a mobile blood donation van in a college campus.", "image_url": "https://picsum.photos/seed/tat_set45_8/800/600"},
    {"pic_no": 9, "description": "Two conservationists planting mangrove saplings in a muddy tidal flat to prevent coastal erosion.", "image_url": "https://picsum.photos/seed/tat_set45_9/800/600"},
    {"pic_no": 10, "description": "A farmer monitoring an automated drip irrigation valve in a polyhouse vegetable farm.", "image_url": "https://picsum.photos/seed/tat_set45_10/800/600"},
    {"pic_no": 11, "description": "A logistics manager tracking a fleet of refrigerated vaccine transport trucks on a live map display.", "image_url": "https://picsum.photos/seed/tat_set45_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Vibrometer", "Graphene", "Lantana", "Digital", "Tension", "Radar", "Actuator", "Mangrove", "Valve", "Vaccine", 
    "Logistics", "Apex", "Bold", "Cope", "Drive", "Earn", "Firm", "Glow", "Hope", "Keen", 
    "Light", "Mild", "Neat", "Pure", "Rely", "Safe", "Trust", "Valor", "Warm", "Yield", 
    "Sovereign", "Hasten", "Grip", "Talon", "Glide", "Orbit", "Drill", "Vault", "Quell", "Rally", 
    "Blaze", "Forge", "Anchor", "Vessel", "Summit", "Plunge", "Vigour", "Robust", "Steady", "Ample", 
    "Sturdy", "Zenith", "Nadir", "Crest", "Flank", "Brave", "Calm", "Cheer", "Bright", "True"
  ],

  "SRT": [
    "He is calibrating a laser vibrometer and a sudden power fluctuation corrupts the calibration data. He...",
    "His sister's wedding reception falls on the exact day of his crucial SSB radar interpretation test. He...",
    "He discovers that a local chemical factory is releasing untreated waste into the village pond at night. He...",
    "While walking in the rain, he sees a broken live wire hanging close to a puddle on a busy street. He...",
    "He is organizing a college technical fest and the main server crashes an hour before the coding event. He...",
    "He finds a bag containing laptop and important research documents left behind in a metro train. He...",
    "He is preparing for his final exams but a fire in the building forces everyone to evacuate. He...",
    "A swarm of wild bees attacks the workers in his polyhouse during harvest. He...",
    "He is traveling on a mountain bus and the driver loses control due to brake failure on a sharp turn. He...",
    "He is accused by a professor of copying his project code from an online repository. He...",
    "He is coordinating a inter-college basketball match and the referee makes a biased decision leading to a fight. He...",
    "He is stuck in an elevator with a claustrophobic person during a power outage. He...",
    "He notices a local milk vendor mixing adulterants in the milk before supply. He...",
    "He gets caught in a sudden cloudburst while trekking in a remote valley. He...",
    "He is selected to represent his state in a quiz competition but the event dates clash with his semester practicals. He...",
    "He notices an unauthorized construction activity encroaching upon a public park in his locality. He...",
    "His team leader asks him to use substandard materials to save costs in a government project. He...",
    "An administrative officer asks for a bribe to clear his scholarship application. He...",
    "He is staying at a high-altitude research station and the oxygen supply system malfunctions. He...",
    "He presents a new design for a drone and his colleagues mock it as impractical. He...",
    "He is trekking and his partner slips and suffers a suspected fracture in the ankle. He...",
    "He finds out a local restaurant is using domestic LPG cylinders for commercial purposes illegally. He...",
    "While driving on a highway, he witnesses a collision between a car and a motorcycle. He...",
    "He is assigned a group task where two members refuse to work together due to personal ego. He...",
    "His roommate is addicted to online gambling and has lost all his semester fee money. He...",
    "He sees a group of vandals damaging the CCTV cameras in his residential society. He...",
    "He is working in a chemistry lab and a small fire breaks out due to a chemical reaction. He...",
    "He is falsely accused by his landlord of damaging the property and asked to vacate immediately. He...",
    "He is leading a tree plantation drive and the saplings delivered are of poor quality and withered. He...",
    "While boating in a lake, he notices the boat is taking in water due to a small leak. He...",
    "He realizes he has lost his train ticket and ID proof just as the TTE approaches him. He...",
    "He finds a phishing website that looks exactly like his college portal stealing student credentials. He...",
    "He is visiting a museum and sees someone trying to steal a small artifact. He...",
    "He is traveling to his SSB center and the train is delayed by 10 hours due to a track blockage. He...",
    "His neighbor plays extremely loud music late at night during his exam preparation. He...",
    "He is organizing a blood donation camp and the medical team arrives two hours late. He...",
    "He sees an old man collapse on the footpath due to extreme heat. He...",
    "He is writing his exam and his pen runs out of ink, and he doesn't have a spare one. He...",
    "He finds a stray dog with a deep wound on its leg near his house. He...",
    "His college robotics team's robot fails to clear the arena during the final run. He...",
    "He is trekking and runs out of drinking water with 10 km still left to cover. He...",
    "He is preparing a presentation and his laptop crashes, corrupting the file an hour before the meeting. He...",
    "He sees a shopkeeper using faulty weights to cheat customers. He...",
    "He is riding a motorcycle and the chain breaks in the middle of a deserted road at night. He...",
    "He smells a strong burning odor coming from his neighbor's closed apartment. He...",
    "His colleague takes sole credit for a joint research paper published in a journal. He...",
    "He is traveling on a highway and his car tire bursts at a high speed. He...",
    "He sees a pickpocket stealing a purse from a lady in a crowded market. He...",
    "He is asked to give a welcome speech at a seminar as the scheduled speaker didn't arrive. He...",
    "He is alone at home and notices a group of suspicious men surveying his house. He...",
    "He notices that his monthly salary has been credited twice by mistake. He...",
    "His friends pressure him to try an illegal performance-enhancing drug before a sports meet. He...",
    "He is participating in a swimming race and gets a severe muscle cramp in deep water. He...",
    "He is stuck in a traffic jam and is getting late for a crucial job interview. He...",
    "He is in a forest and spots a group of poachers setting up traps for wild animals. He...",
    "He receives his call letter for SSB interview with only 2 days left for reporting. He...",
    "He finds out his friend is planning to drop out of college due to financial constraints. He...",
    "He is a pillion rider and the rider is overspeeding and breaking traffic signals. He...",
    "He finds an injured eagle with a broken wing on the roof of his building. He...",
    "He is attending a seminar and the speaker makes derogatory remarks about a specific community. He..."
  ],

  "PPDT": {
    "image_url": "https://picsum.photos/seed/ppdt_set45/800/600?blur=5",
    "description": "Hazy picture of a young technician calibrating a laser Doppler vibrometer on a satellite antenna reflector."
  },

  "PI": [
    "How do you handle a situation where your project guide dismisses your innovative idea as too risky?",
    "Tell me about a time you led a team to clear invasive weeds or clean up a neglected public space.",
    "What is your understanding of the strategic importance of Synthetic Aperture Radar (SAR) in defense?",
    "How do you maintain your fitness regime when you are busy with academic submissions?",
    "Have you ever raised your voice against a practice in your college that you found unfair?",
    "What are the major challenges in scaling up graphene production for industrial use?",
    "How do you resolve a conflict in a team when two members have a clash of egos?",
    "Tell me about a time you helped a friend or colleague deal with a severe anxiety or panic attack.",
    "If you are put in a team where you are junior to others but made the leader, how will you handle it?",
    "What is your take on the current geopolitical situation in the South China Sea?",
    "How did you manage a crisis situation at home when a key utility failed during a busy time?",
    "What role does discipline play in a group task like a command task or progressive group task?",
    "What is the significance of the motto of the NCC 'Unity and Discipline' in your life?",
    "How do you deal with a team member who is very knowledgeable but refuses to contribute practically?",
    "How can satellite technology be used to monitor and prevent illegal fishing in coastal areas?",
    "Tell me about a time you volunteered to manage a large crowd or a complex event.",
    "What are your views on India's 'Act East' policy and its strategic implications?",
    "If you are not recommended this time, what will be your immediate next plan of action?",
    "How do you handle a situation where a close friend borrows money and doesn't return it as promised?",
    "What is the most challenging physical or mental task you have undertaken so far in your life?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends or colleagues think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to develop in yourself?"
  ],

  "Lecturette": [
    "Graphene: The Wonder Material and its Defense Applications",
    "Synthetic Aperture Radar (SAR): Principles and Strategic Importance",
    "India's 'Act East' Policy: Geopolitical Significance",
    "Disaster Management: Role of Satellite Technology"
  ],

  "GD": [
    "Should the development of advanced materials like graphene be led by government research labs with public funding, or should private corporations be given full freedom and incentives to drive innovation?",
    "Does the increasing digitization of financial services bridge the economic divide in rural areas, or does it create a new class of digitally excluded citizens?"
  ],

  "GPE": {
    "narrative": "You are a group of 6 students on a trekking expedition in a remote hilly area. It is 0800 hours. You meet a shepherd who informs you of the following: 1. A flash flood has washed away a small wooden bridge 4 km North, and a group of primary school children are stranded on the other side and need to cross to reach home before a predicted storm at 1100 hours. 2. A forest fire has started 5 km East and is spreading towards a rare medicinal plant conservation plot. The forest guard needs help to create a fire break. 3. An injured trekker is lying in a gorge 3 km South with a broken leg and needs immediate evacuation to the nearest medical post which is 6 km away. You have a sturdy vehicle that can carry 6 people, a basic first aid kit, some ropes, and a mobile phone with weak signal. How will you plan your actions to help the children, assist the forest guard, and rescue the injured trekker before 1100 hours?",
    "map_url": "https://picsum.photos/seed/gpe_map_set45/800/600"
  },

  "GTO": {
    "PGT": "Progressive Group Task: 4 progressive obstacles requiring heavy cantilever structures to cross high walls. Resources: 1 long Plank, 1 short Balli, 2 Ropes, 1 steel pipe. Time: 40 mins.",
    "HGT": "Half Group Task: 1 complex obstacle involving crossing a suspended wooden platform. Resources: 1 Plank, 1 Balli, 1 Rope. Time: 15 mins.",
    "IO": "Individual Obstacles: 10 standard GTO obstacles including the Tiger Leap. Time: 3 mins.",
    "FGT": "Final Group Task: A coordinated team effort to transport a heavy load across the final defensive line. Resources: 1 Plank, 1 Balli, 2 Ropes. Time: 15 mins."
  },

  "CPSS": [
    "Spatial orientation: If the slip indicator ball is deflected to the right during a right turn, how should you correct the rudder?",
    "Artificial Horizon: The horizon bar is pitched up 10 degrees and banked 30 degrees to the right. Describe the aircraft's current attitude.",
    "Altimeter Reading: Read the altimeter showing the 10,000-ft pointer at 4, the 1,000-ft pointer at 5, and the 100-ft pointer at 0. What is the current altitude?",
    "Instrument Landing System: The localizer needle is deflected to the left and the glide slope needle is below center. Where is the aircraft relative to the correct glide path?",
    "Visual Spatial Reasoning: An unfolded 2D pattern of a cube has different symbols on each face. If folded, which symbol will be opposite to the star symbol?",
    "Cognitive Memory Challenge: Memorize a sequence of 7 digits displayed for 3 seconds and recall them in reverse order.",
    "Compass Heading: The aircraft is heading 270 degrees (West). You receive a command to make a turn to a heading of 045 degrees. What is the shortest direction and degrees of turn?",
    "Multi-tasking Psychomotor Test: Track a moving target on the screen with a crosshair while responding to specific audio cues.",
    "Aircraft Recognition: Identify the silhouette of the Su-30MKI fighter aircraft based on its canards, twin tails, and large size.",
    "Reaction Time & Auditory Vigilance: Press the spacebar as fast as possible when a red light flashes on the screen accompanied by a warning buzzer."
  ]
}

with open(os.path.join(OUTPUT_DIR, "set_45.json"), 'w', encoding='utf-8') as f:
    json.dump(set_45_data, f, indent=2)

print("Set 45 created successfully with CPSS.")
