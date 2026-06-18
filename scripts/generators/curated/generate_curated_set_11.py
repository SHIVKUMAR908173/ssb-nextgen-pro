import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_11_data = {
  "set_id": "SET_11",
  "description": "High-Quality Curated SSB Dataset - Set 11",
  "TAT": [
    {"pic_no": 1, "description": "A soldier struggling to drag a very heavy metallic box across a rocky field.", "image_url": "https://picsum.photos/seed/tat_set11_1/800/600"},
    {"pic_no": 2, "description": "A group of college students holding blank placards, looking angrily at a building.", "image_url": "https://picsum.photos/seed/tat_set11_2/800/600"},
    {"pic_no": 3, "description": "A woman in overalls staring confusedly at a complex, broken piece of machinery.", "image_url": "https://picsum.photos/seed/tat_set11_3/800/600"},
    {"pic_no": 4, "description": "A man standing waist-deep in a flooded street, holding a small dog.", "image_url": "https://picsum.photos/seed/tat_set11_4/800/600"},
    {"pic_no": 5, "description": "Two people shaking hands over a table while secretly holding weapons behind their backs.", "image_url": "https://picsum.photos/seed/tat_set11_5/800/600"},
    {"pic_no": 6, "description": "A doctor sitting on the floor of a hospital corridor, crying into their hands.", "image_url": "https://picsum.photos/seed/tat_set11_6/800/600"},
    {"pic_no": 7, "description": "A young boy pointing at a glowing object falling from the night sky.", "image_url": "https://picsum.photos/seed/tat_set11_7/800/600"},
    {"pic_no": 8, "description": "A farmer standing proudly in front of a brand new, highly advanced tractor.", "image_url": "https://picsum.photos/seed/tat_set11_8/800/600"},
    {"pic_no": 9, "description": "A person looking at a heavily damaged bridge that they need to cross.", "image_url": "https://picsum.photos/seed/tat_set11_9/800/600"},
    {"pic_no": 10, "description": "A group of business executives arguing aggressively over a line graph trending downwards.", "image_url": "https://picsum.photos/seed/tat_set11_10/800/600"},
    {"pic_no": 11, "description": "A solitary figure meditating at the very edge of a high cliff.", "image_url": "https://picsum.photos/seed/tat_set11_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Tree", "Forest", "Wood", "Leaf", "Root", "Grow", "Nurture", "Nature", "Protect", "Animal",
    "Bird", "Fish", "Ocean", "River", "Lake", "Pond", "Stream", "Flow", "Obstacle", "Clear",
    "Direct", "Indirect", "Path", "Way", "Guide", "Lost", "Found", "Seek", "Search", "Find",
    "Hide", "Conceal", "Reveal", "Show", "Display", "Act", "Drama", "Play", "Game", "Win",
    "Lose", "Tie", "Match", "Score", "Point", "Rank", "Top", "Bottom", "Up", "Down",
    "Left", "Right", "Forward", "Backward", "Progress", "Regress", "Stagnate", "Move", "Still", "Quiet"
  ],

  "SRT": [
    "He discovers his company is dumping toxic waste illegally into a nearby river. He...",
    "While trekking in dense woods, his group is suddenly attacked by a swarm of wild bees. He...",
    "His team is assigned a critical mission, but the intelligence provided is completely inaccurate. He...",
    "He is given a large sum of money by mistake at an ATM with no cameras around. He...",
    "He is supposed to lead a presentation, but his partner, who has half the notes, goes missing. He...",
    "His younger brother is caught vandalizing public property. He...",
    "He is driving through a riot-affected area and a mob blocks his car. He...",
    "He notices a fellow passenger in a train leaving a suspiciously heavy bag under a seat and walking away fast. He...",
    "His parents have finalized his marriage, but he wants to remain single to focus on his military career. He...",
    "He is assigned to a team where the members communicate in a language he doesn't understand. He...",
    "He sees a senior officer brutally punishing a junior for no fault of the junior. He...",
    "He is waiting at a deserted bus stop at night when a car pulls up and offers a ride. He...",
    "He accidentally damages a highly expensive, irreplaceable lab equipment. He...",
    "His best friend asks him to forge a signature on a medical certificate. He...",
    "He is preparing for an important exam and the neighborhood transformer blows, causing a massive blackout. He...",
    "He sees a blind man walking towards a deep open manhole. He...",
    "He is traveling on a flight and it suddenly experiences a massive drop in altitude. He...",
    "He receives an anonymous letter threatening his family if he doesn't drop out of a competition. He...",
    "He is given a critical task, but the deadline is advanced by two days suddenly. He...",
    "He notices smoke coming from the electrical panel of his apartment building. He...",
    "He is driving and accidentally hits a cyclist in a remote village area. He...",
    "He is falsely accused of stealing a mobile phone by his roommate. He...",
    "He finds out that his team leader is embezzling project funds. He...",
    "He is stuck in a massive traffic jam and has to reach a hospital with a critically ill pregnant woman. He...",
    "He is given a task that he feels is morally wrong but his boss insists it's necessary for the company. He...",
    "He sees a woman being physically assaulted in an alleyway. He...",
    "He is trekking in the mountains and a heavy snowstorm begins suddenly. He...",
    "He is at a restaurant and a customer starts violently arguing with a waiter over a minor issue. He...",
    "He is in a foreign country and loses all his money and luggage. He...",
    "His best friend confesses to a hit-and-run accident. He...",
    "He is running a marathon and is in the lead, but sees a fellow runner collapse from heatstroke. He...",
    "He is in charge of a project and the main supplier goes bankrupt. He...",
    "He finds an unattended briefcase in a busy movie theater. He...",
    "He is wrongly accused of insubordination by a vindictive senior. He...",
    "He is at a railway station and sees a child slip between the platform and a moving train. He...",
    "His subordinates refuse to work under a newly appointed female manager. He...",
    "He is lost in an unfamiliar city late at night with a dead phone. He...",
    "He witnesses a hit-and-run accident but the driver is the son of a powerful local politician. He...",
    "He is preparing for the SSB, but breaks his leg two weeks before the date. He...",
    "He is a swimmer and sees two people drowning simultaneously in opposite directions. He...",
    "He overhears a conversation planning a terrorist attack. He...",
    "His roommate is highly depressed and talks about ending his life. He...",
    "He is leading a patrol in dense fog and loses radio contact with base. He...",
    "He is managing a cash counter and at the end of the day, finds Rs. 5000 missing. He...",
    "He sees a house on fire and hears a baby crying inside, but the flames are very high. He...",
    "He is on a flight and a passenger suddenly suffers a severe heart attack. He...",
    "He is caught in a stampede at a religious festival. He...",
    "He finds out his brother is taking bribes. He...",
    "He is sailing and a severe storm approaches. He...",
    "He is the captain of a ship and pirates try to board. He...",
    "He is given a completely unfamiliar task with no training. He...",
    "His friend asks to copy his assignment because he was sick. He...",
    "He accidentally breaks an expensive piece of equipment at work. He...",
    "He is stranded on a highway with a flat tire and no spare. He...",
    "He is conducting a meeting and two members start fighting physically. He...",
    "He sees a blind man trying to cross a very busy intersection. He...",
    "He is waiting for an interview and the candidate next to him faints. He...",
    "He is riding a bike and the brakes fail on a steep downhill slope. He...",
    "He is trapped inside a bank during an armed robbery. He...",
    "He finds a confidential military document lying on a public bench. He..."
  ],

  "PPDT": {
    "image_url": "https://picsum.photos/seed/ppdt_set11/800/600?blur=5",
    "description": "Hazy picture of a person looking closely at a compass in a very dense, dark forest."
  },

  "PI": [
    "Tell me about a time you experienced a significant failure. How did you bounce back?",
    "What are your views on the Armed Forces Special Powers Act (AFSPA)?",
    "Describe a time when you had to take charge of a situation because no one else would.",
    "If you could have any job in the world other than the military, what would it be?",
    "What is your opinion on media trials and their impact on the justice system?",
    "How do you handle a situation where a close friend betrays your trust?",
    "What is the most creative thing you have ever done to solve a problem?",
    "Tell me about a time you had to adapt to a sudden change in rules.",
    "How do you ensure that you stay focused on your long-term goals?",
    "What are your views on the Digital India initiative?",
    "Have you ever felt peer pressure to do something unethical? How did you respond?",
    "What are the three most important things you look for in a team?",
    "If you are leading a patrol and you get completely lost in enemy territory, what is your first step?",
    "What is your biggest regret regarding your academic life?",
    "Tell me about a time you had to confront a superior about a mistake they made.",
    "How do you define success in your personal life?",
    "What role does your family play in your decision-making process?",
    "Tell me about a time you had to manage a project with zero budget.",
    "If you had the power to change one thing about your physical fitness, what would it be?",
    "Why do you think officers are expected to be 'gentlemen' first?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to improve in yourself?"
  ],

  "Lecturette": [
    "Media Trials in India",
    "Digital India Initiative",
    "Role of NITI Aayog in India's Development",
    "Armed Forces Special Powers Act (AFSPA)"
  ],

  "GD": [
    "Should spreading fake news be made a non-bailable criminal offense?",
    "Is parliamentary democracy the best form of government for a diverse country like India?"
  ],

  "GPE": {
    "narrative": "You are a group of 8 medical volunteers conducting a health camp in a remote forest village. It is 1500 hours. A forest ranger arrives and informs you: 1. A dangerous convict has escaped from a nearby prison and was seen heading towards the village (2 km away). 2. A massive forest fire has broken out 5 km away and strong winds are blowing it towards your camp. 3. A pregnant woman in the village has gone into premature labor and needs urgent hospitalization. 4. The only bridge connecting the village to the town (15 km away) has been severely damaged by a recent flood and can only take light vehicles. You have one medical jeep (can seat 5), two motorcycles, and basic medical kits. The nearest hospital and police station are in the town across the bridge. How will you divide your group and prioritize these tasks to ensure safety before the fire reaches the village in 2 hours?",
    "map_url": "https://picsum.photos/seed/gpe_map_set11/800/600"
  },

  "GTO": {
    "PGT": "Progressive Group Task: 4 progressive obstacles emphasizing heavy lifting and balancing. Resources: 1 Plank, 2 Ballis (heavy), 2 Ropes, 1 Pulley. Time: 40 mins.",
    "HGT": "Half Group Task: 1 complex obstacle involving a tricky cantilever over a 'water' hazard. Resources: 1 Plank, 1 Balli, 1 Rope. Time: 15 mins.",
    "IO": "Individual Obstacles: 10 obstacles (High Jump, Double Ditch, Zig-Zag Balance, Tarzan Swing, Commando Walk, Tiger Leap, Rope Climbing, Screen Jump, Burma Bridge, Monkey Crawl). Time: 3 mins.",
    "FGT": "Final Group Task: 1 long, complex obstacle requiring the entire group to transport a 'injured comrade' (heavy dummy) across a wide gap using limited ropes. Resources: Plank, Balli, 3 Ropes, Stretcher. Time: 15 mins."
  },

  "CPSS": [
    "Spatial orientation: If the slip indicator ball is deflected to the left during a right turn, is the turn slipping or skidding, and how do you correct the rudder?",
    "Artificial Horizon: The horizon bar is pitched down 15 degrees and banked 45 degrees to the left. Describe the aircraft's current attitude.",
    "Altimeter Reading: Read the altimeter showing the 10,000-ft pointer at 1, the 1,000-ft pointer at 2, and the 100-ft pointer at 5. What is the current altitude?",
    "Instrument Landing System: The localizer needle is centered but the glide slope needle is deflected downwards. Where is the aircraft relative to the correct glide path?",
    "Visual Spatial Reasoning: An unfolded 2D T-shape pattern has faces marked 1, 2, 3, 4, 5, 6. If folded into a 3D cube, which face will be opposite to 5?",
    "Cognitive Memory Challenge: Study the instrument cluster displaying 6 dials for 5 seconds. Identify which dial reading has changed in the subsequent screen.",
    "Compass Heading: The aircraft is heading 090 degrees (East). You receive a command to make a standard rate turn to a heading of 270 degrees. How many degrees of turn are required?",
    "Multi-tasking Psychomotor Test: Maintain the flight simulator joystick within the circular tracking zone while performing simple subtraction problems shown on the Head-Up Display (HUD).",
    "Aircraft Recognition: Identify the silhouette of the Sukhoi Su-30MKI fighter aircraft based on its prominent canards and twin vertical stabilizers.",
    "Reaction Time & Auditory Vigilance: Press the primary weapon launch button within 250 milliseconds only when the target lock is acquired (turns red) and a low-frequency acoustic tone is heard."
  ]
}

with open(os.path.join(OUTPUT_DIR, "set_11.json"), 'w', encoding='utf-8') as f:
    json.dump(set_11_data, f, indent=2)

print("Set 11 created successfully with CPSS.")
