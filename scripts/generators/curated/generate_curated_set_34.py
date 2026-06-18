import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_34_data = {
  "set_id": "SET_34",
  "description": "High-Quality Curated SSB Dataset - Set 34",
  "TAT": [
    {"pic_no": 1, "description": "A young technician repairing a solar-powered bio-gas compressor dome in a community dairy yard.", "image_url": "https://picsum.photos/seed/tat_set34_1/800/600"},
    {"pic_no": 2, "description": "A lab researcher checking the calibration of a high-resolution scanning electron microscope.", "image_url": "https://picsum.photos/seed/tat_set34_2/800/600"},
    {"pic_no": 3, "description": "A group of volunteers digging compost trenches to improve soil organic quality in a public park.", "image_url": "https://picsum.photos/seed/tat_set34_3/800/600"},
    {"pic_no": 4, "description": "A student volunteer teaching online banking cyber security protocols to local vegetable vendors.", "image_url": "https://picsum.photos/seed/tat_set34_4/800/600"},
    {"pic_no": 5, "description": "A construction foreman inspecting structural cable joints on a steel highway flyover span.", "image_url": "https://picsum.photos/seed/tat_set34_5/800/600"},
    {"pic_no": 6, "description": "A flight cadet pointing at atmospheric weather fronts on a digital satellite radar screen.", "image_url": "https://picsum.photos/seed/tat_set34_6/800/600"},
    {"pic_no": 7, "description": "A technician replacing planetary reduction gears on an industrial overhead crane assembly.", "image_url": "https://picsum.photos/seed/tat_set34_7/800/600"},
    {"pic_no": 8, "description": "A young woman organizing a primary first-aid and sanitization kit distribution in a remote camp.", "image_url": "https://picsum.photos/seed/tat_set34_8/800/600"},
    {"pic_no": 9, "description": "Two marine conservationists placing concrete nursery domes to secure baby oyster polyps in a bay.", "image_url": "https://picsum.photos/seed/tat_set34_9/800/600"},
    {"pic_no": 10, "description": "A farmer picking fresh pomegranates in a high-density orchard using a soft padded picker pole.", "image_url": "https://picsum.photos/seed/tat_set34_10/800/600"},
    {"pic_no": 11, "description": "A dispatcher monitoring emergency fleet dispatch routes on a dual-screen control interface.", "image_url": "https://picsum.photos/seed/tat_set34_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Compressor", "Microscope", "Trenches", "Online", "Joints", "Satellite", "Reduction", "Sanitization", "Nursery", "Padded", 
    "Dispatcher", "Apex", "Bold", "Cope", "Drive", "Earn", "Firm", "Glow", "Hope", "Keen", 
    "Light", "Mild", "Neat", "Pure", "Rely", "Safe", "Trust", "Valor", "Warm", "Yield", 
    "Sovereign", "Hasten", "Grip", "Talon", "Glide", "Orbit", "Drill", "Vault", "Quell", "Rally", 
    "Blaze", "Forge", "Anchor", "Vessel", "Summit", "Plunge", "Vigour", "Robust", "Steady", "Ample", 
    "Sturdy", "Zenith", "Nadir", "Crest", "Flank", "Brave", "Calm", "Cheer", "Bright", "True"
  ],

  "SRT": [
    "He is leading a compressor installation team and a sudden gas pressure spike causes a piping burst. He...",
    "His sister's final board exam reporting time falls on the exact morning of his crucial SSB medical clearance test. He...",
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
    "image_url": "https://picsum.photos/seed/ppdt_set34/800/600?blur=5",
    "description": "Hazy picture of a young technician repairing a solar-powered bio-gas compressor dome in a community dairy yard."
  },

  "PI": [
    "How do you handle a team coordinator who constantly changes task allocations without consulting the group?",
    "Tell me about a time you organized a community street play or flash mob for voting awareness.",
    "What is your view on the military applications of high-altitude long-endurance (HALE) drones?",
    "How do you maintain high study concentration when there are distracting loud festivities in your neighborhood?",
    "Tell me about a time you had to stand up against academic grade manipulation in your college department.",
    "What are the key security and strategic concerns related to satellite signal jamming in war zones?",
    "How do you prioritize your training schedules when your sports tournaments clash with your main exams?",
    "Tell me about a time you successfully helped a classmate overcome extreme exam stress and demotivation.",
    "If you are assigned a team where the members have highly conflicting design views, how do you align them?",
    "What is your opinion on the strategic role of space debris tracking and mitigation systems?",
    "Tell me about a major family crisis where you took the lead to coordinate a sudden long-distance relocation.",
    "What is the distinction between rash driving and swift tactical driving, in your own words?",
    "What is the significance of the motto 'Brave and Resolute' in your everyday conduct?",
    "How do you handle a highly competent colleague who consistently speaks in an arrogant tone?",
    "What role does strategic patience play in handling protracted diplomatic negotiations?",
    "Tell me about a time you volunteered to lead a primary health and hygiene drive in a local slum area.",
    "What are your views on India's strategic maritime partnerships with Mediterranean nations?",
    "If you are not selected, what backup plans in satellite telemetry or launch systems have you considered?",
    "How do you deal with a peer who continuously steals your study notes without acknowledging it?",
    "What is the most challenging marathon or athletic event you have ever successfully completed?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends or colleagues think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to develop in yourself?"
  ],

  "Lecturette": [
    "High-Altitude Long-Endurance (HALE) Drones: Strategic Advantage",
    "Satellite Signal Jamming and Electronic Warfare in War Zones",
    "Space Debris Tracking and Mitigation Systems: Global Necessity",
    "The Importance of Strategic Patience in Protracted Diplomatic Negotiations"
  ],

  "GD": [
    "Should space debris cleanup operations be funded by spacefaring nations proportional to their historic launches, or should it be a joint commercial venture?",
    "Does the rising popularity of hybrid working models among corporate firms permanently weaken the long-term growth of commercial real estate in metropolitan cities?"
  ],

  "GPE": {
    "narrative": "You are a group of 6 forestry cadets visiting a high-altitude meteorological observatory. It is 0900 hours. A local forest ranger runs up to you with urgent news: 1. A sudden severe solar storm warning has been issued, and the main telemetry sensors (5 km North) must be recalibrated and secured in exactly 2 hours (1100 hours) to prevent a total communications blackout. 2. A research weather van has skidded off the icy road 6 km East, and 3 scientists are injured and trapped inside. The nearest medical camp is 8 km away. 3. A pack of endangered wild wolves is caught in a poacher's wire net 3 km South near an avalanche zone. You have a rugged snow jeep (seats 5), some tow cables, a medical kit, and a satellite radio. The base station is 12 km away. How will you divide your group and prioritize these tasks to ensure the telemetry sensors are secured, the scientists are rescued, and the wild wolves are released before 1100 hours?",
    "map_url": "https://picsum.photos/seed/gpe_map_set34/800/600"
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

with open(os.path.join(OUTPUT_DIR, "set_34.json"), 'w', encoding='utf-8') as f:
    json.dump(set_34_data, f, indent=2)

print("Set 34 created successfully with CPSS.")
