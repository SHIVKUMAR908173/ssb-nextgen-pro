import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_20_data = {
  "set_id": "SET_20",
  "description": "High-Quality Curated SSB Dataset - Set 20",
  "TAT": [
    {"pic_no": 1, "description": "A young geologist in protective gear measuring rock strata layers on a steep canyon wall.", "image_url": "https://picsum.photos/seed/tat_set20_1/800/600"},
    {"pic_no": 2, "description": "A team of students testing an autonomous quadcopter drone's indoor obstacle avoidance system.", "image_url": "https://picsum.photos/seed/tat_set20_2/800/600"},
    {"pic_no": 3, "description": "A group of NCC cadets clearing dry leaves and shrubs to establish a safe fire line around a camp.", "image_url": "https://picsum.photos/seed/tat_set20_3/800/600"},
    {"pic_no": 4, "description": "A medical student explaining preventive healthcare charts to villagers under a large banyan tree.", "image_url": "https://picsum.photos/seed/tat_set20_4/800/600"},
    {"pic_no": 5, "description": "A design engineer adjusting structural members of a solar powered irrigation pump in a field.", "image_url": "https://picsum.photos/seed/tat_set20_5/800/600"},
    {"pic_no": 6, "description": "An instructor demonstrating artificial respiration techniques to a class of civil defense trainees.", "image_url": "https://picsum.photos/seed/tat_set20_6/800/600"},
    {"pic_no": 7, "description": "A Coast Guard rescue boat launching into high swells from a sandy beach.", "image_url": "https://picsum.photos/seed/tat_set20_7/800/600"},
    {"pic_no": 8, "description": "A student volunteering to catalog old books and digital databases in a village library.", "image_url": "https://picsum.photos/seed/tat_set20_8/800/600"},
    {"pic_no": 9, "description": "Two researchers examining high-velocity water flow through a turbine prototype in a hydraulics lab.", "image_url": "https://picsum.photos/seed/tat_set20_9/800/600"},
    {"pic_no": 10, "description": "A woman inspecting organic mushroom cultivation trays under soft green lights in a nursery.", "image_url": "https://picsum.photos/seed/tat_set20_10/800/600"},
    {"pic_no": 11, "description": "A volunteer rescue team distributing dry food ration kits to seniors in a waterlogged street.", "image_url": "https://picsum.photos/seed/tat_set20_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Risk", "Lead", "Trust", "Grit", "Climb", "Scale", "Mount", "Ascend", "Rise", "Soar", 
    "Fly", "Leap", "Bound", "Jump", "Hop", "Skip", "Walk", "Run", "Sprint", "Race", 
    "Win", "Gain", "Grow", "Yield", "Fruit", "Seed", "Plant", "Tree", "Soil", "Earth", 
    "Land", "Sky", "Cloud", "Sun", "Star", "Moon", "Night", "Day", "Dawn", "Dusk", 
    "Calm", "Peace", "Love", "Care", "Aid", "Help", "Save", "Heal", "Cure", "Fix", 
    "Mend", "Patch", "Build", "Form", "Shape", "Mold", "Forge", "Carve", "Create", "Make"
  ],

  "SRT": [
    "He is leading a trekking expedition and a teammate gets a severe heat stroke on a barren ridge. He...",
    "His sister's final board exam coincides with his crucial SSB psychological interview date. He...",
    "He discovers that a local vendor is selling duplicate medicines in a packing similar to top brands. He...",
    "While traveling in a city bus, he sees the floorboard near the wheel arches rust and give way. He...",
    "He is organizing a blood donation camp and the main refrigeration storage unit fails. He...",
    "He finds a gold coin on the floor of a museum gallery. He...",
    "He is studying for a competitive exam but his roommate plays highly loud video games on TV all night. He...",
    "A swarm of hornets builds a nest directly above the main door of his house. He...",
    "He is on an interstate bus and the bus gets stranded in the middle of a flooded river bridge. He...",
    "He is accused of copying a computer design, which he had sketched from scratch on his own tablet. He...",
    "He is managing a sports league and a fight breaks out between the team captains. He...",
    "He is stuck in a lift with a claustrophobic passenger who begins to panic. He...",
    "He notices a dairy shopkeeper mixing water in milk tins before selling them. He...",
    "He gets caught in a dense dust storm while riding a bicycle on a highway. He...",
    "He is selected for a zonal debate but loses his voice due to a severe throat infection a day before. He...",
    "He notices a chemicals factory discharging dark, pungent water directly into a public park canal. He...",
    "His supervisor asks him to approve a low-quality concrete batch for a bridge project. He...",
    "A clerk delays issuing his caste certificate, hinting that an extra payment is expected. He...",
    "He is staying at a hostel and his roommate experiences a severe diabetic ketoacidosis shock at 2 AM. He...",
    "He presents a new code program and the external evaluator rejects it as unoriginal and unworkable. He...",
    "He is on a high-altitude trek and his friend starts showing early symptoms of pulmonary edema. He...",
    "He finds out that a close relative is selling pirated versions of high-end design software. He...",
    "While driving on a flyover, he witnesses a car skid and crash into a safety divider. He...",
    "He is assigned a group project with an arrogant team leader who rejects all his ideas. He...",
    "His close classmate is extremely depressed because of continuous exam failures. He...",
    "He sees a group of boys throwing firecrackers at a nest of birds in a tree. He...",
    "He is working on his tablet and the charger cable catches fire, emitting sparks. He...",
    "He is falsely blamed for leaking confidential exam papers to his friends. He...",
    "He is leading a student group and members refuse to clean the camp site after a bonfire. He...",
    "While boating in a lake, the engine catches fire and thick smoke fills the cabin. He...",
    "He discovers his wallet was picked while buying train tickets in a crowded station. He...",
    "He finds a fake commercial website using his mother's identity to solicit donations. He...",
    "He is in a library and sees a visitor tearing pages out of a rare encyclopedia. He...",
    "He is on a journey and a sudden landslip blocks the only connecting tunnel road. He...",
    "His friend insists on riding a motorcycle at high speed without wearing a helmet. He...",
    "He is organizing a tree planting drive and the vendor delivers dry, dead saplings. He...",
    "He sees a blind man trying to cross a chaotic intersection with no pedestrian signal. He...",
    "He is writing an exam and the power goes out, leaving the room pitch dark. He...",
    "He finds a massive hornet's nest inside his store room. He...",
    "His team is competing in a solar vehicle event and the battery thermal runaway triggers. He...",
    "He is on a trek and his teammate gets a severe ankle sprain on a rocky path. He...",
    "He is preparing a website and his hosting provider locks his account due to a server error. He...",
    "He notices a fellow cadet using a smart watch to cheat during a written exam. He...",
    "He is riding his scooter and the accelerator cable snaps on a steep hill climb. He...",
    "He notices a strong smell of gas coming from the utility room of a neighboring house whose owners are away. He...",
    "His research partner publishes the paper without mentioning his contribution. He...",
    "He is traveling and the car's cooling fan stops working in heavy city traffic. He...",
    "He sees a passenger's bag catch fire from a short circuit in a railway coach. He...",
    "He is asked to give a lecture on cyber threats at short notice due to an absent speaker. He...",
    "He is at home and hears a group of intruders trying to break the lock of his terrace door. He...",
    "He notices a major error in his bank passbook showing a huge incorrect debit transaction. He...",
    "His friends try to force him to board a speed boat that is visibly leaking. He...",
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
    "image_url": "https://picsum.photos/seed/ppdt_set20/800/600?blur=5",
    "description": "Hazy picture of a group of volunteers clearing shrubs to establish a safe fire line around a camp."
  },

  "PI": [
    "How do you handle a situation where your team members have a fundamental difference in values?",
    "Tell me about a time you had to deliver a project with zero budget or financial resources.",
    "What is your view on the security challenges posed by hypersonic weapons in modern warfare?",
    "How do you maintain your focus during long, repetitive tasks like data entry or lab tests?",
    "Tell me about a time you had to stand up against systemic corruption or cheating.",
    "What are the key differences between India's naval expansion and its air force expansion programs?",
    "How do you manage your digital screen time and keep yourself away from social media distractions?",
    "Tell me about a time you had to mentor a junior student who was failing in their academics.",
    "If you are given a task with no defined timeline, how do you structure your milestones?",
    "What is your opinion on the role of space weaponization in future global conflicts?",
    "Tell me about a major family crisis where you had to act as the primary decision maker.",
    "Why do you believe you have the officer-like qualities (OLQs) needed for the Indian Armed Forces?",
    "What is the difference between physical fitness and mental agility, in your own words?",
    "How do you handle a team member who constantly tries to take credit for your work?",
    "What role does empathy play in leading a team under high-risk environments?",
    "Tell me about a time you organized an awareness campaign on traffic safety or waste segregation.",
    "What are your views on India's bilateral relations with East African nations?",
    "If you are not selected in this attempt, what backup careers have you secured?",
    "How do you deal with a peer who is constantly trying to drag you into unhealthy habits?",
    "What is the most challenging group discussion or debate you have ever participated in?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends or colleagues think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to develop in yourself?"
  ],

  "Lecturette": [
    "Indigenization of Defense Equipment in India",
    "The Threat of Hypersonic Weapons in Modern Warfare",
    "India's Maritime Relations with East African Countries",
    "The Role of Youth in Combating Digital Addiction"
  ],

  "GD": [
    "Should high-tech surveillance be universally adopted to counter crime, or does it violate basic privacy rights?",
    "Is remote learning a permanent replacement for traditional classrooms, or does it hinder social development?"
  ],

  "GPE": {
    "narrative": "You are a group of 6 cadet volunteers attending a leadership camp. It is 1400 hours. A local forest ranger runs up to you with urgent news: 1. A forest fire has started near a dry bamboo forest 3 km North, and it will reach the forest ranger office (4 km Northwest) in exactly 1.5 hours (1530 hours). 2. A passenger jeep has skidded off a gravel road 5 km East, injuring 4 tourists who need immediate medical help. The nearest hospital is 10 km away. 3. A group of wild animal poachers has trapped a rare snow leopard in a steel cage 3 km South. You have a rugged utility truck (seats 5), some steel cables, a first aid box, and one satellite phone. The ranger office is 10 km away. How will you divide your group and prioritize these tasks to ensure the children are rescued, the grid collapse is averted, and the trapped leopard is released before 1530 hours?",
    "map_url": "https://picsum.photos/seed/gpe_map_set20/800/600"
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

with open(os.path.join(OUTPUT_DIR, "set_20.json"), 'w', encoding='utf-8') as f:
    json.dump(set_20_data, f, indent=2)

print("Set 20 created successfully with CPSS.")
