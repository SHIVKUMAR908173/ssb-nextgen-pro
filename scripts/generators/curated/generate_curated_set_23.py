import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_23_data = {
  "set_id": "SET_23",
  "description": "High-Quality Curated SSB Dataset - Set 23",
  "TAT": [
    {"pic_no": 1, "description": "A young conservation officer showing forest canopy levels and sapling types to school students in a park.", "image_url": "https://picsum.photos/seed/tat_set23_1/800/600"},
    {"pic_no": 2, "description": "An electronics technician testing printed circuit boards with high precision digital multimeters in a lab.", "image_url": "https://picsum.photos/seed/tat_set23_2/800/600"},
    {"pic_no": 3, "description": "A group of NCC cadets clearing wild brambles to establish a broad trekking path through a hill segment.", "image_url": "https://picsum.photos/seed/tat_set23_3/800/600"},
    {"pic_no": 4, "description": "A medical representative demonstrating portable pulse oximeters to nurses in a primary health care clinic.", "image_url": "https://picsum.photos/seed/tat_set23_4/800/600"},
    {"pic_no": 5, "description": "A design engineer adjusting structural components of a solar powered crop dryer in a field.", "image_url": "https://picsum.photos/seed/tat_set23_5/800/600"},
    {"pic_no": 6, "description": "An instructor demonstrating basic field map drawing to cadets sitting in a semi-circle under a tree.", "image_url": "https://picsum.photos/seed/tat_set23_6/800/600"},
    {"pic_no": 7, "description": "A pilot checking fuel transfer valve couplings near the wing tip of a twin engine trainer aircraft.", "image_url": "https://picsum.photos/seed/tat_set23_7/800/600"},
    {"pic_no": 8, "description": "A student volunteering to help senior citizens learn secure digital banking on their mobile phones.", "image_url": "https://picsum.photos/seed/tat_set23_8/800/600"},
    {"pic_no": 9, "description": "Two marine biologists checking underwater acoustic tracking hydrophones from a small inflatable boat.", "image_url": "https://picsum.photos/seed/tat_set23_9/800/600"},
    {"pic_no": 10, "description": "A woman inspecting tray stacks of organic button mushrooms in a temperature controlled nursery shed.", "image_url": "https://picsum.photos/seed/tat_set23_10/800/600"},
    {"pic_no": 11, "description": "A volunteer rescue team distributing dry food items and drinking water bottles to stranded flood survivors.", "image_url": "https://picsum.photos/seed/tat_set23_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Goal", "Aim", "Focus", "Path", "Track", "Road", "Way", "Turn", "Bend", "Curve", 
    "Lean", "Tilt", "Sway", "Drift", "Flow", "Wave", "Tide", "Surge", "Rise", "Soar", 
    "Ascend", "Mount", "Climb", "Scale", "Reach", "Peak", "High", "Tall", "Lofty", "Grand", 
    "Noble", "Just", "Fair", "Equal", "Right", "True", "Pure", "Clean", "Neat", "Trim", 
    "Tidy", "Snug", "Warm", "Mild", "Placid", "Calm", "Quiet", "Soft", "Kind", "Gentle", 
    "Help", "Aid", "Save", "Heal", "Cure", "Mend", "Fix", "Patch", "Build", "Forge", "Carve"
  ],

  "SRT": [
    "He is leading a river rafting trip and their guide gets swept away by a sudden rogue rapid. He...",
    "His sister's final civil services physical exam falls on the exact day of his crucial SSB interview. He...",
    "He discovers his neighbors are storing large volumes of commercial fireworks in a residential basement. He...",
    "While driving on a flyover, he notices the safety crash barriers on a sharp curve have completely rusted and given way. He...",
    "He is organizing a district sports meet and a sudden downpour waterlogs the main running tracks. He...",
    "He finds a gold necklace in a public park seat cushion. He...",
    "He is studying for a competitive exam but his neighborhood hosts a loud week-long street festival with high volume speakers. He...",
    "A swarm of hornets builds a nest inside his car's engine bay, preventing him from starting the vehicle. He...",
    "He is on an interstate bus and the bus gets stranded on a flooded bridge with fast rising water. He...",
    "He is accused of copying a mechanical design, which he had drafted and fabricated in his own college workshop. He...",
    "He is coordinating a youth soccer match and the main team refuses to play unless their suspended player is allowed on the field. He...",
    "He is stuck in a high-rise passenger lift that stops due to grid failure, and the emergency call button is not working. He...",
    "He notices a milk vendor diluting milk cans with pond water before distributing them in the colony. He...",
    "He gets caught in a sudden torrential hailstorm while driving an open tractor in a remote field. He...",
    "He is selected for a defense technical seminar but his team's prototype gets damaged in transit a day before. He...",
    "He notices a local pharmaceutical plant dumping untreated acidic wastewater directly into a public park canal. He...",
    "His close cousin asks him to help forge academic certificates to apply for a private job. He...",
    "A local police officer delays verifying his passport application, hinting at an unofficial speed fee. He...",
    "He is staying at a remote camp and his team leader gets a high-grade fever with severe chills at midnight. He...",
    "He presents an agricultural sensor project and the evaluator claims the circuit design is copied from an online blog. He...",
    "He is trekking and his companion falls down a rocky slope, spraining both wrists. He...",
    "He finds out his neighbor is keeping a poached peacock in a small cage in their backyard. He...",
    "While driving on a state highway, he sees an oil tanker truck leak flammable fluid across both lanes. He...",
    "He is assigned a group project with a team member who is extremely lazy and refuses to respond to messages. He...",
    "His roommate is extremely depressed after failing to clear his final year engineering placement interview. He...",
    "He sees a group of children playing with high-voltage wires using a long bamboo stick. He...",
    "He is working on his laptop and the lithium battery starts expanding and smoking on his desk. He...",
    "He is falsely blamed for leaking confidential training data of his college startup team. He...",
    "He is leading a trek and the team members refuse to walk further due to sudden heavy rainfall. He...",
    "While boating in a lake, the boat's propeller gets entangled in discarded thick plastic nets, stopping the engine. He...",
    "He discovers his laptop bag was stolen from his seat while he was asleep in a running train. He...",
    "He finds a cloned social media account using his father's profile picture to solicit urgent loans. He...",
    "He is in a historical monument and notices a visitor scratching names on a heritage wall. He...",
    "He is traveling and a sudden mudslide blocks his car's path on a narrow cliff road. He...",
    "His friend insists on driving a speedboat at night without any navigation lights. He...",
    "He is organizing a tree plantation drive and the delivery truck drops the saplings 5 km away. He...",
    "He sees a visually impaired student struggle to locate their exam hall in a massive campus. He...",
    "He is writing his final term exam and a heavy rainstorm starts leaking water directly onto his desk. He...",
    "He finds a massive hornet's nest inside his store room. He...",
    "His team is competing in a robotic event and the main micro-controller chips burn out during warm up. He...",
    "He is trekking and his partner gets a deep cut on their heel from a sharp glass piece inside a river. He...",
    "He is preparing a technical report and his storage drive gets corrupted, wiping out the document a day before. He...",
    "He sees a candidate attempting to copy answers from a neighbor's sheet during a crucial selection. He...",
    "He is riding a motorcycle and the gear shifter gets jammed in second gear on a crowded highway. He...",
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
    "image_url": "https://picsum.photos/seed/ppdt_set23/800/600?blur=5",
    "description": "Hazy picture of a young conservation officer showing forest canopy levels and sapling types to school students in a park."
  },

  "PI": [
    "How do you resolve a professional disagreement with a colleague who has a completely opposite temperament to yours?",
    "Tell me about a time you had to organize a complex technical event with zero budget and resources.",
    "What is your view on the security challenges posed by modern deep-sea drone systems?",
    "How do you maintain your focus when preparing for multiple high-stakes exams simultaneously?",
    "Tell me about a time you had to defend a classmate who was being unfairly targeted by the administration.",
    "What are the key security challenges India faces regarding drone threats at its borders?",
    "How do you prioritize your spending and manage your budget when your pocket money is limited?",
    "Tell me about a time you had to learn a highly complex scientific tool or software within 48 hours.",
    "If you are assigned a team where the members have extremely low morale, how do you motivate them?",
    "What is your opinion on the geopolitical impact of lithium mining in Jammu and Kashmir?",
    "Tell me about a major family decision where your recommendation was accepted over a senior's view.",
    "Why do you believe you have the emotional stability needed for high-risk operations?",
    "What is the difference between physical courage and moral courage, in your own words?",
    "How do you manage a situation where your project teammate is highly competent but refuses to collaborate?",
    "What role does strategic patience play in achieving long-term goals?",
    "Tell me about a time you volunteered to manage traffic or crowds during a local festival.",
    "What are your views on India's bilateral relations with East Asian nations like Japan and South Korea?",
    "If you are not selected, what specific improvements will you make before your next attempt?",
    "How do you deal with a friend who is constantly trying to drag you into unhealthy lifestyle choices?",
    "What is the most challenging Group Discussion or debate you have ever participated in?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends or colleagues think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to develop in yourself?"
  ],

  "Lecturette": [
    "The Threat of Drone Warfare at India's Borders",
    "Geopolitical Significance of Lithium Deposits in J&K",
    "India's Strategic Partnerships with Japan and South Korea",
    "The Importance of Strategic Patience in Leadership"
  ],

  "GD": [
    "Should the use of facial recognition technology by law enforcement be strictly regulated, or does it maximize public safety?",
    "Is the shift towards electric vehicles happening too fast for India's infrastructure, or is it a necessary push?"
  ],

  "GPE": {
    "narrative": "You are a group of 6 engineering cadets visiting a high-yield agricultural research station in a valley. It is 1300 hours. A local farmer runs up to you with urgent news: 1. A sudden canal overflow warning has been issued, and the main seed storage warehouse (4 km North) will be flooded in exactly 2 hours (1500 hours), ruining tons of hybrid seeds. 2. A passenger bus has skidded off the wet road 5 km East, and 6 villagers are trapped inside a ravine stream. The nearest hospital is 10 km away. 3. A rare peacock conservation enclosure has been breached by wild boars 3 km South, threatening the birds. You have a rugged pickup truck (seats 5), some ropes, sand bags, a first aid box, and one satellite radio. The base station is 10 km away. How will you divide your group and prioritize these tasks to ensure the seeds are saved, the villagers are rescued, and the peacocks are secured before 1500 hours?",
    "map_url": "https://picsum.photos/seed/gpe_map_set23/800/600"
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

with open(os.path.join(OUTPUT_DIR, "set_23.json"), 'w', encoding='utf-8') as f:
    json.dump(set_23_data, f, indent=2)

print("Set 23 created successfully with CPSS.")
