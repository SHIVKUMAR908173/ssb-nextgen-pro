import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_18_data = {
  "set_id": "SET_18",
  "description": "High-Quality Curated SSB Dataset - Set 18",
  "TAT": [
    {"pic_no": 1, "description": "An electronics technician soldering components onto a large satellite circuit board in a clean room.", "image_url": "https://picsum.photos/seed/tat_set18_1/800/600"},
    {"pic_no": 2, "description": "A young agricultural officer showing a group of village farmers how to test soil health using a field kit.", "image_url": "https://picsum.photos/seed/tat_set18_2/800/600"},
    {"pic_no": 3, "description": "A municipal worker and a resident mapping out locations for new solar streetlights on a neighborhood chart.", "image_url": "https://picsum.photos/seed/tat_set18_3/800/600"},
    {"pic_no": 4, "description": "A wild animal rescue team member feeding a small tiger cub inside a forest sanctuary clinic.", "image_url": "https://picsum.photos/seed/tat_set18_4/800/600"},
    {"pic_no": 5, "description": "A design lead testing the aerodynamic design of an electric racing car inside a wind tunnel.", "image_url": "https://picsum.photos/seed/tat_set18_5/800/600"},
    {"pic_no": 6, "description": "A teacher organizing outdoor physics experiments with high school students in a school playground.", "image_url": "https://picsum.photos/seed/tat_set18_6/800/600"},
    {"pic_no": 7, "description": "A naval cadet standing on the deck of a sailing ship, holding binoculars and looking at the horizon.", "image_url": "https://picsum.photos/seed/tat_set18_7/800/600"},
    {"pic_no": 8, "description": "A group of volunteers painting a vibrant mural on a neglected neighborhood wall.", "image_url": "https://picsum.photos/seed/tat_set18_8/800/600"},
    {"pic_no": 9, "description": "A laboratory chemist inspecting a tray of crystal formations under a bright light.", "image_url": "https://picsum.photos/seed/tat_set18_9/800/600"},
    {"pic_no": 10, "description": "A park ranger explaining wildlife migration paths on a large terrain map to hikers.", "image_url": "https://picsum.photos/seed/tat_set18_10/800/600"},
    {"pic_no": 11, "description": "A rescue swimmer being lowered from a helicopter to help a capsule stranded in the sea.", "image_url": "https://picsum.photos/seed/tat_set18_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Rule", "Lead", "Path", "Walk", "Run", "Jump", "Fly", "Soar", "High", "Deep", 
    "Wide", "Long", "Tall", "Strong", "Hard", "Tough", "Soft", "Kind", "Gentle", "Mild", 
    "Placid", "Quiet", "Still", "Calm", "Peace", "Love", "Care", "Help", "Aid", "Save", 
    "Heal", "Cure", "Fix", "Mend", "Build", "Grow", "Rise", "Climb", "Mount", "Scale", 
    "Leap", "Bound", "Bold", "Brave", "Sure", "True", "Sinc", "Pure", "Fresh", "New", 
    "Grand", "Great", "Noble", "Wise", "Smart", "Alert", "Ready", "Swift", "Quick", "Speed"
  ],

  "SRT": [
    "He is leading a cycling group and a rider's frame breaks on a steep descent. He...",
    "His brother gets hospitalized with high fever on the morning of his major bank PO exam. He...",
    "He finds that his project partner is fabricating sample values in the thesis report. He...",
    "While walking in a market, he sees a heavy concrete tile slide off a rooftop, injuring a pedestrian. He...",
    "He is managing a sports meet and the sound amplifier system burns out during the opening ceremony. He...",
    "He finds a high-end smartphone on a bench in a public library. He...",
    "He is trying to study for his finals, but his neighbor's dog barks continuously every night. He...",
    "A wild leopard is reported wandering in his orchard, causing panic among the field laborers. He...",
    "He is traveling by train and a co-passenger experiences a severe asthma attack. He...",
    "He is accused of copying a computer design, which he had drafted from scratch in his drawing class. He...",
    "He is conducting a sports league and a physical fight breaks out between the two finalist teams. He...",
    "He is stuck in a lift that stops between floors and the ventilation system shuts down. He...",
    "He notices a vegetable vendor using rigged iron weights that weigh less than marked. He...",
    "He gets caught in a massive hailstorm while riding his bike on a mountain road. He...",
    "He is selected for a regional swimming meet, but his swimming trunks and goggles are stolen from the locker room. He...",
    "He spots a truck emitting massive clouds of toxic black smoke near a public hospital. He...",
    "His relative asks him to use his position to bypass the queue for a government land allotment. He...",
    "A bank executive delays processing his student loan, indicating that a commission is required. He...",
    "He is staying at a guesthouse and his travel guide suffers a snake bite at midnight. He...",
    "He presents a new marketing model and his senior rejects it as completely unworkable. He...",
    "He is on a winter trek and his teammate starts showing early signs of frostbite on their fingers. He...",
    "He discovers his friend is running a high-stakes online card game racket in their hostel. He...",
    "While driving on a state highway, he sees a motorcycle crash into a drainage ditch. He...",
    "He is assigned a group project with a teammate who refuses to do any research work. He...",
    "His younger brother is deeply depressed because he failed his physical fitness test for the Army. He...",
    "He sees a group of vandals painting graffiti over a national heritage monument. He...",
    "He is using a portable heater and the plug socket starts smoking and melting. He...",
    "He is falsely accused of damaging a highly expensive centrifuge in the chemistry laboratory. He...",
    "He is leading a volunteer clean-up team and half the members don't show up on the scheduled day. He...",
    "While boating in a swift river, the rudder cable snaps and the boat heads towards a dam spillway. He...",
    "He notices his credit card was stolen from his room and a transaction alert pops up. He...",
    "He finds a fake social media account created in his name that is sending abusive messages to his friends. He...",
    "He sees a man trying to steal light bulbs from the corridor of a hospital. He...",
    "He is traveling in a valley and a massive mudslide cuts off the road both ahead and behind. He...",
    "His friend insists on driving his car at night despite having extremely blurry vision. He...",
    "He is organizing an plantation drive and the delivered soil contains high levels of plastic debris. He...",
    "He sees a lost, crying child wandering in a highly crowded fair. He...",
    "He is writing an exam and the roof starts leaking water directly onto his answer sheet. He...",
    "He finds a large swarm of hornets building a nest inside his garage. He...",
    "His team is competing in a robot combat event and their main battery catches fire in the pit. He...",
    "He is on a trek and his companion falls, dislocating their shoulder joint. He...",
    "He is preparing a project and his computer's operating system crashes, wiping out his unsaved files a night before submission. He...",
    "He notices a colleague copying confidential project plans onto a personal flash drive. He...",
    "He is riding his motorcycle and the accelerator throttle stuck at high speed on a busy street. He...",
    "He notices a strong smell of burning rubber coming from a locked electrical substation in his colony. He...",
    "His colleague takes the sole credit for a major technical paper they co-developed. He...",
    "He is traveling and his vehicle's radiator starts leaking boiling water in a remote desert area. He...",
    "He sees a passenger's jacket catch fire from a spark during a community bonfire. He...",
    "He is asked to present a complex engineering case study in place of a senior officer who fell sick. He...",
    "He is home alone at night and hears someone attempting to break open the kitchen window grill. He...",
    "He notices a major discrepancy in his electricity bill showing ten times the usual usage. He...",
    "His friends try to force him to board a speed boat that does not have life jackets. He...",
    "He is participating in a sports tournament and the referee makes a series of highly biased decisions. He...",
    "He is stuck in a passenger lift with an elderly person who is having a panic attack. He...",
    "He is in a forest and spots a minor fire spreading near a dry pine needle heap. He...",
    "He receives his SSB call letter only 24 hours before the reporting time due to a postal delay. He...",
    "He finds out his classmate is planning to drop out of college because they cannot afford the tuition fees. He...",
    "He is riding a pillion on a scooter and the rider starts driving on the footpath to bypass traffic. He...",
    "He finds an injured owl with a broken wing near his garden gate. He...",
    "He is attending a technical conference and the host makes a highly controversial map representation. He..."
  ],

  "PPDT": {
    "image_url": "https://picsum.photos/seed/ppdt_set18/800/600?blur=5",
    "description": "Hazy picture of three people in uniform standing near a control panel, studying a display."
  },

  "PI": [
    "How do you prioritize your time when faced with multiple urgent academic and household deadlines?",
    "Tell me about a time you had to lead a group project where the members had conflicting interests.",
    "What is your view on the security challenges posed by modern unmanned aerial vehicles (UAVs) on our borders?",
    "How do you keep yourself mentally balanced and physically active during periods of high stress?",
    "Tell me about a time you helped a neighbor or a stranger in a major crisis?",
    "What are the most significant economic achievements India has made in the past decade?",
    "How do you manage your sleep cycle, diet, and physical workouts alongside college?",
    "Tell me about a time you had to master a complex software or tool on your own.",
    "If you are given a project with no guidance, how do you go about finding the right resources?",
    "What is your opinion on India's defense modernization and the induction of indigenous aircraft like Rafale/Tejas?",
    "Tell me about a time you had to stand up against a decision made by your close friends.",
    "Why do you believe discipline is the most critical quality for a military officer?",
    "What is the difference between a boss and a leader, in your own words?",
    "How do you motivate a family member who is facing a severe professional crisis?",
    "What role does empathy play in leading a team under stressful circumstances?",
    "Tell me about a time you took the initiative to fix a long-standing issue in your neighborhood.",
    "What are your views on India's target of achieving energy independence through green hydrogen?",
    "If you are not selected this time, what specific steps will you take to prepare for your next attempt?",
    "How do you handle a situation where your close friends are involved in unethical behavior?",
    "What is the most physically challenging task you have ever completed?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends or colleagues think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to develop in yourself?"
  ],

  "Lecturette": [
    "The Role of Startups in India's Space Sector",
    "Challenges of Cybersecurity in Modern Banking",
    "The Importance of Maritime Security in the Indian Ocean",
    "Urban Solid Waste Management: Challenges and Solutions"
  ],

  "GD": [
    "Is the rapid growth of artificial intelligence a threat to white-collar jobs, or will it create new avenues?",
    "Should natural resources like water and forests be fully privatized to ensure efficiency, or must they remain under state control?"
  ],

  "GPE": {
    "narrative": "You are a group of 6 college students on a field visit to a wildlife sanctuary. It is 1500 hours. A forest guard runs up to you with urgent news: 1. A forest fire has started near the dry bamboo grove 3 km North, and it will reach the tourist resort (4 km Northwest) in exactly 1.5 hours (1630 hours). 2. A passenger van has collided with a tree 5 km East, injuring 4 tourists who need immediate medical help. The nearest hospital is 10 km away. 3. A group of poachers has been spotted laying traps near the watering hole 2 km South. You have a sanctuary jeep (seats 5), some ropes, a first aid box, and a satellite phone with low battery. The main ranger office is 8 km away. How will you divide your group and prioritize these tasks to ensure the tourists are saved, the fire is checked, and the poachers are captured before 1630 hours?",
    "map_url": "https://picsum.photos/seed/gpe_map_set18/800/600"
  },

  "GTO": {
    "PGT": "Progressive Group Task: 4 progressive obstacles emphasizing bridging across deep sandy pits. Resources: 1 long Plank, 1 short Balli, 2 Ropes, 1 wooden block. Time: 40 mins.",
    "HGT": "Half Group Task: 1 complex obstacle involving crossing a suspended platform. Resources: 1 Plank, 1 Balli, 1 Rope. Time: 15 mins.",
    "IO": "Individual Obstacles: 10 standard GTO obstacles including the Tiger Leap. Time: 3 mins.",
    "FGT": "Final Group Task: A coordinated team effort to transport a heavy ammunition canister across the final defensive line. Resources: 1 Plank, 1 Balli, 2 Ropes. Time: 15 mins."
  },

  "CPSS": [
    "Spatial orientation: If the slip indicator ball is deflected to the left during a left turn, how should you correct the rudder?",
    "Artificial Horizon: The horizon bar is pitched down 10 degrees and banked 30 degrees to the right. Describe the aircraft's current attitude.",
    "Altimeter Reading: Read the altimeter showing the 10,000-ft pointer at 8, the 1,000-ft pointer at 4, and the 100-ft pointer at 6. What is the current altitude?",
    "Instrument Landing System: The localizer needle is deflected to the right and the glide slope needle is deflected upwards. Where is the aircraft relative to the correct glide path?",
    "Visual Spatial Reasoning: An unfolded 2D pattern shaped like a T has faces marked A to F. If folded into a 3D cube, which face will be opposite to D?",
    "Cognitive Memory Challenge: Study the radar display featuring 6 aircraft tracks for 5 seconds. Identify which track number has changed its bearing.",
    "Compass Heading: The aircraft is heading 180 degrees (South). You receive a command to make a standard rate turn to a heading of 270 degrees. How many degrees of turn are required?",
    "Multi-tasking Psychomotor Test: Maintain the flight simulator joystick within the target green circle while solving basic addition problems on the Head-Up Display (HUD).",
    "Aircraft Recognition: Identify the silhouette of the MiG-29 fighter aircraft based on its twin tails and wing roots.",
    "Reaction Time & Auditory Vigilance: Press the missile launch button within 250 milliseconds only when the radar target locks (turns green) and a high-pitch warning beep is heard."
  ]
}

with open(os.path.join(OUTPUT_DIR, "set_18.json"), 'w', encoding='utf-8') as f:
    json.dump(set_18_data, f, indent=2)

print("Set 18 created successfully with CPSS.")
