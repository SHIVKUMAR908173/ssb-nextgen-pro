import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_14_data = {
  "set_id": "SET_14",
  "description": "High-Quality Curated SSB Dataset - Set 14",
  "TAT": [
    {"pic_no": 1, "description": "An environmental activist speaking to a crowd of local villagers about sustainable farming methods.", "image_url": "https://picsum.photos/seed/tat_set14_1/800/600"},
    {"pic_no": 2, "description": "A mechanical engineer using a wrench to fine-tune the motor of an electric motorcycle.", "image_url": "https://picsum.photos/seed/tat_set14_2/800/600"},
    {"pic_no": 3, "description": "A group of residents clearing debris and muddy branches from a village road after a minor landslide.", "image_url": "https://picsum.photos/seed/tat_set14_3/800/600"},
    {"pic_no": 4, "description": "A rock climber carefully planning their next handhold on a steep vertical cliff.", "image_url": "https://picsum.photos/seed/tat_set14_4/800/600"},
    {"pic_no": 5, "description": "A pediatric doctor checking the heartbeat of a smiling toddler while the mother watches.", "image_url": "https://picsum.photos/seed/tat_set14_5/800/600"},
    {"pic_no": 6, "description": "An instructor explaining technical map markings to a group of outdoor trainees under a shade canopy.", "image_url": "https://picsum.photos/seed/tat_set14_6/800/600"},
    {"pic_no": 7, "description": "A Coast Guard officer scanning the horizon with binoculars from the deck of a patrol boat.", "image_url": "https://picsum.photos/seed/tat_set14_7/800/600"},
    {"pic_no": 8, "description": "A young student volunteering to teach basic computers to elderly people in a community center.", "image_url": "https://picsum.photos/seed/tat_set14_8/800/600"},
    {"pic_no": 9, "description": "Two team leaders reviewing blueprints on a table at a bustling construction site.", "image_url": "https://picsum.photos/seed/tat_set14_9/800/600"},
    {"pic_no": 10, "description": "A designer drawing an aerodynamic car model on a large drafting table.", "image_url": "https://picsum.photos/seed/tat_set14_10/800/600"},
    {"pic_no": 11, "description": "A rescue team using inflatable rafts to relocate residents from a heavily flooded neighborhood.", "image_url": "https://picsum.photos/seed/tat_set14_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Task", "Goal", "Path", "Climb", "Reach", "Strive", "Aim", "Focus", "Vision", "Drive", 
    "Energy", "Vigor", "Force", "Power", "Direct", "Command", "Manage", "Coordinate", "Unify", "Bond", 
    "Support", "Protect", "Defend", "Shield", "Rescue", "Save", "Heal", "Cure", "Resolve", "Decide", 
    "Conclude", "Finish", "Endure", "Persist", "Sustain", "Yield", "Adapt", "Flex", "Shift", "Change", 
    "New", "Fresh", "Pure", "Clean", "Right", "Just", "Fair", "Equal", "True", "Sincere", "Honest", 
    "Loyal", "Devote", "Trust", "Rely", "Faith", "Hope", "Cheer", "Bright", "Glad", "Smile"
  ],

  "SRT": [
    "He is leading a cycling group and one of the riders' brakes completely fail on a steep descent. He...",
    "His family is in a minor financial crisis and asks him to defer his higher education to start earning. He...",
    "He discovers that a team member is plagiarizing content for a joint research publication. He...",
    "While returning from a movie at night, he notices thick smoke coming out of an electrical substation. He...",
    "He is coordinating a state-level sports meet, and the main field gets waterlogged due to sudden heavy rain. He...",
    "He finds a package containing expensive camera gear left unattended on a park bench. He...",
    "He is preparing for his exams, but his roommate keeps playing music loudly despite multiple requests. He...",
    "A stray cow gets stuck in a muddy swamp near his house and is unable to move. He...",
    "He is on a flight and a co-passenger sitting next to him suddenly faints. He...",
    "He is accused of breaking a costly lab instrument which was already damaged when he started. He...",
    "He is organizing a college festival, and the main caterer cancels the food contract on the morning of the event. He...",
    "He is stuck in a lift with a child who starts crying in panic during a power outage. He...",
    "He sees a shopkeeper cheating an illiterate buyer by weighing goods using a faulty scale. He...",
    "He gets separated from his trekking group in a hilly area as dusk begins to fall. He...",
    "He is selected for a training program abroad, but his passport application is delayed due to an administrative error. He...",
    "He notices a loose electric wire hanging dangerously low over a busy street. He...",
    "His supervisor asks him to overlook a minor safety violation in the construction report. He...",
    "A government officer delays his passport verification, hinting at a bribe. He...",
    "He is staying at a guesthouse and the person in the next room suffers a severe asthma attack at 2 AM. He...",
    "He is in a formal meeting and a senior colleague dismisses his proposal in a mocking tone. He...",
    "He is on a mountain trek and the weather suddenly turns extremely cold with heavy snowfall. He...",
    "He finds out that a close friend is stealing money from the local club fund. He...",
    "While driving, he witnesses an electric pole collapse on a parked car with people inside. He...",
    "He is paired with a highly opinionated teammate who refuses to listen to any ideas. He...",
    "His younger sister is depressed after failing to clear a competitive entrance exam. He...",
    "He sees tourists throwing plastic waste and garbage into a pristine mountain lake. He...",
    "He is working in his study room and smells a strong odor of burning plastic from the socket. He...",
    "He is falsely blamed for leaking a confidential project idea to another college department. He...",
    "He is leading a project team and two key members have a major personal fallout. He...",
    "While boating in a lake, the oars break and a strong wind begins to blow the boat towards deep waters. He...",
    "He discovers his wallet was stolen just as he is about to pay for medicines at a chemist. He...",
    "He finds that his identity has been used to purchase a phone connection without his consent. He...",
    "He is in a library and notices someone tearing pages out of a rare reference book. He...",
    "He is on a trip and a sudden transport strike is announced, halting all buses and trains. He...",
    "His friend wants to ride his bike, but he knows the friend is under the influence of alcohol. He...",
    "He is organizing a blood donation drive, but the medical team brings fewer blood bags than expected. He...",
    "He sees an elderly person slip on a wet floor and struggle to get up. He...",
    "He is in a job interview and realizes his phone is ringing loudly in his bag. He...",
    "He finds a swarm of bees building a hive right next to his balcony door. He...",
    "His team is participating in a quiz and the buzzer system starts malfunctioning during their turn. He...",
    "He is trekking and a fellow trekker gets a deep cut on their arm from a sharp rock. He...",
    "He is preparing a digital project and his computer catches a virus, locking all files a day before submission. He...",
    "He sees a student copying answers from a hidden slip during a major term exam. He...",
    "He is riding a scooter and the accelerator cable snaps in a busy traffic lane. He...",
    "He notices a gas cylinder leaking in a neighbor's house while they are away. He...",
    "His project partner takes all the credit during the presentation to the head of the department. He...",
    "He is traveling and the drinking water runs out in a hot, arid region. He...",
    "He sees a passenger's bag catch fire due to a faulty power bank in a bus. He...",
    "He is asked to present a technical topic that he was informed about only 10 minutes prior. He...",
    "He is at home and hears a loud scream for help from a nearby dark lane. He...",
    "He finds a major error in his bank statement showing a large unauthorized credit. He...",
    "His peers try to peer-pressure him into taking drugs at a party. He...",
    "He is participating in a race and another runner trips and falls right in front of him. He...",
    "He is stuck in a lift that suddenly stops between floors and the alarm button doesn't work. He...",
    "He is in a forest area and notices a small bushfire starting to spread near dry grass. He...",
    "He is selected for an interview, but his train gets delayed and he will arrive 30 minutes late. He...",
    "He finds out his classmate is planning to drop out of college due to academic pressure. He...",
    "He is riding a pillion on a motorcycle and the rider starts weaving through traffic dangerously. He...",
    "He finds an injured falcon bird lying on his lawn. He...",
    "He is attending a guest lecture and the speaker makes an offensive remark about a community. He..."
  ],

  "PPDT": {
    "image_url": "https://picsum.photos/seed/ppdt_set14/800/600?blur=5",
    "description": "Hazy picture of four people standing together on a muddy track, looking towards a distant valley."
  },

  "PI": [
    "How do you prioritize your daily tasks and manage your time effectively?",
    "Tell me about a time you had to lead a team through a significant transition or change.",
    "What is your view on the active participation of youth in national politics?",
    "How do you ensure you stay calm and composed during high-pressure situations?",
    "Tell me about a time you faced a moral dilemma and how you resolved it.",
    "What are the most critical geopolitical challenges facing India currently?",
    "How do you maintain a balance between your academic goals and extracurricular activities?",
    "Tell me about a project where you had to coordinate with multiple departments or groups.",
    "If you are given a task with a very short deadline, what is your execution strategy?",
    "What is your opinion on the impact of e-commerce on local retail shopkeepers?",
    "Tell me about a time you had to admit a major mistake to your parents or teachers.",
    "Why do you believe you possess the qualities of a good military leader?",
    "What is the difference between physical courage and moral courage, in your opinion?",
    "How do you handle a team member who constantly complains about their workload?",
    "What role does self-discipline play in achieving long-term goals?",
    "Tell me about a time you organized a major event or sports meet.",
    "What are your views on India's strides in digital public infrastructure like UPI?",
    "If you are not selected for the Armed Forces, what specific career path will you pursue?",
    "How do you handle constructive criticism and feedback on your weaknesses?",
    "What is the most challenging journey or trip you have ever undertaken?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends or colleagues think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to develop in yourself?"
  ],

  "Lecturette": [
    "Self-Reliance in Space Technology (ISRO's Milestones)",
    "The Future of Electric Vehicles in India",
    "Bilateral Trade and Economic Diplomacy",
    "The Importance of Cybersecurity in Financial Systems"
  ],

  "GD": [
    "Is the shift to renewable energy happening fast enough to prevent major climate disasters?",
    "Should there be strict government regulation on AI development, or should it be market-driven?"
  ],

  "GPE": {
    "narrative": "You are a group of 6 environment volunteers visiting a riverbank conservation site. It is 1400 hours. A local boatman runs up to you with critical news: 1. A sudden flash flood warning has been issued, and the low-lying riverbank village (3 km downstream) will be flooded in exactly 2 hours (1600 hours). 2. A tourist jeep has got stuck in a sandy marsh 4 km North, and the passengers are stranded without food or water. 3. A flock of rare migratory birds is trapped in a netting trap set illegally by poachers 2 km East. You have a pickup vehicle (seats 5), some towing ropes, a first aid box, and a satellite phone with limited charge. The forest conservation office is 12 km away across the river. How will you divide your group and prioritize these tasks to ensure the village is evacuated, the tourists are towed out, and the poachers' traps are cleared before the flood hits?",
    "map_url": "https://picsum.photos/seed/gpe_map_set14/800/600"
  },

  "GTO": {
    "PGT": "Progressive Group Task: 4 progressive obstacles requiring advanced bridging and structural leverage. Resources: 1 long Plank, 1 short Balli, 2 Ropes, 1 metallic ring. Time: 40 mins.",
    "HGT": "Half Group Task: 1 complex obstacle involving crossing a suspended platform. Resources: 1 Plank, 1 Balli, 1 Rope. Time: 15 mins.",
    "IO": "Individual Obstacles: 10 standard GTO obstacles. Time: 3 mins.",
    "FGT": "Final Group Task: A coordinated team effort to transport a heavy fuel canister across the final defensive line. Resources: 1 Plank, 1 Balli, 2 Ropes. Time: 15 mins."
  },

  "CPSS": [
    "Spatial orientation: If the slip indicator ball is deflected to the right during a left turn, how should you correct the rudder?",
    "Artificial Horizon: The horizon bar is pitched down 10 degrees and banked 45 degrees to the right. Describe the aircraft's current attitude.",
    "Altimeter Reading: Read the altimeter showing the 10,000-ft pointer at 4, the 1,000-ft pointer at 2, and the 100-ft pointer at 5. What is the current altitude?",
    "Instrument Landing System: The localizer needle is deflected to the right and the glide slope needle is centered. Where is the aircraft relative to the correct glide path?",
    "Visual Spatial Reasoning: An unfolded 2D pattern shaped like a T has faces marked A, B, C, D, E, F. If folded into a 3D cube, which face will be opposite to E?",
    "Cognitive Memory Challenge: Study the instrument cluster displaying 6 dials for 5 seconds. Identify which dial reading has changed in the subsequent screen.",
    "Compass Heading: The aircraft is heading 090 degrees (East). You receive a command to make a standard rate turn to a heading of 180 degrees. How many degrees of turn are required?",
    "Multi-tasking Psychomotor Test: Maintain the flight simulator joystick within the target green diamond while identifying even numbers flashed on the Head-Up Display (HUD).",
    "Aircraft Recognition: Identify the silhouette of the MiG-29 fighter aircraft based on its twin vertical tails and large underwing engine nacelles.",
    "Reaction Time & Auditory Vigilance: Press the weapon launch trigger within 250 milliseconds only when the lock-on reticle turns green and a high-pitch warning beep is heard."
  ]
}

with open(os.path.join(OUTPUT_DIR, "set_14.json"), 'w', encoding='utf-8') as f:
    json.dump(set_14_data, f, indent=2)

print("Set 14 created successfully with CPSS.")
