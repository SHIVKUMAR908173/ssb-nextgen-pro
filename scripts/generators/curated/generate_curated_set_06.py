import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_06_data = {
  "set_id": "SET_06",
  "description": "High-Quality Curated SSB Dataset - Set 6 (Without CPSS)",
  
  "TAT": [
    {"pic_no": 1, "description": "A young woman looking deeply into a broken mirror.", "image_url": "https://picsum.photos/seed/tat_set6_1/800/600"},
    {"pic_no": 2, "description": "A group of soldiers resting under a large tree with their gear scattered around.", "image_url": "https://picsum.photos/seed/tat_set6_2/800/600"},
    {"pic_no": 3, "description": "A family gathered around a table, pointing at a large, old map.", "image_url": "https://picsum.photos/seed/tat_set6_3/800/600"},
    {"pic_no": 4, "description": "A person painting on a large canvas in a messy room.", "image_url": "https://picsum.photos/seed/tat_set6_4/800/600"},
    {"pic_no": 5, "description": "A police officer handing a piece of bread to a street child.", "image_url": "https://picsum.photos/seed/tat_set6_5/800/600"},
    {"pic_no": 6, "description": "A man aggressively shouting at a toll booth operator.", "image_url": "https://picsum.photos/seed/tat_set6_6/800/600"},
    {"pic_no": 7, "description": "Two individuals pulling a small rowboat onto a sandy shore.", "image_url": "https://picsum.photos/seed/tat_set6_7/800/600"},
    {"pic_no": 8, "description": "An elderly woman handing a stack of files to a young professional.", "image_url": "https://picsum.photos/seed/tat_set6_8/800/600"},
    {"pic_no": 9, "description": "A person standing alone in an empty stadium, holding a football.", "image_url": "https://picsum.photos/seed/tat_set6_9/800/600"},
    {"pic_no": 10, "description": "A group of scientists staring at a computer screen with shocked expressions.", "image_url": "https://picsum.photos/seed/tat_set6_10/800/600"},
    {"pic_no": 11, "description": "A boy climbing a highly precarious tree branch to reach something.", "image_url": "https://picsum.photos/seed/tat_set6_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Respect", "Elder", "Youth", "Child", "Old", "Age", "Time", "Future", "Vision", "Hope",
    "Despair", "Sad", "Happy", "Smile", "Tears", "Blood", "Sweat", "Work", "Job", "Task",
    "Duty", "Target", "Arrow", "Bow", "Shoot", "Gun", "Fire", "Burn", "Water", "Swim",
    "Drown", "Save", "Rescue", "Danger", "Safe", "Secure", "Lock", "Key", "Door", "Window",
    "Open", "Close", "Mind", "Heart", "Brain", "Smart", "Stupid", "Clever", "Fool", "King",
    "Queen", "Leader", "Follower", "Guide", "Map", "Road", "Path", "Journey", "Destination", "End"
  ],

  "SRT": [
    "He notices that the shopkeeper has mistakenly given him change for Rs. 2000 instead of Rs. 500. He...",
    "During a solo road trip, his car's GPS stops working and he is completely lost in a rural area. He...",
    "He finds out his best friend has been lying to him about his educational qualifications. He...",
    "He is participating in a debate, and his opponent starts making personal, insulting remarks. He...",
    "While returning home, he sees a massive crowd blocking the road protesting against the government. He...",
    "He is appointed the head of a committee, but the members elect a different informal leader among themselves. He...",
    "He is working on a tight deadline when his computer suffers a massive hardware failure. He...",
    "He sees a senior student demanding money from a junior in the college canteen. He...",
    "He has an important meeting in 30 minutes but spills coffee all over his only clean shirt. He...",
    "He is swimming in a pool and sees a child struggling at the deep end, while the lifeguard is distracted. He...",
    "His team member refuses to accept their mistake, causing the whole team to be penalized. He...",
    "He finds a pendrive outside his office building labeled 'Confidential Salaries'. He...",
    "He is trekking and his friend starts suffering from acute mountain sickness. He...",
    "He is traveling in an AC train coach and the AC completely stops working in peak summer. He...",
    "He sees a biker hit a dog and drive away without stopping. He...",
    "He is preparing for his sister's marriage, and the decorator demands double the agreed amount on the wedding day. He...",
    "His manager asks him to spy on his colleagues and report their informal discussions. He...",
    "He is driving and a political rally suddenly blocks his car, aggressively chanting slogans. He...",
    "He discovers that his younger sibling is being cyberbullied. He...",
    "He is waiting for an interview and overhears the interviewers making fun of the previous candidate. He...",
    "He finds an injured eagle with a broken wing in his backyard. He...",
    "His roommate leaves the room in a complete mess every day despite repeated warnings. He...",
    "He is given a task that directly contradicts his personal moral values. He...",
    "He is running late for his final exam and his bus breaks down halfway. He...",
    "He sees a suspicious person deliberately dropping a packet into a public dustbin and walking away fast. He...",
    "He is leading a college trek, but heavy rains wash away the only path back to the base. He...",
    "He realizes he has boarded the wrong train and it is an express train with no stops for 4 hours. He...",
    "His friend asks him to provide a false alibi for a minor car accident. He...",
    "He is organizing a college fest and the main sponsor backs out a week before the event. He...",
    "He is driving on a deserted highway and sees a woman waving frantically for a lift. He...",
    "He is at a bank and the server goes down right when he has to transfer emergency medical funds. He...",
    "He sees a group of people cutting down old trees in his neighborhood illegally. He...",
    "He is trapped in a public washroom because the door lock jams from the inside. He...",
    "His team loses a crucial match and the opposing team starts mocking them aggressively. He...",
    "He is trekking in the snow and begins to experience severe altitude sickness. He...",
    "He is at a restaurant and a waiter spills hot soup on him. He...",
    "He sees a person attempting to steal a car. He...",
    "He is studying for a crucial exam, but his neighbor throws a loud party. He...",
    "He discovers a major error in a report his team is about to submit to the director. He...",
    "He is in a foreign country and gets severely sick. He...",
    "He is appointed team captain, but half the team protests the decision. He...",
    "He sees a man beating his wife on the street. He...",
    "He is driving and a tire bursts at high speed. He...",
    "He is trapped inside a bank during an armed robbery. He...",
    "He receives a package containing illegal drugs delivered to him by mistake. He...",
    "He is preparing for the SSB, but falls severely ill a week before. He...",
    "He is hiking and his friend falls into a deep ravine, breaking his leg. He...",
    "He is cooking and hot oil spills on his hand. He...",
    "He is on a boat that starts taking on water rapidly. He...",
    "He sees a colleague stealing office supplies. He...",
    "He is walking home and a gang of youths demands his phone and wallet. He...",
    "He is at a busy intersection and the traffic lights fail, causing a massive jam. He...",
    "He is given a task that requires specialized software he doesn't know how to use. He...",
    "He is in a movie theater and smells smoke coming from the projector room. He...",
    "He finds out his brother has massive gambling debts. He...",
    "He is leading a patrol and his radio breaks down in hostile territory. He...",
    "He sees a child playing dangerously close to an open manhole. He...",
    "He is taking a shower and the water supply suddenly stops completely. He...",
    "He is unfairly passed over for a promotion in favor of the boss's nephew. He...",
    "He finds a briefcase full of cash on a park bench. He..."
  ],

  "PPDT": {
    "image_url": "https://picsum.photos/seed/ppdt_set6/800/600?blur=5",
    "description": "Hazy picture of a person holding a lantern, standing at the entrance of what looks like a dark cave or tunnel."
  },

  "PI": [
    "Tell me about a time you had to confront a friend about their unethical behavior.",
    "What are the major challenges in India's education system and how would you fix them?",
    "Describe a time when you completely failed at something you were highly confident about.",
    "If you could have any superpower, what would it be and how would you use it?",
    "What is your opinion on the increasing use of cryptocurrency?",
    "How do you handle situations where you are forced to work with people from very different backgrounds?",
    "What is the most difficult conversation you've ever had?",
    "Tell me about a time you had to convince a group to change their decision.",
    "How do you ensure you stay physically fit during stressful periods?",
    "What are your views on the concept of a cashless economy in rural India?",
    "Have you ever broken a promise? Why?",
    "What are the three most important things in your life?",
    "If you are ordered to do something by a senior that you know will fail, what do you do?",
    "What is your biggest fear?",
    "Tell me about a time you had to learn a completely new skill from scratch in a short time.",
    "How do you define patriotism?",
    "What role does religion or spirituality play in your life?",
    "Tell me about a time you had to mediate a conflict between two strangers.",
    "If you were not pursuing the Armed Forces, what specific career would you be in right now?",
    "Why do you think some intelligent people fail in the Armed Forces?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to improve in yourself?"
  ],

  "Lecturette": [
    "Cryptocurrency: Future or Fraud?",
    "E-learning vs Traditional Classroom Education",
    "The Need for Global Military Alliances",
    "Cashless Economy in India: Progress and Pitfalls"
  ],

  "GD": [
    "Should capital punishment be abolished in all circumstances?",
    "Is brain drain a serious threat to India's development?"
  ],

  "GPE": {
    "narrative": "You are a group of 8 engineering students traveling in a hilly terrain. It is 1400 hours. A panicked local runs up to you and informs you: 1. A state transport bus has been hijacked by armed miscreants and is parked in a nearby abandoned quarry (3 km away). 2. A young boy in his village (2 km away) has mistakenly consumed pesticide and needs urgent stomach pumping at a hospital. 3. The only bridge connecting this region to the nearest city (15 km away) has developed severe cracks and a heavy goods train is scheduled to pass over it at 1530 hours. You have two motorcycles, your engineering toolkits, and a basic first aid box. The nearest police station and hospital are in the city across the bridge. How will you divide your group and prioritize these tasks to avert disaster?",
    "map_url": "https://picsum.photos/seed/gpe_map_set6/800/600"
  },

  "GTO": {
    "PGT": "Progressive Group Task: 4 progressive obstacles emphasizing vertical climbing and bridging. Resources: 1 Plank, 1 Balli, 2 Ropes, 1 pulley. Time: 45 mins.",
    "HGT": "Half Group Task: 1 complex obstacle involving a heavy counterweight. Resources: 1 Plank, 1 Balli, 1 Rope. Time: 15 mins.",
    "IO": "Individual Obstacles: 10 obstacles (High Jump, Double Ditch, Zig-Zag Balance, Tarzan Swing, Commando Walk, Tiger Leap, Rope Climbing, Screen Jump, Burma Bridge, Monkey Crawl). Time: 3 mins.",
    "FGT": "Final Group Task: 1 long, complex obstacle requiring the entire group to transport sensitive 'ammunition' (fragile box) across a wide gap without jerking it. Resources: Plank, Balli, 2 Ropes. Time: 15 mins."
  }
}

with open(os.path.join(OUTPUT_DIR, "set_06.json"), 'w', encoding='utf-8') as f:
    json.dump(set_06_data, f, indent=2)

print("Set 6 created successfully without CPSS.")
