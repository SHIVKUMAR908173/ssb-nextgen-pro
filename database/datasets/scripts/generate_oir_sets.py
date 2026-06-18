#!/usr/bin/env python3
"""
OIR Practice Bank Generator
Generates 96 sets of OIR questions:
- Sets 1-48: Verbal Reasoning
- Sets 49-96: Non-Verbal Reasoning
"""

import json
import random
import os

# ==================== VERBAL REASONING QUESTION BANKS ====================

SYNONYM_QUESTIONS = [
    ("BRAVE", "Courageous", ["Cowardly", "Weak", "Timid", "Strong"]),
    ("HONEST", "Truthful", ["Dishonest", "Clever", "Brave", "Smart"]),
    ("INTELLIGENT", "Wise", ["Foolish", "Strong", "Fast", "Loud"]),
    ("COURAGE", "Bravery", ["Fear", "Weakness", "Cowardice", "Doubt"]),
    ("VICTORY", "Triumph", ["Defeat", "Loss", "Failure", "Surrender"]),
    ("LEADER", "Commander", ["Follower", "Subordinate", "Junior", "Assistant"]),
    ("STRATEGY", "Plan", ["Confusion", "Chaos", "Disorder", "Mistake"]),
    ("DISCIPLINE", "Order", ["Chaos", "Disorder", "Confusion", "Anarchy"]),
    ("LOYALTY", "Faithfulness", ["Betrayal", "Treachery", "Disloyalty", "Deceit"]),
    ("DETERMINATION", "Resolve", ["Doubt", "Hesitation", "Uncertainty", "Weakness"]),
    ("TACTICAL", "Strategic", ["Random", "Unplanned", "Careless", "Hasty"]),
    ("RESILIENT", "Strong", ["Weak", "Fragile", "Brittle", "Delicate"]),
    ("INITIATIVE", "Leadership", ["Passivity", "Laziness", "Indifference", "Apathy"]),
    ("INTEGRITY", "Honesty", ["Dishonesty", "Corruption", "Deceit", "Fraud"]),
    ("ENDURANCE", "Stamina", ["Weakness", "Fatigue", "Exhaustion", "Tiredness"]),
]

ANTONYM_QUESTIONS = [
    ("VICTORY", "Defeat", ["Success", "Triumph", "Win", "Achievement"]),
    ("COWARD", "Brave", ["Weak", "Fearful", "Timid", "Scared"]),
    ("ATTACK", "Defend", ["Assault", "Charge", "Strike", "Offend"]),
    ("ENEMY", "Friend", ["Foe", "Opponent", "Rival", "Adversary"]),
    ("DANGEROUS", "Safe", ["Risky", "Hazardous", "Perilous", "Threatening"]),
    ("WEAK", "Strong", ["Feeble", "Fragile", "Powerless", "Worthless"]),
    ("CHAOS", "Order", ["Confusion", "Disorder", "Anarchy", "Mess"]),
    ("FAILURE", "Success", ["Defeat", "Loss", "Setback", "Downfall"]),
    ("RECKLESS", "Careful", ["Rash", "Impulsive", "Hasty", "Careless"]),
    ("SELFISH", "Generous", ["Greedy", "Stingy", "Mean", "Self-centered"]),
    ("ARROGANT", "Humble", ["Proud", "Boastful", "Conceited", "Vain"]),
    ("COMPLEX", "Simple", ["Complicated", "Difficult", "Intricate", "Convoluted"]),
    ("PERMANENT", "Temporary", ["Lasting", "Eternal", "Everlasting", "Enduring"]),
    ("OPTIMISTIC", "Pessimistic", ["Positive", "Hopeful", "Confident", "Cheerful"]),
    ("EXPAND", "Contract", ["Increase", "Grow", "Enlarge", "Extend"]),
]

ANALOGY_QUESTIONS = [
    ("Soldier is to Army as Sailor is to", "Navy", ["Ship", "Ocean", "Captain", "Port"]),
    ("Doctor is to Hospital as Teacher is to", "School", ["Student", "Book", "Class", "Lesson"]),
    ("Pilot is to Aircraft as Driver is to", "Vehicle", ["Road", "Wheel", "Engine", "Fuel"]),
    ("Captain is to Team as General is to", "Army", ["Soldier", "War", "Battle", "Strategy"]),
    ("Gun is to Bullet as Bow is to", "Arrow", ["String", "Target", "Quiver", "Aim"]),
    ("Ocean is to Water as Desert is to", "Sand", ["Hot", "Dry", "Cactus", "Camel"]),
    ("Clock is to Time as Thermometer is to", "Temperature", ["Heat", "Cold", "Fever", "Weather"]),
    ("Pen is to Write as Knife is to", "Cut", ["Sharp", "Blade", "Kitchen", "Food"]),
    ("Book is to Read as Map is to", "Navigate", ["Travel", "Explore", "Guide", "Direction"]),
    ("Soldier is to Rifle as Archer is to", "Bow", ["Arrow", "Quiver", "Target", "Aim"]),
    ("Hospital is to Patient as School is to", "Student", ["Teacher", "Class", "Book", "Lesson"]),
    ("Judge is to Court as Priest is to", "Temple", ["Prayer", "God", "Worship", "Religion"]),
    ("Eye is to See as Ear is to", "Hear", ["Sound", "Listen", "Noise", "Music"]),
    ("Food is to Hunger as Water is to", "Thirst", ["Drink", "River", "Ocean", "Rain"]),
    ("India is to Delhi as France is to", "Paris", ["London", "Berlin", "Rome", "Madrid"]),
]

CLASSIFICATION_QUESTIONS = [
    ("Find the odd one out", "Hospital", ["Army", "Navy", "Air Force", "Hospital"]),
    ("Find the odd one out", "Circle", ["Triangle", "Square", "Rectangle", "Circle"]),
    ("Find the odd one out", "Professor", ["Captain", "Major", "Lieutenant", "Professor"]),
    ("Find the odd one out", "Ear", ["Eye", "Nose", "Tongue", "Ear"]),
    ("Find the odd one out", "Car", ["Tank", "Jeep", "Truck", "Car"]),
    ("Find the odd one out", "River", ["Ocean", "Sea", "Lake", "River"]),
    ("Find the odd one out", "Gun", ["Sword", "Spear", "Shield", "Gun"]),
    ("Find the odd one out", "Gold", ["Iron", "Copper", "Steel", "Gold"]),
    ("Find the odd one out", "Snake", ["Lion", "Tiger", "Bear", "Snake"]),
    ("Find the odd one out", "Football", ["Hockey", "Cricket", "Badminton", "Football"]),
    ("Find the odd one out", "Helicopter", ["Fighter Jet", "Bomber", "Cargo Plane", "Helicopter"]),
    ("Find the odd one out", "Winter", ["Summer", "Spring", "Autumn", "Winter"]),
    ("Find the odd one out", "Paper", ["Pen", "Pencil", "Eraser", "Paper"]),
    ("Find the odd one out", "Chair", ["Table", "Desk", "Stool", "Chair"]),
    ("Find the odd one out", "Mountain", ["Valley", "Hill", "Peak", "Mountain"]),
]

CODING_QUESTIONS = [
    ("If ARMY is coded as BSNZ, how is NAVY coded?", "OBWZ", ["MCUX", "OAWZ", "NBWZ"]),
    ("If DELHI is coded as EFMJI, how is MUMBAI coded?", "NVNCBJ", ["LTLAZH", "NVOCBJ", "MTLZHI"]),
    ("If INDIA is coded as JOEJB, how is PAKISTAN coded?", "QBLJTUBO", ["OZJHRSHM", "QBLJSTUBO", "PZKJTUBO"]),
    ("If SOLDIER is coded as TPMHJFS, how is WARRIOR coded?", "XBSSJPS", ["WZRRJPS", "XBRRJOS", "XBSRJPS"]),
    ("If BATTLE is coded as CBUUMF, how is VICTORY coded?", "WJDUPSZ", ["VJDUPSZ", "WIDUPSZ", "WJCTPSZ"]),
    ("If COMMAND is coded as DPNNBOE, how is SOLDIER coded?", "TPMEJFS", ["SPMEJFS", "TPMDJFS", "TOMDJFS"]),
    ("If DEFENSE is coded as EFEFOTF, how is ATTACK coded?", "BUUBDL", ["BVUBDL", "BUVBDL", "BVVBDL"]),
    ("If STRATEGY is coded as TUSBUFHZ, how is TACTICAL coded?", "UBDUJDBM", ["UBDUJCBM", "VBDUJDBM", "UBDUKDBM"]),
    ("If INTELLIGENCE is coded as JOUFMMJHFODF, how is KNOWLEDGE coded?", "LOPXMFEHF", ["LMPXMFEHF", "LOPWNFEHF", "LOPXMEHF"]),
    ("If PATRIOT is coded as QBUSJPU, how is NATION coded?", "OBUJPO", ["PBUJPO", "OATJPO", "OBUKPO"]),
    ("If BRAVERY is coded as CSVWFSZ, how is HONOR coded?", "IPOPS", ["IPONS", "HONPS", "IPQPS"]),
    ("If MILITARY is coded as NJMJUBSZ, how is CIVILIAN coded?", "DJWJMJBO", ["DJWJMKBO", "CIWJMJBO", "DJWJMJCN"]),
    ("If BORDER is coded as CPSEFS, how is FRONTLINE coded?", "GSPOUMJOF", ["GSPNTMJOF", "GSPOUMJNE", "GSQOUMJOF"]),
    ("If WEAPON is coded as XF BQPO, how is AMMUNITION coded?", "BNNVOJUJPO", ["BMMVOJUJPO", "BONVOJUJPO", "BNNWOJUJPO"]),
    ("If REGIMENT is coded as SFHJNFOU, how is BATTALION coded?", "CBUUBMJPO", ["CBUUBMION", "CAUUBMJPO", "CBVUBMJPO"]),
]

BLOOD_RELATION_QUESTIONS = [
    ("Pointing to a photograph, a man said, 'I have no brother or sister, but that man's father is my father's son.' Whose photograph was it?", "His son", ["His own", "His father", "His nephew"]),
    ("A is B's brother. C is D's father. E is B's mother. A and D are brothers. How is E related to C?", "Wife", ["Sister", "Sister-in-law", "Mother"]),
    ("Rahul's mother is the only daughter of Priya's father. How is Priya related to Rahul?", "Mother", ["Aunt", "Sister", "Grandmother"]),
    ("X is the brother of Y. Z is the sister of X. How is Y related to Z?", "Brother or Sister", ["Brother", "Sister", "Cousin"]),
    ("A man said to a woman, 'Your mother's husband's sister is my aunt.' How is the woman related to the man?", "Sister", ["Cousin", "Aunt", "Mother"]),
    ("P is Q's brother. R is Q's mother. S is R's father. How is P related to S?", "Grandson", ["Son", "Nephew", "Great-grandson"]),
    ("My father's only child's daughter is my:", "Daughter", ["Niece", "Sister", "Cousin"]),
    ("If A is B's sister and C is B's mother, how is A related to C?", "Daughter", ["Sister", "Niece", "Granddaughter"]),
    ("Rahul pointed to a lady and said, 'She is the daughter of my grandfather's only son.' How is the lady related to Rahul?", "Sister", ["Cousin", "Mother", "Aunt"]),
    ("X's mother is Y's daughter. How is X related to Y?", "Grandson/Granddaughter", ["Son", "Nephew", "Great-grandson"]),
    ("A man said, 'The son of her only brother is the brother of my wife.' How is the woman related to the man?", "Mother-in-law's sister", ["Aunt", "Sister-in-law", "Mother"]),
    ("P is the father of Q. R is the son of S. Q is the sister of R. How is S related to P?", "Wife", ["Daughter", "Sister", "Mother"]),
    ("My brother's sister's father is my:", "Father", ["Uncle", "Brother", "Grandfather"]),
    ("A is the father of B. C is the father of A. How is B related to C?", "Grandchild", ["Son", "Nephew", "Great-grandson"]),
    ("X is Y's brother. Z is X's sister. How is Y related to Z?", "Brother or Sister", ["Brother", "Sister", "Cousin"]),
]

SERIES_QUESTIONS = [
    ("Complete the series: 2, 6, 12, 20, 30, ?", "42", ["40", "44", "36"]),
    ("Complete the series: 1, 4, 9, 16, 25, ?", "36", ["30", "49", "35"]),
    ("Complete the series: 3, 6, 12, 24, 48, ?", "96", ["72", "84", "64"]),
    ("Complete the series: 5, 10, 20, 40, 80, ?", "160", ["120", "100", "140"]),
    ("Complete the series: 1, 3, 7, 15, 31, ?", "63", ["47", "55", "59"]),
    ("Complete the series: 2, 5, 10, 17, 26, ?", "37", ["35", "39", "33"]),
    ("Complete the series: 4, 9, 16, 25, 36, ?", "49", ["45", "47", "44"]),
    ("Complete the series: 7, 14, 28, 56, 112, ?", "224", ["168", "196", "180"]),
    ("Complete the series: 1, 8, 27, 64, 125, ?", "216", ["150", "180", "196"]),
    ("Complete the series: 11, 13, 17, 19, 23, ?", "29", ["25", "27", "31"]),
    ("Complete the series: 2, 3, 5, 8, 13, 21, ?", "34", ["29", "31", "32"]),
    ("Complete the series: 100, 95, 85, 70, 50, ?", "25", ["30", "35", "20"]),
    ("Complete the series: 1, 2, 6, 24, 120, ?", "720", ["360", "480", "600"]),
    ("Complete the series: 13, 17, 23, 29, 37, ?", "41", ["39", "43", "45"]),
    ("Complete the series: 3, 7, 15, 31, 63, ?", "127", ["95", "105", "119"]),
]

DIRECTION_QUESTIONS = [
    ("Rahul walks 5 km North, then turns right and walks 3 km. He again turns right and walks 5 km. How far is he from the starting point?", "3 km", ["5 km", "8 km", "2 km"]),
    ("A man faces East. He turns 90° clockwise, then 180° anticlockwise. Which direction is he facing now?", "West", ["East", "North", "South"]),
    ("A person walks 10 km South, then turns left and walks 6 km. He turns left again and walks 10 km. How far is he from the starting point?", "6 km", ["10 km", "16 km", "4 km"]),
    ("If North is called East, East is called South, South is called West, and West is called North, in which direction will the sun set?", "East", ["West", "North", "South"]),
    ("A man walks 4 km towards North, then turns right and walks 3 km. What is the shortest distance from the starting point?", "5 km", ["7 km", "1 km", "4 km"]),
    ("At 3 o'clock, the minute hand points towards North-East. In which direction does the hour hand point?", "East", ["North", "South", "West"]),
    ("A shadow falls to your right in the morning. Which direction are you facing?", "South", ["North", "East", "West"]),
    ("Ravi walks 8 km North, then 6 km East. How far is he from the starting point?", "10 km", ["14 km", "2 km", "7 km"]),
    ("A man is facing North-West. He turns 90° clockwise, then 135° anticlockwise. Which direction is he facing?", "West", ["North", "South", "East"]),
    ("If you go North, turn right, then turn right again, which direction are you facing?", "South", ["North", "East", "West"]),
    ("A car travels 12 km South, then turns left and travels 5 km. How far is it from the starting point?", "13 km", ["17 km", "7 km", "10 km"]),
    ("At sunrise, a man's shadow falls exactly behind him. Which direction is he facing?", "East", ["West", "North", "South"]),
    ("A person walks 3 km West, then 4 km North. What is the shortest distance from start?", "5 km", ["7 km", "1 km", "4 km"]),
    ("If South-East becomes North, North-East becomes West, what will West become?", "South-East", ["North-East", "South-West", "North-West"]),
    ("A man walks 10 km towards East, then 10 km towards North. How far is he from the start?", "14.14 km", ["20 km", "10 km", "15 km"]),
]

RANKING_QUESTIONS = [
    ("In a class of 50 students, Rahul ranks 15th from the top. What is his rank from the bottom?", "36th", ["35th", "34th", "37th"]),
    ("In a row of 40 soldiers, A is 12th from the left. What is his position from the right?", "29th", ["28th", "30th", "27th"]),
    ("If you are 8th from either end of a row, how many people are in the row?", "15", ["16", "14", "17"]),
    ("In a class, Ravi is 10th from the top and 25th from the bottom. How many students are there?", "34", ["35", "33", "36"]),
    ("In a queue, A is 15th from the front and B is 20th from the end. If there are 40 people, how many are between them?", "5", ["6", "4", "7"]),
    ("In a race, you overtake the person in 2nd place. What is your position now?", "2nd", ["1st", "3rd", "4th"]),
    ("In a class of 100 students, Priya ranks 25th. What is her rank from the bottom?", "76th", ["75th", "74th", "77th"]),
    ("A is taller than B but shorter than C. D is taller than C. Who is the shortest?", "B", ["A", "C", "D"]),
    ("In a row, A is 7th from the left and B is 9th from the right. After they interchange, A becomes 11th from the left. How many people are in the row?", "19", ["18", "20", "17"]),
    ("If Ram is 5 ranks above Shyam who is 15th from the bottom in a class of 30, what is Ram's rank from the top?", "11th", ["10th", "12th", "9th"]),
    ("In a queue of 50 people, A is 25th from the front and B is 25th from the back. How many people are between them?", "0", ["1", "2", "24"]),
    ("A is 6th from the left, B is 5th from the right. After interchanging, A is 10th from the left. Total people?", "14", ["15", "13", "16"]),
    ("In a class of 60, A is 20th from the top. B is 5 ranks below A. What is B's rank from the bottom?", "45th", ["44th", "46th", "40th"]),
    ("Three people A, B, C are in a race. A is not first. B is not first or last. Who is first?", "C", ["A", "B", "Cannot determine"]),
    ("In a row of boys, A is 10th from the left and B is 9th from the right. After interchanging, A is 15th from the left. How many boys?", "23", ["24", "22", "25"]),
]

MATHEMATICAL_QUESTIONS = [
    ("If 5 men can do a work in 12 days, how many days will 10 men take?", "6 days", ["24 days", "8 days", "10 days"]),
    ("A train covers 120 km in 2 hours. What is its speed in m/s?", "16.67 m/s", ["60 m/s", "33.33 m/s", "20 m/s"]),
    ("If 3 pens cost Rs. 45, what is the cost of 7 pens?", "Rs. 105", ["Rs. 90", "Rs. 115", "Rs. 100"]),
    ("A soldier runs 400 meters in 80 seconds. What is his speed in km/hr?", "18 km/hr", ["20 km/hr", "16 km/hr", "15 km/hr"]),
    ("If a rifle fires 60 bullets in 2 minutes, how many bullets in 10 seconds?", "5 bullets", ["6 bullets", "10 bullets", "3 bullets"]),
    ("A tank is filled by a pipe in 10 hours. What part of the tank is filled in 4 hours?", "2/5", ["1/3", "1/2", "3/5"]),
    ("If 15 soldiers consume 45 kg of rice in a month, how much will 25 soldiers consume?", "75 kg", ["60 kg", "90 kg", "80 kg"]),
    ("A vehicle travels at 60 km/hr. How far will it go in 45 minutes?", "45 km", ["60 km", "30 km", "40 km"]),
    ("If 8 machines produce 80 items in 1 hour, how many items will 12 machines produce in 2 hours?", "240 items", ["180 items", "200 items", "160 items"]),
    ("A sum of Rs. 1000 is divided among 4 soldiers in the ratio 2:3:4:1. What is the largest share?", "Rs. 400", ["Rs. 300", "Rs. 500", "Rs. 350"]),
    ("If 20 workers build a wall in 30 days, how many workers are needed to build it in 15 days?", "40 workers", ["30 workers", "50 workers", "35 workers"]),
    ("A clock gains 5 minutes every hour. How much will it gain in 12 hours?", "60 minutes", ["50 minutes", "45 minutes", "55 minutes"]),
    ("If 10 soldiers can dig a trench in 8 hours, how long will 4 soldiers take?", "20 hours", ["16 hours", "24 hours", "12 hours"]),
    ("A vehicle consumes 10 liters of fuel for 100 km. How much for 250 km?", "25 liters", ["20 liters", "30 liters", "15 liters"]),
    ("If the cost price is Rs. 80 and selling price is Rs. 100, what is the profit percentage?", "25%", ["20%", "30%", "15%"]),
]

WORD_FORMATION_QUESTIONS = [
    ("Which word cannot be formed from 'INTELLIGENCE'?", "SINGLE", ["TILE", "GENTLE", "TENCE"]),
    ("Which word cannot be formed from 'SOLDIER'?", "RISE", ["SOLD", "LIED", "IDEAL"]),
    ("Which word cannot be formed from 'BATTLEFIELD'?", "DEFILE", ["TABLE", "FABLE", "LIFE"]),
    ("Which word cannot be formed from 'COURAGE'?", "RACE", ["CAGE", "GEAR", "CURE"]),
    ("Which word cannot be formed from 'VICTORY'?", "TRY", ["CITY", "RICE", "VIRY"]),
    ("Which word cannot be formed from 'STRATEGY'?", "TARGET", ["RATE", "TEAR", "STAR"]),
    ("Which word cannot be formed from 'DEFENSE'?", "NEED", ["SEEN", "SEND", "FEED"]),
    ("Which word cannot be formed from 'COMMANDO'?", "MANDO", ["COMMAND", "MOOD", "DANCE"]),
    ("Which word cannot be formed from 'PATRIOT'?", "TRIOT", ["PART", "TRAP", "ROTATE"]),
    ("Which word cannot be formed from 'BRAVERY'?", "BRAVE", ["VERY", "BEAR", "RAY"]),
    ("Which word cannot be formed from 'MILITARY'?", "MILITIA", ["MILK", "TRIAL", "LIMIT"]),
    ("Which word cannot be formed from 'REGIMENT'?", "MINT", ["TIGER", "REMIT", "GENTLE"]),
    ("Which word cannot be formed from 'WEAPON'?", "OPEN", ["WANE", "PAWN", "WEEP"]),
    ("Which word cannot be formed from 'BORDER'?", "RIDE", ["BRED", "RODE", "DORE"]),
    ("Which word cannot be formed from 'AMMUNITION'?", "NATION", ["UNIT", "MINT", "MOTION"]),
]

# ==================== NON-VERBAL REASONING QUESTION BANKS ====================

SERIES_COMPLETION_QUESTIONS = [
    ("Complete the series: △, □, ○, △, □, ?", "○", ["△", "□", "◇"]),
    ("Complete the series: →, ↑, ←, ↓, →, ?", "↑", ["←", "↓", "↗"]),
    ("Complete the series: ▲, ■, ●, ▲, ■, ?", "●", ["▲", "■", "◆"]),
    ("Complete the series: A, C, E, G, ?", "I", ["H", "F", "J"]),
    ("Complete the series: 1, 4, 9, 16, 25, ?", "36", ["30", "49", "35"]),
    ("Complete the series: Z, Y, X, W, ?", "V", ["U", "T", "S"]),
    ("Complete the series: 2, 4, 8, 16, 32, ?", "64", ["48", "56", "60"]),
    ("Complete the series: ○●, ●○, ○●, ?", "●○", ["○○", "●●", "○"]),
    ("Complete the series: +, ×, -, ÷, +, ×, ?", "-", ["+", "÷", "×"]),
    ("Complete the series: 3, 6, 9, 12, 15, ?", "18", ["16", "20", "21"]),
]

MIRROR_IMAGE_QUESTIONS = [
    ("What is the mirror image of 'AMBULANCE'?", "ECNALUBMA", ["AMBULANCE", "A⅋BULANCE", "ƎƆИA⅃UBMA"]),
    ("What is the mirror image of 'INDIA'?", "AIDNI", ["INDIA", "A⅃ИIA", "AIDИI"]),
    ("What is the water image of '123'?", "ƐᄅI", ["321", "123", "ƐᄅI"]),
    ("What is the mirror image of 'ARMY'?", "YMRA", ["ARMY", "AЯMY", "YMRА"],),
    ("What is the water image of 'NAVY'?", "ʎʌɒu", ["YVAN", "NAVY", "ʎʌɒu"]),
    ("What is the mirror image of '2026'?", "9202", ["2026", "9202", "6202"]),
    ("What is the water image of 'STOP'?", "ԀO┴S", ["POTS", "STOP", "ԀO┴S"]),
    ("What is the mirror image of '7:30'?", "0Ɛ:L", ["7:30", "0Ɛ:L", "0E:L"]),
    ("What is the water image of 'FLAG'?", "⅁A⅃dig", ["GALF", "FLAG", "⅁A⅃dig"]),
    ("What is the mirror image of '5:15'?", "5I:ᄅ", ["5:15", "5I:ᄅ", "51:ᄅ"]),
]

PAPER_FOLDING_QUESTIONS = [
    ("A paper is folded in half and a hole is punched. When unfolded, how many holes will there be?", "2", ["1", "4", "3"]),
    ("A square paper is folded twice and a triangle is cut. How many triangles when unfolded?", "4", ["2", "8", "6"]),
    ("A circular paper is folded in half and a semicircle is cut from the fold. What shape is formed when unfolded?", "Circle with hole", ["Two semicircles", "Full circle", "Ring"]),
    ("A rectangular paper is folded 3 times. How many layers are there?", "8", ["6", "4", "12"]),
    ("A paper is folded diagonally and a corner is cut. What shape is formed when unfolded?", "Diamond shape", ["Square", "Triangle", "Rectangle"]),
    ("A square paper is folded into quarters. A circle is cut from the center. How many circles when unfolded?", "1", ["4", "2", "8"]),
    ("A paper is folded in half vertically, then horizontally. A hole is punched at the center. How many holes when unfolded?", "4", ["2", "1", "8"]),
    ("A triangular paper is folded and a small triangle is cut from the folded edge. How many triangles are formed?", "2", ["1", "4", "3"]),
    ("A paper is folded 4 times. How many sections are created?", "16", ["8", "12", "10"]),
    ("A square paper is folded into a triangle. A semicircle is cut from the hypotenuse. What shape is formed?", "Full circle", ["Semicircle", "Two circles", "Oval"]),
]

CUBE_QUESTIONS = [
    ("How many faces does a cube have?", "6", ["4", "8", "12"]),
    ("How many edges does a cube have?", "12", ["6", "8", "10"]),
    ("How many vertices does a cube have?", "8", ["6", "12", "4"]),
    ("If a cube is painted red on all faces and cut into 27 smaller cubes, how many have 3 faces painted?", "8", ["6", "12", "1"]),
    ("How many smaller cubes have no faces painted in a 3×3×3 cube?", "1", ["0", "8", "6"]),
    ("If opposite faces of a cube have the same color, how many colors are needed?", "3", ["2", "4", "6"]),
    ("How many cubes have exactly 2 faces painted in a 3×3×3 cube?", "12", ["8", "6", "4"]),
    ("A cube is cut into 64 smaller cubes. How many cuts are needed?", "9", ["6", "12", "8"]),
    ("If a cube is rotated 90° about a vertical axis, which face comes to the front?", "Right face", ["Left face", "Back face", "Top face"]),
    ("How many diagonals does a cube have (space diagonals)?", "4", ["6", "12", "8"]),
]

EMBEDDED_FIGURES_QUESTIONS = [
    ("How many triangles are in a Star of David (hexagram)?", "8", ["6", "12", "10"]),
    ("How many squares are in a 3×3 grid?", "14", ["9", "16", "12"]),
    ("How many triangles are formed by drawing both diagonals in a square?", "8", ["4", "6", "10"]),
    ("How many rectangles are in a 2×3 grid?", "18", ["12", "15", "20"]),
    ("How many triangles are in a pentagon with all diagonals drawn?", "35", ["25", "30", "40"]),
    ("How many squares are in a chessboard?", "204", ["64", "100", "150"]),
    ("How many triangles are in a triangle with a median drawn from each vertex?", "16", ["12", "10", "14"]),
    ("How many parallelograms are in a 2×2 grid of parallelograms?", "9", ["4", "6", "8"]),
    ("How many triangles are in a hexagon with all diagonals from one vertex?", "4", ["6", "5", "3"]),
    ("How many rectangles (including squares) are in a 4×4 grid?", "100", ["64", "80", "90"]),
]

WATER_IMAGE_QUESTIONS = [
    ("What is the water image of 'M'?", "W", ["M", "E", "3"]),
    ("What is the water image of '8'?", "8", ["0", "∞", "B"]),
    ("What is the water image of 'L'?", "⅃", ["L", "7", "J"]),
    ("What is the water image of '3'?", "Ɛ", ["E", "8", "E"]),
    ("What is the water image of '6'?", "9", ["6", "∂", "g"]),
    ("What is the water image of 'A'?", "∀", ["A", "V", "Λ"]),
    ("What is the water image of 'H'?", "H", ["H", "I", "N"]),
    ("What is the water image of 'S'?", "S", ["Z", "2", "5"]),
    ("What is the water image of '9'?", "6", ["9", "P", "d"]),
    ("What is the water image of 'O'?", "O", ["0", "○", "O"]),
]

GROUPING_QUESTIONS = [
    ("Group the figures: Triangle, Square, Circle, Rectangle. Which doesn't belong?", "Circle", ["Triangle", "Square", "Rectangle"]),
    ("Group the figures: Pentagon, Hexagon, Heptagon, Sphere. Which doesn't belong?", "Sphere", ["Pentagon", "Hexagon", "Heptagon"]),
    ("Group the figures: Arrow, Line, Curve, Point. Which is different?", "Point", ["Arrow", "Line", "Curve"]),
    ("Group the figures: Cube, Cuboid, Cylinder, Triangle. Which doesn't belong?", "Triangle", ["Cube", "Cuboid", "Cylinder"]),
    ("Group the figures: Equilateral, Isosceles, Scalene, Rectangle. Which doesn't belong?", "Rectangle", ["Equilateral", "Isosceles", "Scalene"]),
    ("Group the figures: Cone, Pyramid, Prism, Square. Which doesn't belong?", "Square", ["Cone", "Pyramid", "Prism"]),
    ("Group the figures: Parallel, Perpendicular, Intersecting, Curved. Which is different?", "Curved", ["Parallel", "Perpendicular", "Intersecting"]),
    ("Group the figures: Acute, Obtuse, Right, Straight. Which is different?", "Straight", ["Acute", "Obtuse", "Right"]),
    ("Group the figures: Rhombus, Parallelogram, Trapezium, Circle. Which doesn't belong?", "Circle", ["Rhombus", "Parallelogram", "Trapezium"]),
    ("Group the figures: Diameter, Radius, Chord, Altitude. Which doesn't belong?", "Altitude", ["Diameter", "Radius", "Chord"]),
]

DOT_SITUATION_QUESTIONS = [
    ("A dot is placed inside a triangle but outside a circle. Which region is it in?", "Triangle only", ["Circle only", "Both", "Neither"]),
    ("A dot is placed at the intersection of two lines. How many regions does it belong to?", "4", ["2", "1", "3"]),
    ("A dot is placed on the boundary of a square. How many regions does it touch?", "2", ["1", "3", "4"]),
    ("A dot is placed inside both a circle and a triangle that overlap. Which region?", "Intersection", ["Circle only", "Triangle only", "Outside"]),
    ("Two dots are placed such that one is inside a square and one is outside. How many regions?", "2", ["1", "3", "4"]),
    ("A dot is placed at the center of a circle. How many radii pass through it?", "Infinite", ["2", "4", "1"]),
    ("A dot is placed on a vertex of a triangle. How many sides meet there?", "2", ["3", "1", "0"]),
    ("Three dots form an equilateral triangle. How many lines of symmetry?", "3", ["1", "2", "0"]),
    ("A dot is placed inside a rectangle but on a diagonal. How many triangles are formed?", "2", ["4", "1", "3"]),
    ("A dot is placed at the intersection of diagonals of a square. How many equal parts?", "4", ["2", "8", "6"]),
]

FIGURE_COMPLETION_QUESTIONS = [
    ("A square with one diagonal missing. What completes it?", "Diagonal line", ["Side", "Circle", "Triangle"]),
    ("A circle with a quarter missing. What completes it?", "Quarter circle", ["Semicircle", "Triangle", "Square"]),
    ("A triangle with the top vertex missing. What completes it?", "Vertex point", ["Base", "Side", "Altitude"]),
    ("A pattern: ○, ○○, ○○○, ?. What comes next?", "○○○○", ["○○", "○", "○○○○○"]),
    ("A 3×3 grid with the center missing. What completes it?", "Center square", ["Corner", "Edge", "Diagonal"]),
    ("A hexagon with alternating sides missing. What completes it?", "3 sides", ["2 sides", "4 sides", "1 side"]),
    ("A star pattern with one point missing. What completes it?", "Triangle point", ["Line", "Circle", "Square"]),
    ("A checkerboard with one square missing. What color should it be?", "Alternating color", ["Same color", "Any color", "No color"]),
    ("A spiral pattern with the center missing. What completes it?", "Small circle", ["Point", "Line", "Arc"]),
    ("A symmetric figure with half missing. What completes it?", "Mirror image", ["Same half", "Different half", "Empty"]),
]

# Generate all 96 sets
def generate_oir_sets():
    sets = []
    
    # Verbal sets (1-48)
    verbal_question_banks = {
        "synonym": SYNONYM_QUESTIONS,
        "antonym": ANTONYM_QUESTIONS,
        "analogy": ANALOGY_QUESTIONS,
        "classification": CLASSIFICATION_QUESTIONS,
        "coding": CODING_QUESTIONS,
        "blood_relation": BLOOD_RELATION_QUESTIONS,
        "series": SERIES_QUESTIONS,
        "direction": DIRECTION_QUESTIONS,
        "ranking": RANKING_QUESTIONS,
        "mathematical": MATHEMATICAL_QUESTIONS,
        "word_formation": WORD_FORMATION_QUESTIONS,
    }
    
    # Non-verbal sets (49-96)
    non_verbal_question_banks = {
        "series_completion": SERIES_COMPLETION_QUESTIONS,
        "mirror_image": MIRROR_IMAGE_QUESTIONS,
        "paper_folding": PAPER_FOLDING_QUESTIONS,
        "cube": CUBE_QUESTIONS,
        "embedded_figures": EMBEDDED_FIGURES_QUESTIONS,
        "water_image": WATER_IMAGE_QUESTIONS,
        "grouping": GROUPING_QUESTIONS,
        "dot_situation": DOT_SITUATION_QUESTIONS,
        "figure_completion": FIGURE_COMPLETION_QUESTIONS,
    }
    
    # Generate 48 verbal sets
    for i in range(48):
        set_num = i + 1
        difficulty = "easy" if i < 16 else ("medium" if i < 32 else "hard")
        
        # Select 10 questions from different categories
        questions = []
        categories = list(verbal_question_banks.keys())
        selected_categories = random.sample(categories, min(5, len(categories)))
        
        q_num = 1
        for cat in selected_categories:
            bank = verbal_question_banks[cat]
            # Pick 2 questions from each category
            selected = random.sample(bank, min(2, len(bank)))
            for q_text, correct, wrong_options in selected:
                options = [correct] + wrong_options
                random.shuffle(options)
                questions.append({
                    "id": f"OIR_S{set_num}_Q{q_num}",
                    "type": cat,
                    "question": q_text,
                    "options": options,
                    "correct_answer": correct,
                    "explanation": f"The correct answer is {correct}."
                })
                q_num += 1
                if q_num > 10:
                    break
            if q_num > 10:
                break
        
        # Fill remaining questions if needed
        while len(questions) < 10:
            cat = random.choice(categories)
            bank = verbal_question_banks[cat]
            q_text, correct, wrong_options = random.choice(bank)
            options = [correct] + wrong_options
            random.shuffle(options)
            questions.append({
                "id": f"OIR_S{set_num}_Q{len(questions)+1}",
                "type": cat,
                "question": q_text,
                "options": options,
                "correct_answer": correct,
                "explanation": f"The correct answer is {correct}."
            })
        
        sets.append({
            "set_number": set_num,
            "type": "verbal",
            "difficulty": difficulty,
            "time_limit_minutes": 15,
            "questions": questions[:10]
        })
    
    # Generate 48 non-verbal sets
    for i in range(48):
        set_num = i + 49
        difficulty = "easy" if i < 16 else ("medium" if i < 32 else "hard")
        
        questions = []
        categories = list(non_verbal_question_banks.keys())
        selected_categories = random.sample(categories, min(5, len(categories)))
        
        q_num = 1
        for cat in selected_categories:
            bank = non_verbal_question_banks[cat]
            selected = random.sample(bank, min(2, len(bank)))
            for q_text, correct, wrong_options in selected:
                options = [correct] + wrong_options
                random.shuffle(options)
                questions.append({
                    "id": f"OIR_S{set_num}_Q{q_num}",
                    "type": cat,
                    "question": q_text,
                    "options": options,
                    "correct_answer": correct,
                    "explanation": f"The correct answer is {correct}."
                })
                q_num += 1
                if q_num > 10:
                    break
            if q_num > 10:
                break
        
        while len(questions) < 10:
            cat = random.choice(categories)
            bank = non_verbal_question_banks[cat]
            q_text, correct, wrong_options = random.choice(bank)
            options = [correct] + wrong_options
            random.shuffle(options)
            questions.append({
                "id": f"OIR_S{set_num}_Q{len(questions)+1}",
                "type": cat,
                "question": q_text,
                "options": options,
                "correct_answer": correct,
                "explanation": f"The correct answer is {correct}."
            })
        
        sets.append({
            "set_number": set_num,
            "type": "non_verbal",
            "difficulty": difficulty,
            "time_limit_minutes": 15,
            "questions": questions[:10]
        })
    
    return sets

def main():
    print("Generating OIR Practice Bank with 96 sets...")
    
    random.seed(42)  # For reproducibility
    
    sets = generate_oir_sets()
    
    oir_bank = {
        "metadata": {
            "name": "OIR Practice Bank",
            "description": "Comprehensive OIR practice questions for SSB Stage 1 preparation",
            "version": "2.0",
            "total_sets": 96,
            "structure": {
                "verbal_reasoning": "Sets 1-48",
                "non_verbal_reasoning": "Sets 49-96"
            },
            "last_updated": "2026-05-19",
            "questions_per_set": 10,
            "time_limit_per_set": "15 minutes"
        },
        "sets": sets
    }
    
    # Save to file
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(output_dir, "..", "practice_questions", "oir_practice_bank.json")
    
    with open(output_path, 'w') as f:
        json.dump(oir_bank, f, indent=2)
    
    print(f"✓ Generated {len(sets)} OIR sets")
    print(f"  - Verbal sets (1-48): 48 sets")
    print(f"  - Non-verbal sets (49-96): 48 sets")
    print(f"  - Total questions: {len(sets) * 10}")
    print(f"✓ Saved to: {output_path}")

if __name__ == "__main__":
    main()