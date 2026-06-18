import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_41_data = {
  "set_id": "SET_41",
  "description": "High-Quality Curated SSB Dataset - Set 41",
  "TAT": [
    {"pic_no": 1, "description": "A young technician calibrating a digital pyranometer sensor on a weather monitoring rooftop.", "image_url": "https://picsum.photos/seed/tat_set41_1/800/600"},
    {"pic_no": 2, "description": "A research engineer adjusting the liquid nitrogen feed valve of a super-conducting magnet.", "image_url": "https://picsum.photos/seed/tat_set41_2/800/600"},
    {"pic_no": 3, "description": "A group of NCC cadets clearing mud deposits from an ancient stepwell before heritage week.", "image_url": "https://picsum.photos/seed/tat_set41_3/800/600"},
    {"pic_no": 4, "description": "A student volunteer demonstrating organic farming certification steps to smallholders.", "image_url": "https://picsum.photos/seed/tat_set41_4/800/600"},
    {"pic_no": 5, "description": "A structural inspector checking tension rods on a newly completed railway signal mast.", "image_url": "https://picsum.photos/seed/tat_set41_5/800/600"},
    {"pic_no": 6, "description": "A flight cadet charting safe cruise elevations across a regional mountain pass layout.", "image_url": "https://picsum.photos/seed/tat_set41_6/800/600"},
    {"pic_no": 7, "description": "A mechanic replacing gear pinion bearings on a heavy industrial crane gear assembly.", "image_url": "https://picsum.photos/seed/tat_set41_7/800/600"},
    {"pic_no": 8, "description": "A student volunteer organizing fresh clean emergency sheets and hygiene packs at a medical camp.", "image_url": "https://picsum.photos/seed/tat_set41_8/800/600"},
    {"pic_no": 9, "description": "Two conservationists placing rock gabion boxes to create artificial fish shelter blocks.", "image_url": "https://picsum.photos/seed/tat_set41_9/800/600"},
    {"pic_no": 10, "description": "A farmer harvesting fresh sweet oranges in a hillside orchard using a cushioned collector basket.", "image_url": "https://picsum.photos/seed/tat_set41_10/800/600"},
    {"pic_no": 11, "description": "A port manager monitoring dry-dock shipping schedules on a central operations board.", "image_url": "https://picsum.photos/seed/tat_set41_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Pyranometer", "Nitrogen", "Stepwell", "Certification", "Pinion", "Cruise", "Bearings", "Gabion", "Oranges", "Dry-dock", 
    "Logistics", "Apex", "Bold", "Cope", "Drive", "Earn", "Firm", "Glow", "Hope", "Keen", 
    "Light", "Mild", "Neat", "Pure", "Rely", "Safe", "Trust", "Valor", "Warm", "Yield", 
    "Sovereign", "Hasten", "Grip", "Talon", "Glide", "Orbit", "Drill", "Vault", "Quell", "Rally", 
    "Blaze", "Forge", "Anchor", "Vessel", "Summit", "Plunge", "Vigour", "Robust", "Steady", "Ample", 
    "Sturdy", "Zenith", "Nadir", "Crest", "Flank", "Brave", "Calm", "Cheer", "Bright", "True"
  ],

  "SRT": [
    "He is leading a solar pyranometer installation team and a sudden lightning strike damages the sensor unit. He...",
    "His sister's final board exam reporting time falls on the exact morning of his crucial SSB spatial coordination check. He...",
    "He discovers his neighbors are storing large quantities of industrial chemical waste illegally in their basement. He...",
    "While riding a bicycle, he notices the high-voltage lines are touching a dry wooden fence, causing sparks. He...",
    "He is organizing a district sports championship and the main scoreboard displays incorrect results due to a software bug. He...",
    "He finds a lost smartphone containing active secure banking apps lying on an airport bus seat. He...",
    "He is preparing for his competitive entrance exam but a major water pipeline burst floods his study room. He...",
    "A swarm of wild wasps nests inside the engine compartment of his solar harvester, stopping it from starting. He...",
    "He is traveling on a highway bus and the driver faints due to a sudden cardiac arrest on a major flyover. He...",
    "He is accused of copying a research simulation prototype that he had developed through weeks of testing. He...",
    "He is coordinating a state volleyball league and the referee refuses to continue due to aggressive protests by a team coach. He...",
    "He is stuck in a passenger lift with an elderly person who starts showing symptoms of severe panic and breathing difficulty. He...",
    "He notices a local gas vendor tampering with the safety valves of domestic cylinders before delivery. He...",
    "He gets caught in a sudden severe hailstorm while riding a motorcycle on a remote highway route. He...",
    "He is selected to lead his university team in a national athletics meet but his sports kit is lost by the railway courier. He...",
    "He notices an illegal plastic smelting factory discharging toxic fumes behind a primary school. He...",
    "His project supervisor asks him to fabricate the structural load test reports of a bridge prototype. He...",
    "A passport officer delays issuing his passport verification certificate, hinting at an unofficial speed charge. He...",
    "He is staying at a high-altitude camp and his partner suffers from severe breathlessness at midnight. He...",
    "He presents a new mechanical motor layout and the panel labels it unoriginal and copied. He...",
    "He is trekking and his partner gets bit by a venomous snake on a remote mountain trail. He...",
    "He finds out a local shop is illegally selling protected wildlife specimens and hornbill feathers. He...",
    "While driving on a highway, he sees an industrial solvent tanker truck leak flammable fluid. He...",
    "He is assigned a group project where the teammate refuses to coordinate because they wanted their cousin on the team. He...",
    "His roommate decides to withdraw from university because they failed the main semester examination twice. He...",
    "He sees a group of boys throwing heavy metal pipes onto live overhead railway traction wires. He...",
    "He is working in a biology lab and a vial containing a highly toxic chemical breaks, spilling across the floor. He...",
    "He is falsely blamed for leaking confidential training logs of his university sports team. He...",
    "He is leading a park cleanup drive and the volunteers refuse to collect garbage from a muddy pond edge. He...",
    "While rafting in a fast river, his raft's side chamber gets a puncture from a sharp submerged root. He...",
    "He discovers his wallet and flight boarding pass are missing right before the security check-in gates. He...",
    "He finds a cloned social media portal soliciting emergency funds using his father's profile photo. He...",
    "He is in an ancient fort and notices visitors scratching names into historic wooden carvings. He...",
    "He is traveling and a sudden heavy rockfall completely blocks the single-lane mountain road ahead of him. He...",
    "His friend insists on launching high-speed commercial fireworks in a crowded residential colony. He...",
    "He is organizing a blood donation camp and the power fails, stopping all storage refrigeration units. He...",
    "He sees a pregnant lady struggle to carry a heavy market basket across a busy, uncoordinated highway lane. He...",
    "He is writing his final term exam and a heavy rainstorm starts leaking water directly onto his desk. He...",
    "He finds an injured migratory bird with a bleeding wing tangled in a wire fence near his farm. He...",
    "His college team is competing in a robotics event and the main microcontroller chip burns out during warm-up. He...",
    "He is trekking and his partner gets a deep cut on their heel from a sharp glass piece inside a river. He...",
    "He is preparing a strategic report and his storage drive gets corrupted, wiping out the document a day before. He...",
    "He sees a candidate attempting to copy answers from a neighbor's sheet during a crucial selection. He...",
    "He is riding a motorcycle and the clutch cable snaps on a busy flyover. He...",
    "He smells LPG gas coming from the closed basement kitchen of a housing society building. He...",
    "His project teammate presents their joint prototype as their individual work at a seminar. He...",
    "He is traveling on a motorcycle and the fuel tank springs a minor leak in a remote village area. He...",
    "He sees a co-passenger's nylon bag catch fire from a short circuit in a metro coach. He...",
    "He is asked to present a lecture on satellite communications on short notice due to an absent speaker. He...",
    "He is alone at night and hears someone trying to force open the main entrance door lock. He...",
    "He notices a major discrepancy in his bank passbook showing an incorrect large deduction. He...",
    "His friends try to pressure him into driving a modified, unsafe sports car on a public track. He...",
    "He is participating in a long-jump event and the landing pit sand is found to contain sharp gravel. He...",
    "He is stuck in a passenger lift with an elderly person who starts experiencing severe chest pain. He...",
    "He is in a forest sanctuary and spots a minor fire starting near a dry bamboo heap. He...",
    "He receives his SSB selection email only 18 hours before the reporting time due to a server error. He...",
    "He finds out his training partner is planning to drop out of the marathon due to an injury. He...",
    "He is riding a pillion and the rider starts driving on the wrong side of the busy highway. He...",
    "He finds an injured hawk with a broken wing near his school yard. He...",
    "He is attending a global defense summit and the presenter projects an incorrect national map. He..."
  ],

  "PPDT": {
    "image_url": "https://picsum.photos/seed/ppdt_set41/800/600?blur=5",
    "description": "Hazy picture of a young technician calibrating a digital pyranometer sensor on a weather monitoring rooftop."
  },

  "PI": [
    "How do you handle a lab instructor who frequently challenges your experimental observations in front of class?",
    "Tell me about a time you organized a volunteer drive to clear muddy silt from a local canal bank.",
    "What is your view on the military applications of high-resolution synthetic aperture radar (SAR) satellites?",
    "How do you manage your physical training performance under dense rainfall and muddy track conditions?",
    "Tell me about a time you stood up against biased sports selection parameters in your local municipal club.",
    "What are the key technical challenges in building scalable carbon capture and storage (CCS) facilities?",
    "How do you resolve a logistics bottleneck when two college departments need the exact same transport van?",
    "Tell me about a time you successfully helped a classmate overcome a severe anxiety episode during a project evaluation.",
    "If you are assigned to a team where the former coordinator works directly under you, how do you gain their collaboration?",
    "What is your opinion on the strategic role of Arctic passage regulations in global transport geopolitics?",
    "Tell me about a major family logistics task you completed during a sudden local high-voltage power failure.",
    "What does team coordination mean to you when executing a complex suspended cantilever obstacle crossing?",
    "What is the significance of the motto 'Duty and Determination' in your personal academic pursuits?",
    "How do you handle a classmate who has extreme creative vision but completely lacks structural accuracy?",
    "What role does emergency satellite telemetry play in predicting deep-ocean storm surge patterns?",
    "Tell me about a time you volunteered to coordinate safety queues during a crowded regional science fair.",
    "What are your views on India's strategic maritime partnership with South Asian littoral countries?",
    "If you are not selected, what backup careers in autonomous control systems or drone sensors have you planned?",
    "How do you handle a roommate who consistently takes credit for your shared library projects?",
    "What is the most demanding cycling expedition or survival mountaineering camp you have completed?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends or colleagues think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to develop in yourself?"
  ],

  "Lecturette": [
    "SAR Satellites: High-Resolution Synthetic Aperture Radar Frontiers",
    "Carbon Capture and Storage (CCS): Strategic Technical Hurdles",
    "Arctic Passage Regulations: Global Transport Geopolitics",
    "Satellite Telemetry in Deep-Ocean Storm Surge Predictions"
  ],

  "GD": [
    "Should the development of carbon capture and high-capacity storage systems be funded exclusively by local public entities, or should private conglomerates be granted unlimited patent titles to accelerate development?",
    "Does the rapid integration of blockchain architecture in state land registration databases reduce administrative corruption, or does it merely lead to systemic digital exclusion of rural populations?"
  ],

  "GPE": {
    "narrative": "You are a group of 6 forestry cadets visiting a high-altitude meteorological observatory. It is 0900 hours. A local forest ranger runs up to you with urgent news: 1. A sudden severe solar storm warning has been issued, and the main telemetry sensors (5 km North) must be recalibrated and secured in exactly 2 hours (1100 hours) to prevent a total communications blackout. 2. A research weather van has skidded off the icy road 6 km East, and 3 scientists are injured and trapped inside. The nearest medical camp is 8 km away. 3. A pack of endangered wild wolves is caught in a poacher's wire net 3 km South near an avalanche zone. You have a rugged snow jeep (seats 5), some tow cables, a medical kit, and a satellite radio. The base station is 12 km away. How will you divide your group and prioritize these tasks to ensure the telemetry sensors are secured, the scientists are rescued, and the wild wolves are released before 1100 hours?",
    "map_url": "https://picsum.photos/seed/gpe_map_set41/800/600"
  },

  "GTO": {
    "PGT": "Progressive Group Task: 4 progressive obstacles requiring heavy cantilever structures to cross high walls. Resources: 1 long Plank, 1 short Balli, 2 Ropes, 1 steel pipe. Time: 40 mins.",
    "HGT": "Half Group Task: 1 complex obstacle involving crossing a suspended wooden platform. Resources: 1 Plank, 1 Balli, 1 Rope. Time: 15 mins.",
    "IO": "Individual Obstacles: 10 standard GTO obstacles including the Tiger Leap. Time: 3 mins.",
    "FGT": "Final Group Task: A coordinated team effort to transport a heavy gas cylinder across the final defensive line. Resources: 1 Plank, 1 Balli, 2 Ropes. Time: 15 mins."
  },

  "CPSS": [
    "Spatial orientation: If the slip indicator ball is deflected to the left during a left turn, how should you correct the rudder?",
    "Artificial Horizon: The horizon bar is pitched down 15 degrees and banked 45 degrees to the left. Describe the aircraft's current attitude.",
    "Altimeter Reading: Read the altimeter showing the 10,000-ft pointer at 9, the 1,000-ft pointer at 1, and the 100-ft pointer at 5. What is the current altitude?",
    "Instrument Landing System: The localizer needle is deflected to the right and the glide slope needle is centered. Where is the aircraft relative to the correct glide path?",
    "Visual Spatial Reasoning: An unfolded 2D pattern shaped like a cross has faces marked 1 to 6. If folded into a 3D cube, which face will be opposite to 4?",
    "Cognitive Memory Challenge: Study the radar display featuring 6 aircraft tracks for 5 seconds. Identify which track number has changed its bearing.",
    "Compass Heading: The aircraft is heading 090 degrees (East). You receive a command to make a standard rate turn to a heading of 180 degrees. How many degrees of turn are required?",
    "Multi-tasking Psychomotor Test: Maintain the flight simulator joystick within the target green circle while solving basic subtraction problems on the Head-Up Display (HUD).",
    "Aircraft Recognition: Identify the silhouette of the Mirage 2000 fighter aircraft based on its clean delta wing and lack of canards.",
    "Reaction Time & Auditory Vigilance: Press the missile launch button within 250 milliseconds only when the radar target locks (turns green) and a high-pitch warning beep is heard."
  ]
}

with open(os.path.join(OUTPUT_DIR, "set_41.json"), 'w', encoding='utf-8') as f:
    json.dump(set_41_data, f, indent=2)

print("Set 41 created successfully with CPSS.")
