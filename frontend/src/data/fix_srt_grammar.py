#!/usr/bin/env python3
"""
Fix grammar errors and add diversity to SRT situation bank.
Handles:
1. "You was" -> "You were"
2. Pronoun mismatch: "his friend" when subject is She/You
3. Nonsensical combos (walking + train stopped)
4. Adds variation to reduce template feel
"""

import json
import re
import random
import hashlib

random.seed(42)  # Reproducible

INPUT = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\frontend\src\data\srt_situation_bank.json"

with open(INPUT, 'r', encoding='utf-8') as f:
    data = json.load(f)

# ============================================================
# VARIATION POOLS — for diversifying template-generated content
# ============================================================

# Activities with natural variations
ACTIVITY_VARIANTS = {
    "walking in a dark street": [
        "walking through a dimly lit alley",
        "walking alone on a quiet road at night",
        "passing through an unlit neighbourhood lane",
        "walking down a deserted street after dark",
        "strolling through a poorly lit lane",
    ],
    "preparing for exams": [
        "studying for an upcoming exam",
        "revising for a crucial test",
        "preparing for a competitive examination",
        "studying late at night for the finals",
        "engaged in exam preparation at home",
    ],
    "returning home from college": [
        "heading home after classes",
        "on the way back from college",
        "returning from the university campus",
        "cycling home after lectures",
        "commuting home from college",
    ],
    "leading a patrol": [
        "leading a night patrol",
        "on duty during a patrol mission",
        "commanding a patrol team",
        "leading a routine patrol near the border",
        "heading a patrol unit in a sensitive area",
    ],
    "driving a car": [
        "driving through a busy intersection",
        "on a long drive on the highway",
        "driving through a crowded market area",
        "behind the wheel on a rain-soaked road",
        "driving home late at night",
    ],
    "traveling in a train": [
        "on a long-distance train journey",
        "traveling by train to a neighbouring city",
        "aboard a late-night train",
        "on the way to a new posting by train",
        "commuting by train during rush hour",
    ],
    "hiking in the mountains": [
        "trekking through a remote mountain trail",
        "on a hiking expedition in the hills",
        "climbing a steep mountain path",
        "exploring a forest trail in the mountains",
        "on an adventure trek in hilly terrain",
    ],
    "attending a party": [
        "attending a social gathering",
        "at a friend's birthday celebration",
        "at a community event",
        "visiting a relative's house for a function",
        "at a farewell party for a colleague",
    ],
}

# Events with natural variations
EVENT_VARIANTS = {
    "when the commander got severely injured": [
        "when the team leader collapsed due to an injury",
        "when the commanding officer was seriously hurt",
        "when the squad leader sustained a severe wound",
        "when a senior officer fell unconscious from an injury",
        "when the patrol commander was badly injured in an ambush",
    ],
    "but the train stopped in a deserted area due to track damage": [
        "when the train suddenly halted in an isolated stretch due to a technical fault",
        "when the train broke down in an uninhabited area at night",
        "but the train came to a stop in a remote area due to signal failure",
        "when the train was forced to stop because of damaged tracks ahead",
        "but the train stalled in a secluded region due to a landslide on the tracks",
    ],
    "but lost the wallet containing important documents": [
        "but realised the bag with important documents had gone missing",
        "when the wallet with crucial identity papers was nowhere to be found",
        "but discovered that the pouch containing vital documents was lost",
        "when the folder with important certificates went missing from the bag",
        "but found that the wallet holding essential documents had been stolen",
    ],
    "when a gang of robbers attacked": [
        "when a group of armed men suddenly appeared and threatened everyone",
        "when robbers ambushed the group demanding valuables",
        "when miscreants armed with weapons surrounded the area",
        "when a gang of dacoits attacked without warning",
        "when hooligans started threatening and looting people nearby",
    ],
    "and saw an accident happening right in front": [
        "and witnessed a serious road accident just ahead",
        "when a major collision occurred right before their eyes",
        "and saw two vehicles crash violently nearby",
        "when an accident took place just a few metres ahead",
        "and noticed a pedestrian being hit by a speeding vehicle",
    ],
    "and suddenly saw a house on fire": [
        "when a nearby building suddenly caught fire",
        "and noticed flames engulfing a neighbouring house",
        "when a fire broke out in a house across the street",
        "and saw thick smoke and flames coming from a nearby dwelling",
        "when a residential house nearby was ablaze with people trapped inside",
    ],
    "when a snake bit his friend": [  # this one also has pronoun fix
        "when a venomous snake bit a companion",
        "when a fellow traveler was bitten by a snake",
        "when a snake suddenly struck and bit a friend",
        "when one of the group members was bitten by a serpent",
        "when a companion was stung by a poisonous snake",
    ],
    "and realized someone was following": [
        "and sensed that a suspicious person was tailing them",
        "when it became clear that someone was shadowing their movements",
        "and noticed a stranger following closely behind",
        "and felt uneasy realising that someone was tracking every step",
        "when a suspicious figure was spotted following at a distance",
    ],
}

# Counter to track which variant to use (rotate through them)
activity_counters = {k: 0 for k in ACTIVITY_VARIANTS}
event_counters = {k: 0 for k in EVENT_VARIANTS}

def get_subject_pronoun_info(situation):
    """Determine the subject and appropriate possessive pronoun."""
    if situation.startswith("You "):
        return "You", "your"
    elif situation.startswith("She "):
        return "She", "her"
    elif situation.startswith("He "):
        return "He", "his"
    return None, None

def fix_grammar(situation):
    """Fix basic grammar errors."""
    # Fix "You was" -> "You were"
    situation = re.sub(r'\bYou was\b', 'You were', situation)

    # Fix pronoun mismatch in "snake bit his friend" for She/You subjects
    subject, possessive = get_subject_pronoun_info(situation)
    if subject and possessive:
        # Fix "a snake bit his friend" when subject is She or You
        if subject == "She":
            situation = situation.replace("a snake bit his friend", "a snake bit her friend")
        elif subject == "You":
            situation = situation.replace("a snake bit his friend", "a snake bit your friend")

    return situation

def diversify_situation(situation, set_idx, sit_idx):
    """Add variation to reduce template feel. Uses deterministic selection based on position."""
    # Use a hash of position for deterministic but varied selection
    seed_val = set_idx * 100 + sit_idx

    # Decide whether to diversify this situation (apply to ~60% of situations)
    if seed_val % 5 < 2:
        return situation  # Keep original (already grammar-fixed)

    result = situation

    # Try to match and replace activities
    for original, variants in ACTIVITY_VARIANTS.items():
        if original in result.lower() or original in result:
            # Check case-insensitive
            pattern = re.compile(re.escape(original), re.IGNORECASE)
            if pattern.search(result):
                variant_idx = seed_val % len(variants)
                replacement = variants[variant_idx]
                # Preserve surrounding case
                result = pattern.sub(replacement, result, count=1)
                break

    # Try to match and replace events
    for original, variants in EVENT_VARIANTS.items():
        if original in result.lower() or original in result:
            pattern = re.compile(re.escape(original), re.IGNORECASE)
            if pattern.search(result):
                variant_idx = (seed_val * 7) % len(variants)
                replacement = variants[variant_idx]
                result = pattern.sub(replacement, result, count=1)
                break

    # Fix the trailing pronoun reference to match the subject
    subject, possessive = get_subject_pronoun_info(result)
    if subject:
        # Ensure the trailing "He/She/You..." matches the subject
        # Pattern: ends with "He...", "She...", or "You..."
        result = re.sub(r'\b(He|She|You)\.\.\.$', f'{subject}...', result)

    return result

def fix_semantic_issues(situation):
    """Fix nonsensical combinations."""
    subject, possessive = get_subject_pronoun_info(situation)
    if not subject:
        return situation

    # Fix: "walking in a dark street but the train stopped..."
    # If subject is walking/hiking/driving, they can't be on a train
    non_train_activities = [
        "walking in a dark street",
        "walking through a dimly lit alley",
        "walking alone on a quiet road",
        "passing through an unlit",
        "walking down a deserted street",
        "strolling through a poorly lit",
        "hiking in the mountains",
        "trekking through",
        "climbing a steep",
        "exploring a forest trail",
        "on an adventure trek",
        "driving a car",
        "driving through",
        "behind the wheel",
        "on a long drive",
        "driving home",
    ]

    train_events = [
        "but the train stopped in a deserted area due to track damage",
        "when the train suddenly halted",
        "when the train broke down",
        "but the train came to a stop",
        "when the train was forced to stop",
        "but the train stalled",
    ]

    situation_lower = situation.lower()
    has_non_train = any(act in situation_lower for act in non_train_activities)
    has_train_event = any(evt in situation_lower for evt in train_events)

    if has_non_train and has_train_event:
        # Replace train event with a more appropriate one
        for train_evt in train_events:
            if train_evt.lower() in situation_lower:
                # Pick a contextually appropriate replacement
                replacements = [
                    f"when a sudden downpour made it impossible to continue. {subject}...",
                    f"when thick fog reduced visibility to almost zero. {subject}...",
                    f"when the road ahead was blocked by a fallen tree. {subject}...",
                    f"when a landslide blocked the only path forward. {subject}...",
                    f"when a power outage plunged the entire area into darkness. {subject}...",
                ]
                # Find the train event in the original text (case-insensitive)
                pattern = re.compile(re.escape(train_evt) + r'.*$', re.IGNORECASE)
                match = pattern.search(situation)
                if match:
                    # Use deterministic replacement
                    idx = hash(situation) % len(replacements)
                    situation = situation[:match.start()] + replacements[idx]
                break

    return situation

# ============================================================
# PROCESS ALL SITUATIONS
# ============================================================

stats = {
    "you_was_fixed": 0,
    "pronoun_fixed": 0,
    "diversified": 0,
    "semantic_fixed": 0,
    "total_processed": 0,
}

for set_idx, s in enumerate(data["sets"]):
    new_situations = []
    for sit_idx, situation in enumerate(s["situations"]):
        original = situation
        stats["total_processed"] += 1

        # Step 1: Fix grammar
        if "You was" in situation:
            stats["you_was_fixed"] += 1
        if ("She " in situation[:4] or "You " in situation[:4]) and "his friend" in situation:
            stats["pronoun_fixed"] += 1

        situation = fix_grammar(situation)

        # Step 2: Fix semantic issues
        fixed_semantic = fix_semantic_issues(situation)
        if fixed_semantic != situation:
            stats["semantic_fixed"] += 1
        situation = fixed_semantic

        # Step 3: Diversify
        diversified = diversify_situation(situation, set_idx, sit_idx)
        if diversified != situation:
            stats["diversified"] += 1
        situation = diversified

        new_situations.append(situation)

    # Validate: still 60 situations per set
    assert len(new_situations) == 60, f"Set {s['set_id']}: expected 60, got {len(new_situations)}"
    s["situations"] = new_situations

# Validate total
total = sum(len(s["situations"]) for s in data["sets"])
assert total == 3600, f"Expected 3600 total situations, got {total}"
assert len(data["sets"]) == 60, f"Expected 60 sets, got {len(data['sets'])}"

# Write output
with open(INPUT, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"✅ Successfully processed {stats['total_processed']} situations")
print(f"   - 'You was' → 'You were': {stats['you_was_fixed']} fixes")
print(f"   - Pronoun mismatches fixed: {stats['pronoun_fixed']} fixes")
print(f"   - Semantic issues fixed: {stats['semantic_fixed']} fixes")
print(f"   - Situations diversified: {stats['diversified']} variations")
print(f"   - Total situations: {total}")
print(f"   - Total sets: {len(data['sets'])}")
print(f"   - File written to: {INPUT}")
