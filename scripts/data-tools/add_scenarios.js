const fs = require('fs');
const path = 'c:\\Users\\Shivkumar\\.antigravity\\ssb-nextgen-pro\\frontend\\src\\data\\psych_scenario_bank.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// New TAT stimuli
const newTat = [
    {
      "slide_id": 13,
      "description": "A group of farmers looking at a dried-up well or cracked field.",
      "suggested_themes": ["Problem Solving", "Agricultural Innovation", "Resilience"],
      "protagonist_age": 35,
      "protagonist_gender": "Male"
    },
    {
      "slide_id": 14,
      "description": "A young person studying late at night under a street lamp.",
      "suggested_themes": ["Dedication", "Hard Work", "Overcoming Adversity"],
      "protagonist_age": 18,
      "protagonist_gender": "Neutral"
    },
    {
      "slide_id": 15,
      "description": "Two individuals arguing aggressively near a parked car that has a dent.",
      "suggested_themes": ["Conflict Resolution", "Composure", "Responsibility"],
      "protagonist_age": 40,
      "protagonist_gender": "Mixed"
    },
    {
      "slide_id": 16,
      "description": "A person addressing a small crowd holding placards in a town square.",
      "suggested_themes": ["Social Activism", "Leadership", "Persuasion"],
      "protagonist_age": 25,
      "protagonist_gender": "Female"
    },
    {
      "slide_id": 17,
      "description": "A person running towards a moving train trying to catch it while holding a heavy bag.",
      "suggested_themes": ["Urgency", "Determination", "Time Management"],
      "protagonist_age": 28,
      "protagonist_gender": "Male"
    },
    {
      "slide_id": 18,
      "description": "A scientist or doctor looking intently into a microscope in a laboratory.",
      "suggested_themes": ["Research", "Focus", "Scientific Temperament"],
      "protagonist_age": 30,
      "protagonist_gender": "Female"
    },
    {
      "slide_id": 19,
      "description": "A group of teenagers cleaning up a polluted beach or park.",
      "suggested_themes": ["Environmental Awareness", "Community Service", "Initiative"],
      "protagonist_age": 16,
      "protagonist_gender": "Mixed"
    },
    {
      "slide_id": 20,
      "description": "An injured athlete being helped off the field by teammates.",
      "suggested_themes": ["Sportsmanship", "Camaraderie", "Empathy"],
      "protagonist_age": 20,
      "protagonist_gender": "Male"
    },
    {
      "slide_id": 21,
      "description": "A person sitting with head in hands while another stands over them looking supportive.",
      "suggested_themes": ["Empathy", "Mentorship", "Overcoming Depression"],
      "protagonist_age": 25,
      "protagonist_gender": "Neutral"
    },
    {
      "slide_id": 22,
      "description": "A family loading luggage onto a cart or vehicle, looking like they are migrating.",
      "suggested_themes": ["Adaptability", "Family Responsibility", "New Beginnings"],
      "protagonist_age": 35,
      "protagonist_gender": "Mixed"
    },
    {
      "slide_id": 23,
      "description": "A person in formal attire presenting in front of a whiteboard to a skeptical audience.",
      "suggested_themes": ["Professional Competence", "Confidence", "Convincing Ability"],
      "protagonist_age": 32,
      "protagonist_gender": "Neutral"
    },
    {
      "slide_id": 24,
      "description": "A silhouette of a person standing alone on a hilltop looking at a stormy sky.",
      "suggested_themes": ["Courage", "Facing Challenges", "Vision"],
      "protagonist_age": 24,
      "protagonist_gender": "Neutral"
    },
    {
      "slide_id": 25,
      "description": "Two children looking through a fence at a playground they cannot enter.",
      "suggested_themes": ["Social Equality", "Compassion", "Taking Action for Others"],
      "protagonist_age": 10,
      "protagonist_gender": "Mixed"
    },
    {
      "slide_id": 26,
      "description": "A person operating a heavy machine in a factory while others watch.",
      "suggested_themes": ["Skill", "Diligence", "Industrial Work"],
      "protagonist_age": 28,
      "protagonist_gender": "Male"
    },
    {
      "slide_id": 27,
      "description": "A group of women in a village gathered around a sewing machine.",
      "suggested_themes": ["Women Empowerment", "Skill Development", "Cooperation"],
      "protagonist_age": 25,
      "protagonist_gender": "Female"
    },
    {
      "slide_id": 28,
      "description": "A person examining a map in a dense forest context.",
      "suggested_themes": ["Navigation", "Adventure", "Problem Solving"],
      "protagonist_age": 22,
      "protagonist_gender": "Male"
    },
    {
      "slide_id": 29,
      "description": "A young officer briefing a group of soldiers sitting on the ground.",
      "suggested_themes": ["Leadership", "Military Planning", "Communication"],
      "protagonist_age": 24,
      "protagonist_gender": "Male"
    },
    {
      "slide_id": 30,
      "description": "A person helping a blind individual cross a busy intersection.",
      "suggested_themes": ["Social Responsibility", "Kindness", "Alertness"],
      "protagonist_age": 20,
      "protagonist_gender": "Neutral"
    },
    {
      "slide_id": 31,
      "description": "A group of people hastily packing sandbags near a rising river.",
      "suggested_themes": ["Disaster Management", "Urgency", "Teamwork"],
      "protagonist_age": 30,
      "protagonist_gender": "Mixed"
    },
    {
      "slide_id": 32,
      "description": "A student receiving a medal from a dignitary on a stage.",
      "suggested_themes": ["Achievement", "Hard Work Rewarded", "Pride"],
      "protagonist_age": 21,
      "protagonist_gender": "Neutral"
    }
];

// New PPDT stimuli
const newPpdt = [
    {
      "ppdt_id": 11,
      "description": "A blurry scene of someone climbing out of a window at night.",
      "mood": "AMBIGUOUS",
      "num_characters": 1,
      "action_visible": true,
      "gender_distribution": "Male"
    },
    {
      "ppdt_id": 12,
      "description": "A hazy image of two people carrying a stretcher towards a vehicle.",
      "mood": "NEGATIVE",
      "num_characters": 2,
      "action_visible": true,
      "gender_distribution": "Mixed"
    },
    {
      "ppdt_id": 13,
      "description": "Silhouettes of people sitting around a table with papers scattered.",
      "mood": "NEUTRAL",
      "num_characters": 4,
      "action_visible": false,
      "gender_distribution": "Mixed"
    },
    {
      "ppdt_id": 14,
      "description": "A person holding up a trophy or object in a crowd, very blurry.",
      "mood": "POSITIVE",
      "num_characters": 5,
      "action_visible": true,
      "gender_distribution": "Neutral"
    },
    {
      "ppdt_id": 15,
      "description": "A person pointing a stick or weapon towards an animal in a forest setting.",
      "mood": "NEGATIVE",
      "num_characters": 1,
      "action_visible": true,
      "gender_distribution": "Male"
    },
    {
      "ppdt_id": 16,
      "description": "A hazy picture of a vehicle overturned on the side of a road.",
      "mood": "NEGATIVE",
      "num_characters": 0,
      "action_visible": false,
      "gender_distribution": "None"
    },
    {
      "ppdt_id": 17,
      "description": "Silhouettes of people dancing or celebrating around a fire.",
      "mood": "POSITIVE",
      "num_characters": 6,
      "action_visible": true,
      "gender_distribution": "Mixed"
    },
    {
      "ppdt_id": 18,
      "description": "A blurry image of a person shaking hands with another person across a desk.",
      "mood": "POSITIVE",
      "num_characters": 2,
      "action_visible": true,
      "gender_distribution": "Mixed"
    },
    {
      "ppdt_id": 19,
      "description": "A person dragging a heavy sack or body away from a structure.",
      "mood": "AMBIGUOUS",
      "num_characters": 1,
      "action_visible": true,
      "gender_distribution": "Male"
    },
    {
      "ppdt_id": 20,
      "description": "A group of people standing in a line outside a building holding papers.",
      "mood": "NEUTRAL",
      "num_characters": 5,
      "action_visible": true,
      "gender_distribution": "Mixed"
    },
    {
      "ppdt_id": 21,
      "description": "A hazy image of a person standing on a podium addressing a crowd.",
      "mood": "POSITIVE",
      "num_characters": 10,
      "action_visible": true,
      "gender_distribution": "Mixed"
    },
    {
      "ppdt_id": 22,
      "description": "Silhouettes of people arguing, with one person raising a hand.",
      "mood": "NEGATIVE",
      "num_characters": 3,
      "action_visible": true,
      "gender_distribution": "Mixed"
    },
    {
      "ppdt_id": 23,
      "description": "A blurry scene of someone pushing a wheelchair in a park.",
      "mood": "POSITIVE",
      "num_characters": 2,
      "action_visible": true,
      "gender_distribution": "Mixed"
    },
    {
      "ppdt_id": 24,
      "description": "A person kneeling beside a fallen tree or structure.",
      "mood": "AMBIGUOUS",
      "num_characters": 1,
      "action_visible": false,
      "gender_distribution": "Neutral"
    },
    {
      "ppdt_id": 25,
      "description": "A hazy image of people working in a field with hand tools.",
      "mood": "NEUTRAL",
      "num_characters": 4,
      "action_visible": true,
      "gender_distribution": "Mixed"
    },
    {
      "ppdt_id": 26,
      "description": "A blurry image of a person holding a child's hand walking away.",
      "mood": "POSITIVE",
      "num_characters": 2,
      "action_visible": true,
      "gender_distribution": "Mixed"
    },
    {
      "ppdt_id": 27,
      "description": "A scene showing someone handing over an envelope or small packet to another secretly.",
      "mood": "NEGATIVE",
      "num_characters": 2,
      "action_visible": true,
      "gender_distribution": "Male"
    },
    {
      "ppdt_id": 28,
      "description": "Silhouettes of soldiers or people in uniform standing in formation.",
      "mood": "NEUTRAL",
      "num_characters": 8,
      "action_visible": false,
      "gender_distribution": "Male"
    },
    {
      "ppdt_id": 29,
      "description": "A blurry image of a person standing on a bridge looking at the water below.",
      "mood": "AMBIGUOUS",
      "num_characters": 1,
      "action_visible": false,
      "gender_distribution": "Neutral"
    },
    {
      "ppdt_id": 30,
      "description": "A group of people lifting a heavy object together, hazy background.",
      "mood": "POSITIVE",
      "num_characters": 4,
      "action_visible": true,
      "gender_distribution": "Mixed"
    }
];

// Append and update metadata
const tatBlankIndex = data.tat_stimuli.findIndex(item => item.is_blank);
const blankItem = data.tat_stimuli.splice(tatBlankIndex, 1)[0];

data.tat_stimuli = [...data.tat_stimuli, ...newTat, blankItem];
data.ppdt_stimuli = [...data.ppdt_stimuli, ...newPpdt];

data.metadata.total_tat_slides = data.tat_stimuli.length;
data.metadata.total_ppdt_images = data.ppdt_stimuli.length;

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log("Successfully expanded PPDT and TAT scenarios.");
