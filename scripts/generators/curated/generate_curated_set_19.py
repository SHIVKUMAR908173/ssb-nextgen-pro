import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_19_data = {
  "set_id": "SET_19",
  "description": "High-Quality Curated SSB Dataset - Set 19",
  "TAT": [
    {"pic_no": 1, "description": "An archeologist carefully brushing dust off a large ancient stone carving at an excavation site.", "image_url": "https://picsum.photos/seed/tat_set19_1/800/600"},
    {"pic_no": 2, "description": "A young mechanical engineer adjusting the joint of a robotic arm inside an automation workshop.", "image_url": "https://picsum.photos/seed/tat_set19_2/800/600"},
    {"pic_no": 3, "description": "A group of scouts digging trenches to divert storm water away from a village school.", "image_url": "https://picsum.photos/seed/tat_set19_3/800/600"},
    {"pic_no": 4, "description": "A rescue volunteer in high-visibility gear guiding residents away from a landslide area.", "image_url": "https://picsum.photos/seed/tat_set19_4/800/600"},
    {"pic_no": 5, "description": "A dental officer showing proper tooth brushing models to primary school children in a classroom.", "image_url": "https://picsum.photos/seed/tat_set19_5/800/600"},
    {"pic_no": 6, "description": "An instructor showing mountain survival gear and harness ropes to a group of cadets.", "image_url": "https://picsum.photos/seed/tat_set19_6/800/600"},
    {"pic_no": 7, "description": "A pilot checking the exterior wing control surfaces of a trainer jet on a sunny tarmac.", "image_url": "https://picsum.photos/seed/tat_set19_7/800/600"},
    {"pic_no": 8, "description": "A student organizing a digital training session for senior citizens at a computer center.", "image_url": "https://picsum.photos/seed/tat_set19_8/800/600"},
    {"pic_no": 9, "description": "Two marine biologists taking water samples from a coastal cove near a small motor boat.", "image_url": "https://picsum.photos/seed/tat_set19_9/800/600"},
    {"pic_no": 10, "description": "A woman carefully planting high-yield hybrid rice saplings in a green waterlogged field.", "image_url": "https://picsum.photos/seed/tat_set19_10/800/600"},
    {"pic_no": 11, "description": "A volunteer team setting up tents at a dry rescue camp for displaced refugees.", "image_url": "https://picsum.photos/seed/tat_set19_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Pact", "Hold", "Firm", "Stout", "Tough", "Hard", "Soft", "Kind", "Help", "Aid", 
    "Save", "Guard", "Defend", "Shield", "Secure", "Warm", "Bright", "Glow", "Light", "Cheer", 
    "Hope", "Trust", "Faith", "Devote", "Serve", "Duty", "Work", "Play", "Game", "Win", 
    "Gain", "Grow", "Build", "Form", "Shape", "Swift", "Fast", "Speed", "Quick", "Smart", 
    "Wise", "Alert", "Ready", "Clean", "Pure", "True", "Sinc", "Heart", "Soul", "Mind", 
    "Brain", "Sharp", "Bold", "Brave", "Valor", "Glory", "Honor", "Pride", "Strive", "Rise"
  ],

  "SRT": [
    "He is cycling and one rider slips on wet gravel and breaks his collarbone. He...",
    "His sister falls sick on the day of his crucial flying test. He...",
    "He discovers his close relative is selling adulterated food. He...",
    "He notices a large crack in the flyover support pillar. He...",
    "He is organizing a college tech fest and the key sponsor backs out. He...",
    "He finds a gold necklace wrapped in a handkerchief on a park bench. He...",
    "He is studying for exams and the neighbor plays loud dance music. He...",
    "A snake enters his living room, trapping his grandmother inside. He...",
    "He is on a bus and the driver falls unconscious while driving. He...",
    "He is accused of copying a thesis, which he wrote based on his own lab trials. He...",
    "He is conducting a sports event and the ground staff goes on strike. He...",
    "He is stuck in a lift due to power failure and a co-passenger starts crying in panic. He...",
    "He notices a petrol pump dispensing less fuel than registered. He...",
    "He gets caught in a dense sandstorm while driving his jeep across the desert. He...",
    "He is selected for a debate but gets a throat infection a day before. He...",
    "He notices a factory dumping toxic chemicals into the municipal canal. He...",
    "His uncle asks him to secure a fake license for his truck business. He...",
    "A clerk delays clearing his water connection, hinting at a bribe. He...",
    "He is staying at a hotel and his guide has high fever at midnight. He...",
    "He presents a code program and the professor calls it plagiarized. He...",
    "He is trekking and his companion suffers severe high-altitude vomiting. He...",
    "He finds out that his neighbor is keeping a poached wild bird in a cage. He...",
    "He sees a speed boat trailer overturn, blocking both highway lanes. He...",
    "He is assigned a group project with a classmate who only criticizes but does no work. He...",
    "His friend is depressed after losing his scholarship due to a minor grading error. He...",
    "He sees teenagers throwing stones at streetdogs. He...",
    "He is working on his laptop and the battery swells, smelling of strong chemical fumes. He...",
    "He is falsely accused of leaking class test papers to his close friends. He...",
    "He is leading a volunteer team and members refuse to work under the local supervisor. He...",
    "While boating, the boat springs a leak and water begins to rise quickly. He...",
    "He notices his backpack was picked while paying for his ticket in a crowded station. He...",
    "He finds a fake commercial website using his father's shop details to scam buyers. He...",
    "He is in a museum and notices a visitor attempting to scratch a historical artifact. He...",
    "He is on a journey and a heavy rock falls, blocking his path on a narrow cliff road. He...",
    "His younger brother insists on driving the scooter without a valid learner's license. He...",
    "He is organizing a blood camp and the doctor's team arrives two hours late. He...",
    "He sees an elderly lady struggle to cross a busy road with heavy shopping bags. He...",
    "He is writing an exam and a heavy rainstorm starts blowing water through the open windows, wetting his desk. He...",
    "He finds a large wasp nest inside his post box. He...",
    "His team is playing a tournament match and their internet connection starts dropping packets frequently. He...",
    "He is on a trek and his teammate gets a deep puncture wound on his heel from a rusty nail. He...",
    "He is preparing a digital project and his hard drive gets corrupted, wiping out his slides. He...",
    "He sees a candidate using a micro-camera to transmit exam questions during a national selection. He...",
    "He is riding a motorcycle and the front tire suddenly blows out while descending a flyover. He...",
    "He notices a strong smell of gas coming from the utility room of a locked commercial store. He...",
    "His project partner takes sole credit for a patent application they developed jointly. He...",
    "He is traveling and the car's fuel line starts leaking in a remote forest area. He...",
    "He sees a passenger's jacket catch fire from a stray firework during a holiday celebration. He...",
    "He is asked to deliver a technical presentation on short notice due to an absent speaker. He...",
    "He is at home and hears someone trying to break open the backyard window grill. He...",
    "He finds a severe error in his credit card bill showing a large unauthorized purchase. He...",
    "His friends try to pressure him into trying synthetic drugs during a hostel party. He...",
    "He is participating in a hurdles race and the final hurdle is placed at an incorrect height. He...",
    "He is stuck in a passenger lift with an expectant mother who starts experiencing labor pains. He...",
    "He is in a forest and spots a minor fire spreading near a dry pine needle heap. He...",
    "He receives his SSB call letter only 24 hours before the reporting time due to a postal delay. He...",
    "He finds out his classmate is planning to drop out of college because they cannot afford the tuition fees. He...",
    "He is riding a pillion on a scooter and the rider starts driving on the footpath to bypass traffic. He...",
    "He finds an injured owl with a broken wing near his garden gate. He...",
    "He is attending a technical conference and the host makes a highly controversial map representation. He..."
  ],

  "PPDT": {
    "image_url": "https://picsum.photos/seed/ppdt_set19/800/600?blur=5",
    "description": "Hazy picture of two researchers taking water samples near a riverbank conservation site."
  },

  "PI": [
    "How do you manage your emotions when receiving highly unfair criticism?",
    "Tell me about a time you had to coordinate a large group of volunteers under extreme time pressure.",
    "What is your view on the security challenges posed by maritime piracy in the Arabian Sea?",
    "How do you keep yourself mentally agile and physically fit during long academic exams?",
    "Tell me about a time you had to mediate a financial dispute between two close friends.",
    "What are the most significant technological breakthroughs India has achieved in the past decade?",
    "How do you allocate your pocket money and manage your monthly budget?",
    "Tell me about a time you had to learn a highly complex physical skill, like swimming or driving, under stress.",
    "If you are given a project with highly ambiguous requirements, how do you proceed?",
    "What is your opinion on the security implications of advanced quantum computing on military encryption?",
    "Tell me about a major decision in your family where your active input was sought and implemented.",
    "Why do you want to join the Armed Forces instead of pursuing a high-paying corporate job?",
    "What is the difference between active listening and passive hearing, in your own words?",
    "How do you handle a team member who is consistently underperforming because of personal issues?",
    "What role does integrity play in everyday leadership and team interactions?",
    "Tell me about a time you organized a local clean-up or plantation drive in your sector.",
    "What are your views on India's partnership with neighboring countries in the Indian Ocean?",
    "If you are not selected in this attempt, what specific steps will you take to prepare for your next attempt?",
    "How do you handle a situation where your parents disagree with your long-term career aspirations?",
    "What is the most daring rescue or emergency situation you have ever personally managed?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends or colleagues think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to develop in yourself?"
  ],

  "Lecturette": [
    "The Future of Green Hydrogen in Indian Transport",
    "Challenges of Cybersecurity in Modern Power Grids",
    "The Importance of Polar Research and India's Arctic Missions",
    "Role of Youth in Disaster Mitigation and Relief"
  ],

  "GD": [
    "Is the growth of online streaming platforms a threat to traditional cinema, or does it expand creative avenues?",
    "Should public healthcare be completely free for all citizens, or does it lead to system inefficiency?"
  ],

  "GPE": {
    "narrative": "You are a group of 6 engineering students visiting a solar power plant in a remote valley. It is 1300 hours. A local herder runs up to you with urgent news: 1. A sudden wild flash flood warning has been issued for the valley, and the high-voltage transmission lines (4 km North) will be submerged in exactly 2 hours (1500 hours), threatening a major grid collapse. 2. A school bus has skidded off the wet road 5 km East, and 6 children are trapped inside the vehicle suspended near a deep ravine. 3. A group of wild animal poachers has trapped a rare snow leopard in a steel cage 3 km South. You have a rugged utility truck (seats 5), some steel cables, a first aid box, and one satellite phone. The power grid control office is 10 km away. How will you divide your group and prioritize these tasks to ensure the children are rescued, the grid collapse is averted, and the trapped leopard is released before 1500 hours?",
    "map_url": "https://picsum.photos/seed/gpe_map_set19/800/600"
  },

  "GTO": {
    "PGT": "Progressive Group Task: 4 progressive obstacles requiring heavy cantilever structures to cross high walls. Resources: 1 long Plank, 1 short Balli, 2 Ropes, 1 steel pipe. Time: 40 mins.",
    "HGT": "Half Group Task: 1 complex obstacle involving crossing a suspended wooden platform. Resources: 1 Plank, 1 Balli, 1 Rope. Time: 15 mins.",
    "IO": "Individual Obstacles: 10 standard GTO obstacles including the Tiger Leap. Time: 3 mins.",
    "FGT": "Final Group Task: A coordinated team effort to transport a heavy gas canister across the final defensive line. Resources: 1 Plank, 1 Balli, 2 Ropes. Time: 15 mins."
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

with open(os.path.join(OUTPUT_DIR, "set_19.json"), 'w', encoding='utf-8') as f:
    json.dump(set_19_data, f, indent=2)

print("Set 19 created successfully with CPSS.")
