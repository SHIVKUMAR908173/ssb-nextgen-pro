import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_26_data = {
  "set_id": "SET_26",
  "description": "High-Quality Curated SSB Dataset - Set 26",
  "TAT": [
    {"pic_no": 1, "description": "A young meteorologist analyzing weather charts and storm tracks with senior colleagues at a radar terminal.", "image_url": "https://picsum.photos/seed/tat_set26_1/800/600"},
    {"pic_no": 2, "description": "A civil engineer checking structural concrete density with an ultrasonic detector at a bridge site.", "image_url": "https://picsum.photos/seed/tat_set26_2/800/600"},
    {"pic_no": 3, "description": "A group of NCC cadets digging channels to guide rain overflow away from a village school courtyard.", "image_url": "https://picsum.photos/seed/tat_set26_3/800/600"},
    {"pic_no": 4, "description": "A healthcare worker demonstrating correct vaccine cold-chain maintenance to rural health center staff.", "image_url": "https://picsum.photos/seed/tat_set26_4/800/600"},
    {"pic_no": 5, "description": "A design engineer adjusting high-gain telemetry antennas on a remote coastal observation tower.", "image_url": "https://picsum.photos/seed/tat_set26_5/800/600"},
    {"pic_no": 6, "description": "An instructor demonstrating basic compass bearing mapping to cadets seated around a model sand table.", "image_url": "https://picsum.photos/seed/tat_set26_6/800/600"},
    {"pic_no": 7, "description": "A pilot checking primary hydraulic actuator seals near the landing gear of a transport aircraft.", "image_url": "https://picsum.photos/seed/tat_set26_7/800/600"},
    {"pic_no": 8, "description": "A student volunteering to lead a digital bank account awareness camp for village handicraft artisans.", "image_url": "https://picsum.photos/seed/tat_set26_8/800/600"},
    {"pic_no": 9, "description": "Two marine biologists placing metal grid domes to secure growing seaweed nursery plants in a lagoon.", "image_url": "https://picsum.photos/seed/tat_set26_9/800/600"},
    {"pic_no": 10, "description": "A woman carefully picking premium fresh yellow mangoes in an orchard using a mesh picking pole.", "image_url": "https://picsum.photos/seed/tat_set26_10/800/600"},
    {"pic_no": 11, "description": "A volunteer rescue team organizing survival rations and first aid kits on a flooded town lane.", "image_url": "https://picsum.photos/seed/tat_set26_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Chart", "Sonic", "Slab", "Trench", "Vial", "Tower", "Scope", "Loom", "Reef", "Ration", 
    "Brave", "Firm", "Stout", "Bold", "Wild", "Calm", "Cool", "Placid", "Mild", "Warm", 
    "Cheer", "Bright", "Glow", "Light", "Hope", "Trust", "True", "Sinc", "Pure", "Clean", 
    "Neat", "Trim", "Tidy", "Snug", "Safe", "Sure", "Rely", "Equal", "Just", "Fair", 
    "Right", "Aim", "Step", "Pace", "Walk", "Run", "Leap", "Jump", "Bound", "Rise", 
    "Grow", "Build", "Form", "Shape", "Swift", "Fast", "Speed", "Quick", "Smart", "Wise"
  ],

  "SRT": [
    "He is leading a meteorology survey team and a sudden lightning strike damages their main telemetry antenna. He...",
    "His younger sister's medical counseling registration falls on the exact day of his crucial SSB technical interview. He...",
    "He discovers his neighbors are storing unauthorized commercial fertilizer chemicals in a residential garage. He...",
    "While driving on a mountain road, he notices a protective retaining wall has started to buckle near a sharp hairpin turn. He...",
    "He is organizing a district science fair and the main computer network server gets hacked, deleting the model registry. He...",
    "He finds a leather wallet containing highly sensitive defense access cards lying on a railway platform bench. He...",
    "He is preparing for a crucial national exam but his neighbors operate a loud woodworking lathe throughout the night. He...",
    "A swarm of wild wasps builds a nest inside the exhaust valve of his community tube-well generator, stopping it from starting. He...",
    "He is traveling on a state transport bus and the driver faints due to sudden low blood pressure on a highway curve. He...",
    "He is accused of plagiarizing a research presentation that he had prepared based on four months of original survey data. He...",
    "He is coordinating a district football league and the main referee refuses to continue due to aggressive crowd behavior. He...",
    "He is stuck in a passenger lift with an elderly person who starts showing signs of a panic attack as the elevator stops. He...",
    "He notices a local milk distributor tampering with the seal of municipal milk packets before delivery. He...",
    "He gets caught in a sudden severe dust storm while riding a bicycle on a single-lane rural road. He...",
    "He is selected to lead his university team in a national aerospace project but his laptop crashes, losing the CAD files a day before. He...",
    "He notices a municipal waste collection truck dumping domestic waste directly into a freshwater lake basin. He...",
    "His project supervisor asks him to approve a low-quality sensor batch to avoid project delay. He...",
    "A university clerk delays issuing his graduation transcripts, hinting that an unofficial processing charge is required. He...",
    "He is staying at a remote camp and his teammate gets a high fever with severe abdominal pain at midnight. He...",
    "He presents an electric vehicle battery prototype and the panel labels it unoriginal and unworkable. He...",
    "He is trekking and his partner gets bit by a wild monkey on a remote hill trail. He...",
    "He finds out a neighbor is selling wild peacock feathers and taxidermy specimens online. He...",
    "While driving on a state highway, he sees a heavy container truck crash and slide sideways, blocking both lanes. He...",
    "He is assigned a group project where the teammate refuses to coordinate because they wanted their relative to join the team. He...",
    "His close friend decides to drop out of engineering because they failed the main semester examination twice. He...",
    "He sees a group of children throwing stones at live overhead power lines in a residential colony. He...",
    "He is working on his laptop and the lithium battery pack begins to expand and emit strong chemical smoke. He...",
    "He is falsely blamed for leaking confidential training schedule details of his university sports team. He...",
    "He is leading a public park planting drive and the volunteers refuse to plant saplings on a steep, muddy slope. He...",
    "While boating in a lake, the boat's propeller gets entangled in discarded thick plastic nets, stopping the engine. He...",
    "He discovers his laptop bag containing his engineering project was stolen from his seat while he was asleep in a running train. He...",
    "He finds a cloned social media account using his father's profile picture to solicit urgent cash from relatives. He...",
    "He is in a state archive room and notices a visitor tearing pages from a rare historical manuscript. He...",
    "He is traveling and a sudden heavy landslide completely blocks his car's path on a narrow cliff road. He...",
    "His friend insists on driving a high-speed motorcycle on a busy city footpath to bypass traffic. He...",
    "He is organizing a blood donation camp and the power fails, stopping all storage refrigeration units. He...",
    "He sees a visually impaired student struggle to locate their examination hall in a massive campus. He...",
    "He is writing his final term exam and a heavy rainstorm starts leaking water directly onto his desk. He...",
    "He finds a wild hawk with a bleeding leg caught in a wire fence near his farm. He...",
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
    "image_url": "https://picsum.photos/seed/ppdt_set26/800/600?blur=5",
    "description": "Hazy picture of a young meteorologist analyzing weather charts and storm tracks with senior colleagues at a radar terminal."
  },

  "PI": [
    "How do you handle a team member who consistently fails to meet their deadlines due to lack of skill?",
    "Tell me about a time you organized a volunteer campaign on a very short notice of 24 hours.",
    "What is your view on the security challenges of maritime drone swarms in coastal defense?",
    "How do you structure your study schedule when preparing for highly rigorous conceptual exams?",
    "Tell me about a time you had to report a close friend who committed an academic infraction.",
    "What are the key operational differences between surface-to-air missiles and air-to-air missiles?",
    "How do you handle peer pressure related to joining social drinking groups in college?",
    "Tell me about a time you learned a highly complex manufacturing technique or lab process within a week.",
    "If you are assigned to a project where the team morale is low due to a previous failure, how do you revive it?",
    "What is your opinion on the geopolitical implications of micro-satellite constellations in modern warfare?",
    "Tell me about a major family medical crisis where you had to make all the financial decisions.",
    "What is the difference between physical strength and physical endurance, in your own words?",
    "What is the significance of the air force motto 'Nabhah Sprisham Deeptam' in your own conduct?",
    "How do you manage a team member who is highly creative but refuses to adhere to safety protocols?",
    "What role does tactical maneuverability play in winning modern mountain combat?",
    "Tell me about a time you volunteered to assist during a national election at a polling station.",
    "What are your views on India's strategic partnerships with Mediterranean countries?",
    "If you are selected, how do you plan to utilize your engineering training in the electrical branch?",
    "How do you deal with a peer who is consistently negative and dismissive of your aspirations?",
    "What is the most challenging swimming or athletics tournament you have ever participated in?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends or colleagues think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to develop in yourself?"
  ],

  "Lecturette": [
    "The Role of Maritime Drone Swarms in Modern Coastal Defense",
    "Geopolitical Implications of Micro-Satellite Constellations",
    "India's Strategic Partnerships with Mediterranean Countries",
    "The Distinction Between Physical Strength and Physical Endurance"
  ],

  "GD": [
    "Should high-precision drone technology be strictly regulated globally, or is it an inevitable tool of modern agricultural efficiency?",
    "Does the rapid adoption of hydrogen fuel cell vehicles solve transport emission challenges, or is it a distraction from battery electric vehicle systems?"
  ],

  "GPE": {
    "narrative": "You are a group of 6 technical cadets visiting a high-altitude radar observation station. It is 1000 hours. A local meteorological ranger runs up to you with urgent news: 1. A sudden severe solar storm warning has been issued, and the main telemetry antennas (5 km North) must be recalibrated and secured in exactly 2 hours (1200 hours) to prevent a total communications blackout. 2. A research weather van has skidded off the icy road 6 km East, and 3 scientists are injured and trapped inside. The nearest medical camp is 8 km away. 3. A pack of endangered wild wolves is caught in a poacher's wire net 3 km South near an avalanche zone. You have a rugged snow jeep (seats 5), some tow cables, a medical kit, and a satellite radio. The base station is 12 km away. How will you divide your group and prioritize these tasks to ensure the telemetry antennas are secured, the scientists are rescued, and the wild wolves are released before 1200 hours?",
    "map_url": "https://picsum.photos/seed/gpe_map_set26/800/600"
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

with open(os.path.join(OUTPUT_DIR, "set_26.json"), 'w', encoding='utf-8') as f:
    json.dump(set_26_data, f, indent=2)

print("Set 26 created successfully with CPSS.")
