import json
import os

OUTPUT_DIR = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\database\datasets\curated_sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

set_08_data = {
  "set_id": "SET_08",
  "description": "High-Quality Curated SSB Dataset - Set 8 (Without CPSS)",
  
  "TAT": [
    {"pic_no": 1, "description": "A person standing at the edge of a high cliff, looking down at a river.", "image_url": "https://picsum.photos/seed/tat_set8_1/800/600"},
    {"pic_no": 2, "description": "A group of scientists in a control room looking intensely at a large screen showing a rocket.", "image_url": "https://picsum.photos/seed/tat_set8_2/800/600"},
    {"pic_no": 3, "description": "A woman kneeling down to talk to a distressed, crying child in a supermarket.", "image_url": "https://picsum.photos/seed/tat_set8_3/800/600"},
    {"pic_no": 4, "description": "Two individuals aggressively arguing over a blueprint on a construction site.", "image_url": "https://picsum.photos/seed/tat_set8_4/800/600"},
    {"pic_no": 5, "description": "A man looking out of a train window with a highly melancholic expression.", "image_url": "https://picsum.photos/seed/tat_set8_5/800/600"},
    {"pic_no": 6, "description": "A student standing outside the principal's office with a folded paper in hand.", "image_url": "https://picsum.photos/seed/tat_set8_6/800/600"},
    {"pic_no": 7, "description": "A group of people trying to push a heavy wooden boat into the ocean.", "image_url": "https://picsum.photos/seed/tat_set8_7/800/600"},
    {"pic_no": 8, "description": "A person walking alone in a dense, dark forest with a flashlight.", "image_url": "https://picsum.photos/seed/tat_set8_8/800/600"},
    {"pic_no": 9, "description": "A doctor looking exhausted, leaning against a hospital wall.", "image_url": "https://picsum.photos/seed/tat_set8_9/800/600"},
    {"pic_no": 10, "description": "A young man handing over a thick envelope to an elderly person.", "image_url": "https://picsum.photos/seed/tat_set8_10/800/600"},
    {"pic_no": 11, "description": "A crowd cheering while one person stands silently in the middle.", "image_url": "https://picsum.photos/seed/tat_set8_11/800/600"},
    {"pic_no": 12, "description": "BLANK PICTURE", "image_url": None}
  ],
  
  "WAT": [
    "Wealth", "Poverty", "Rich", "Poor", "Money", "Coin", "Bank", "Save", "Spend", "Waste",
    "Debt", "Loan", "Pay", "Buy", "Sell", "Shop", "Market", "Trade", "Profit", "Loss",
    "Success", "Ambition", "Desire", "Wish", "Dream", "Goal", "Aim", "Target", "Purpose", "Life",
    "Death", "Health", "Sick", "Disease", "Cure", "Heal", "Medicine", "Doctor", "Nurse", "Hospital",
    "Ward", "Bed", "Sleep", "Wake", "Alert", "Aware", "Mind", "Think", "Idea", "Thought",
    "Memory", "Forget", "Remember", "Recall", "Past", "History", "Heritage", "Culture", "Tradition", "Modern"
  ],

  "SRT": [
    "He is waiting for a crucial job interview and suddenly a fellow candidate faints. He...",
    "His team is working on a highly confidential project, and he spots a member taking photos of the documents. He...",
    "While returning home, he sees a group of men aggressively harassing a street vendor. He...",
    "He is given a task that requires traveling to a remote village, but his car breaks down halfway. He...",
    "He discovers that his younger sibling has been bunking school for a month. He...",
    "He is the captain of a sports team, but the star player refuses to follow his strategy. He...",
    "He finds a wallet containing a large sum of money and important ID cards on a park bench. He...",
    "During a trek, his group loses their way and their food supply is almost over. He...",
    "He is preparing for his final exams, but his neighbor plays loud music every night. He...",
    "He sees a suspicious package left unattended in a crowded bus. He...",
    "He is offered a bribe to clear a substandard shipment of materials. He...",
    "He accidentally damages a borrowed, expensive laptop right before returning it. He...",
    "He is trapped in a building during an earthquake. He...",
    "His close friend asks him to lie to his parents about a weekend trip. He...",
    "He is managing a college event, and the main sponsor backs out at the last minute. He...",
    "He sees a person drowning in a river, but he doesn't know how to swim. He...",
    "He is traveling on a train and his luggage gets stolen while he is asleep. He...",
    "He receives a blackmail email threatening to leak personal information. He...",
    "He is given a critical task, but his teammates are completely uncooperative. He...",
    "He notices a fire breaking out in the building opposite his apartment. He...",
    "He is driving and accidentally hits a stray animal on the highway. He...",
    "He is falsely accused of cheating during an examination. He...",
    "He finds out that a senior officer is taking credit for his hard work. He...",
    "He is stuck in a massive traffic jam and has to reach a hospital with a critically ill patient. He...",
    "His parents strongly oppose his career choice. He...",
    "He sees a woman being robbed of her purse on a busy street. He...",
    "He is trekking in the mountains and one of his team members gets a severe sprain. He...",
    "He is at a restaurant and a customer at the next table starts choking. He...",
    "He is in a foreign country, loses his passport, and doesn't speak the local language. He...",
    "He is given a task that he feels is morally wrong but it is a direct order. He...",
    "His best friend confesses to committing a serious crime and asks him to hide him. He...",
    "He is driving on a highway and sees a car plunge into a deep canal. He...",
    "He is running a marathon and is in the lead, but sees a fellow runner twist their ankle badly. He...",
    "He is in charge of a project and the budget is suddenly cut by 50%. He...",
    "He finds a bag full of explosives near a crowded marketplace. He...",
    "He is wrongly accused of theft by his classmates. He...",
    "He is at a railway station and sees a child slip between the platform and a moving train. He...",
    "His subordinates refuse to work overtime during a critical crisis. He...",
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
    "He is riding a bike and the brakes fail on a steep downhill slope. He..."
  ],

  "PPDT": {
    "image_url": "https://picsum.photos/seed/ppdt_set8/800/600?blur=5",
    "description": "Hazy picture of a person looking at a bright screen in a completely dark room."
  },

  "PI": [
    "Tell me about a time when you had to deal with intense anger. How did you control it?",
    "What are your thoughts on the brain drain issue in India?",
    "Describe a time when you had to make a choice between two equally good options.",
    "If you could start a business tomorrow, what would it be and why?",
    "What is your opinion on the commercialization of space travel?",
    "How do you handle situations where you feel completely overwhelmed?",
    "What is the most significant challenge you have faced in your life so far?",
    "Tell me about a time you had to change a deeply held belief.",
    "How do you stay motivated during long periods of tedious work?",
    "What are your views on India's efforts towards 'Atmanirbhar Bharat' in defense manufacturing?",
    "Have you ever felt discriminated against? How did you respond?",
    "What are the three things you would like to change about your hometown?",
    "If you are assigned to a remote border post with no internet for a year, how will you spend your time?",
    "What is your biggest regret and what did you learn from it?",
    "Tell me about a time you had to deliver bad news to someone.",
    "How do you define personal integrity?",
    "What role does art or creativity play in your life?",
    "Tell me about a time you had to take a stand against a popular opinion.",
    "If you had the power to pass one law in India, what would it be?",
    "Why do you think the SSB process takes five days instead of a standard one-hour interview?"
  ],

  "SD": [
    "What is the opinion of your parents about you?",
    "What do your teachers or employers think about you?",
    "What do your friends think about you?",
    "What is your own opinion about yourself?",
    "What are the qualities you would like to improve in yourself?"
  ],

  "Lecturette": [
    "Space Tourism: The Next Frontier",
    "Mental Health Awareness in Society",
    "Brain Drain: Causes and Solutions",
    "Atmanirbhar Bharat (Self-Reliance) in Defence"
  ],

  "GD": [
    "Should 1 year of military service be made compulsory for all Indian youth?",
    "Impact of violent video games on the psychology of youth."
  ],

  "GPE": {
    "narrative": "You are a group of 10 security personnel assigned to escort a VIP through a forested region. It is 1400 hours. A scout returns and informs you: 1. A heavily armed insurgent group has set up a roadblock 5 km ahead to hijack the VIP's car. 2. A local village 3 km to the East has reported a severe cholera outbreak and urgently needs medical supplies that you are carrying. 3. Your primary communication radio has malfunctioned due to terrain interference. 4. One of your team members has accidentally stepped on a rusted nail and is bleeding severely. You have two armored SUVs, basic medical kits, and your weapons. The nearest army base is 15 km away, but the terrain is rough. How will you secure the VIP, handle the medical emergencies, and deal with the insurgents before nightfall at 1800 hours?",
    "map_url": "https://picsum.photos/seed/gpe_map_set8/800/600"
  },

  "GTO": {
    "PGT": "Progressive Group Task: 4 progressive obstacles emphasizing height and rope work. Resources: 1 Plank, 2 Ballis (different lengths), 2 Ropes. Time: 45 mins.",
    "HGT": "Half Group Task: 1 complex obstacle involving a tricky cantilever over a 'water' hazard. Resources: 1 Plank, 1 Balli, 1 Rope. Time: 15 mins.",
    "IO": "Individual Obstacles: 10 obstacles (High Jump, Double Ditch, Zig-Zag Balance, Tarzan Swing, Commando Walk, Tiger Leap, Rope Climbing, Screen Jump, Burma Bridge, Monkey Crawl). Time: 3 mins.",
    "FGT": "Final Group Task: 1 long, complex obstacle requiring the entire group to transport a heavy 'radar component' across a wide gap. Resources: Plank, Balli, 3 Ropes. Time: 15 mins."
  }
}

with open(os.path.join(OUTPUT_DIR, "set_08.json"), 'w', encoding='utf-8') as f:
    json.dump(set_08_data, f, indent=2)

print("Set 8 created successfully without CPSS.")
