import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_24_data = {
  "set_id": "SET_24",
  "description": "High-Quality Curated SSB Dataset - Set 24",
  "TAT": [
    {"pic_no": 1, "description": "A young geologist analyzing limestone strata patterns with a geological hammer along a river cliff.", "image_url": "https://picsum.photos/seed/tat_set24_1/800/600"},
    {"pic_no": 2, "description": "A robotics researcher soldering high precision servo motor connections on an autonomous crawler frame.", "image_url": "https://picsum.photos/seed/tat_set24_2/800/600"},
    {"pic_no": 3, "description": "A group of NCC cadets clearing a blocked mountain culvert to prevent road erosion before rain.", "image_url": "https://picsum.photos/seed/tat_set24_3/800/600"},
    {"pic_no": 4, "description": "A medical coordinator explaining the use of a smart oxygen concentrator to rural village clinic helpers.", "image_url": "https://picsum.photos/seed/tat_set24_4/800/600"},
    {"pic_no": 5, "description": "A design engineer adjusting solar panel pivot hinges on the roof of a remote communications tower.", "image_url": "https://picsum.photos/seed/tat_set24_5/800/600"},
    {"pic_no": 6, "description": "An instructor demonstrating compass navigation and true north offsets to students around a map table.", "image_url": "https://picsum.photos/seed/tat_set24_6/800/600"},
    {"pic_no": 7, "description": "A pilot checking nose wheel landing gear shock absorber seals on a multirole trainer jet.", "image_url": "https://picsum.photos/seed/tat_set24_7/800/600"},
    {"pic_no": 8, "description": "A student volunteering to lead a digital transaction awareness campaign for flower vendors in a busy bazaar.", "image_url": "https://picsum.photos/seed/tat_set24_8/800/600"},
    {"pic_no": 9, "description": "Two marine conservationists placing concrete artificial reef domes onto a shallow seabed site.", "image_url": "https://picsum.photos/seed/tat_set24_9/800/600"},
    {"pic_no": 10, "description": "A woman carefully harvesting organic lavender stems in a blooming field with pruning shears.", "image_url": "https://picsum.photos/seed/tat_set24_10/800/600"},
    {"pic_no": 11, "description": "A volunteer rescue team securing a floating anchor line for a rescue boat during heavy lake currents.", "image_url": "https://picsum.photos/seed/tat_set24_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Strata", "Focus", "Drill", "Core", "Hinge", "Pivot", "Solder", "Weld", "Fuse", "Mesh", 
    "Grid", "Web", "Link", "Joint", "Band", "Ring", "Loop", "Coil", "Spur", "Crest", 
    "Ridge", "Peak", "Spire", "Apex", "Crown", "Base", "Sole", "Keel", "Hull", "Deck", 
    "Mast", "Sail", "Wind", "Gale", "Gust", "Breeze", "Calm", "Still", "Quiet", "Soft", 
    "Kind", "Help", "Save", "Heal", "Cure", "Mend", "Fix", "Bind", "Tie", "Knot", 
    "Lash", "Cord", "Rope", "Wire", "Cable", "Chain", "Lock", "Bolt", "Bar", "Gate"
  ],

  "SRT": [
    "He is leading a geological survey team and a sudden landslide blocks their only escape road. He...",
    "His sister's final board exam reporting time falls on the exact morning of his crucial SSB physical test. He...",
    "He discovers his neighbors are illegally discharging hazardous battery acid into the residential drain. He...",
    "While driving on a highway, he notices a bridge deck expansion joint has separated by several inches. He...",
    "He is organizing a college technical festival and the main power distributor board burns out. He...",
    "He finds a diamond ring on a public park jogging trail. He...",
    "He is preparing for his civil services exam but his neighborhood hosts a loud week-long festival with high-volume speakers. He...",
    "A swarm of wild bees nests inside his tractor's cabin, preventing him from starting the field plow. He...",
    "He is on an interstate bus and the driver suffers a sudden severe heart stroke on a mountain slope. He...",
    "He is accused of plagiarizing a software module, which he developed through his own lab tests. He...",
    "He is coordinating a basketball final and the main referee gets injured right after a major argument. He...",
    "He is stuck in a passenger lift with a claustrophobic passenger who begins to hyperventilate. He...",
    "He notices a petrol pump attendant dispensing fuel from an uncalibrated nozzle during refueling. He...",
    "He gets caught in a severe sandstorm while trekking through a dry desert stretch. He...",
    "He is selected to represent his college in a national sports event but gets a high-grade fever a day before. He...",
    "He notices a medical clinic dumping untreated biological waste directly behind a children's play area. He...",
    "His supervisor asks him to overlook a safety flaw in a public elevator installation. He...",
    "A local administrative officer delays issuing his passport clearance, hinting at an unofficial processing charge. He...",
    "He is staying at a hostel and his roommate starts vomiting blood due to severe food poisoning at 2 AM. He...",
    "He presents a new mechanical design and the jury labels it unoriginal and copied. He...",
    "He is trekking and his partner gets their leg wedged between two heavy boulders on a isolated path. He...",
    "He finds out a shopkeeper is selling protected hornbill feathers as high-end craft souvenirs. He...",
    "While driving on a state highway, he sees a loaded transport bus slide into a muddy ditch, tilting heavily. He...",
    "He is assigned a group project with a teammate who refuses to work because they wanted to be the leader. He...",
    "His close classmate decides to drop out of engineering because they failed two core subjects. He...",
    "He sees a group of boys throwing firecrackers into an open municipal gas pipeline pit. He...",
    "He is working in a chemistry lab and a beaker containing a flammable solvent catches fire. He...",
    "He is falsely accused of damaging high-precision lab equipment that failed due to a power surge. He...",
    "He is leading a cleanup drive and the volunteers refuse to collect garbage from a marshy pond edge. He...",
    "While kayaking in a fast river, his paddle snaps in half, leaving him drifting towards a rapid. He...",
    "He discovers his passport and cash are missing from his bag right before his international flight boarding. He...",
    "He finds a fraudulent online portal soliciting donations using his local NGO's logo and details. He...",
    "He is in a heritage fort and notices visitors carving names into a historic wooden doorway. He...",
    "He is on a journey and a sudden sinkhole opens up, blocking the single-lane road ahead of his car. He...",
    "His friend insists on operating a high-speed drone inside a crowded indoor banquet hall. He...",
    "He is organizing a community library and the donor delivers boxes of water-damaged, unreadable books. He...",
    "He sees a pregnant lady struggle to carry a heavy stroller up a metro station staircase. He...",
    "He is writing a crucial professional exam and his pen leaks ink, completely ruining his answer sheet. He...",
    "He finds a wild cat trapped and crying inside his home's narrow chimney pipe. He...",
    "His college team is competing in a solar boat challenge and the electric propulsion motor shorts out. He...",
    "He is trekking and his companion gets a deep puncture wound from a sharp splintered bamboo stick. He...",
    "He is editing a research documentary and his system's hard drive crashes, erasing all edit files. He...",
    "He notices a candidate attempting to use pre-printed micro-slips to cheat during a defense exam. He...",
    "He is riding a motorcycle down a steep mountain pass and the gear pedal snaps off. He...",
    "He smells burning chemical vapor coming from a locked storage room in his college hostel. He...",
    "His research partner publishes a patent based on their joint work under his single name. He...",
    "He is traveling on a highway and his car's oil warning light flashes, indicating a severe oil pan leak. He...",
    "He sees a display stall's paper decorations catch fire from a short circuit at a crowded college fest. He...",
    "He is asked to deliver a seminar on marine ecology at very short notice due to an absent speaker. He...",
    "He is alone at a remote farmhouse and hears footsteps circling the ground floor windows at night. He...",
    "He discovers his bank account has been debited a large sum via an unauthorized online transaction. He...",
    "His friends try to pressure him into riding triples on a motorcycle to attend a late-night party. He...",
    "He is participating in a cycling sprint and the front wheel rim of his bicycle buckles before the start. He...",
    "He is stuck in a cable car with a passenger who suffers a sudden high-altitude panic attack. He...",
    "He is in a plantation nursery and spots dry packaging straw catching fire near the seed racks. He...",
    "He receives his SSB call letter only 15 hours before reporting due to a major postal delay. He...",
    "He finds out his training partner is planning to withdraw from the sports selection because they cannot afford the travel gear. He...",
    "He is riding pillion and the driver attempts to perform a dangerous stunt on a crowded avenue. He...",
    "He finds an injured migratory bird with a bleeding wing tangled in a kite string. He...",
    "He is attending an international conference and the presenter projects an outdated, incorrect map of India. He..."
  ],

  "PPDT": {
    "image_url": "https://picsum.photos/seed/ppdt_set24/800/600?blur=5",
    "description": "Hazy picture of a young geologist analyzing limestone strata patterns with a geological hammer along a river cliff."
  },

  "PI": [
    "How do you manage a situation where your colleague's personal problems affect team performance?",
    "Tell me about a time you organized a community welfare initiative with no external funding.",
    "What is your view on the security challenges of maritime piracy in the Red Sea?",
    "How do you build concentration when reading complex, technical manuals?",
    "Tell me about a time you had to challenge a senior peer who was acting unethically.",
    "What are the main differences between a nuclear-powered submarine and a conventional submarine?",
    "How do you maintain a healthy lifestyle and diet when living in a busy urban city?",
    "Tell me about a time you mentored a junior classmate who was struggling with coding.",
    "If you are given a project with no defined parameters, how do you scope it?",
    "What is your opinion on the militarization of the Arctic region?",
    "Tell me about a major family conflict where you negotiated a mutual resolution.",
    "Why do you believe you have the officer-like qualities (OLQs) needed for the Navy?",
    "What is the difference between physical resilience and mental toughness, in your own words?",
    "How do you handle a team member who is extremely competent but has an aggressive attitude?",
    "What role does strategic patience play in achieving long-term personal goals?",
    "Tell me about a time you organized a blood donation or health camp in your locality.",
    "What are your views on the India-Middle East-Europe Economic Corridor (IMEC)?",
    "If you are selected, how will you contribute to the indigenization of defense technology?",
    "How do you deal with a friend who is constantly trying to drag you into lazy habits?",
    "What is the most challenging athletic event or trek you have ever completed?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends or colleagues think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to develop in yourself?"
  ],

  "Lecturette": [
    "The Threat of Maritime Piracy in the Red Sea",
    "Nuclear vs Conventional Submarines: Strategic Utility",
    "Geopolitics of the Arctic Region and Resource Scramble",
    "The Role of Indigenization in India's Defense Production"
  ],

  "GD": [
    "Should AI models be granted copyright ownership for original creations, or is copyright strictly a human right?",
    "Does the rapid rise of gig work provide career flexibility, or does it erode long-term labor security?"
  ],

  "GPE": {
    "narrative": "You are a group of 6 marine cadets visiting a coastal hatchery station. It is 1000 hours. A local fisherman runs up to you with urgent news: 1. A sudden high-tide sea breach is starting near the marine turtle nesting zone (5 km South), and the protective embankment will collapse in exactly 2 hours (1200 hours), drowning all nests. 2. A research boat has lost power and is drifting towards a shallow reef cluster 6 km East, and 3 biologists are trapped. The nearest rescue port is 8 km away. 3. A grass fire has broken out near the dry palm grove 3 km North, threatening to burn down the hatchery's research library. You have a rugged utility jeep (seats 5), some tow cables, sandbags, a first aid box, and one satellite radio. The hatchery center is 10 km away. How will you divide your group and prioritize these tasks to ensure the turtle nests are saved, the biologists are rescued, and the palm fire is contained before 1200 hours?",
    "map_url": "https://picsum.photos/seed/gpe_map_set24/800/600"
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

with open(os.path.join(OUTPUT_DIR, "set_24.json"), 'w', encoding='utf-8') as f:
    json.dump(set_24_data, f, indent=2)

print("Set 24 created successfully with CPSS.")
