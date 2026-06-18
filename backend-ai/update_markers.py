import re

filepath = r'c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\backend-ai\app\agents\brigadier_assessor.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Update Red Flags
target_red_flags = '''        # Red flag indicators (immediate concerns)
        self.red_flags = [
            "avoiding responsibility",
            "blaming others",
            "dishonesty",
            "lack of empathy",
            "cowardice",
            "selfishness",
            "indecisiveness",
            "panic response",
            "unethical suggestions",
            "giving up easily"
        ]'''

new_red_flags = '''        # Red flag indicators (psychological markers for rejection)
        self.red_flags = [
            "blame shifting/avoidance (signs of cowardice)",
            "superficial charm/rehearsed coaching answers",
            "moral flexibility/unethical shortcuts",
            "paralysis by analysis (indecisiveness under pressure)",
            "defensiveness when logic is challenged",
            "inability to prioritize group welfare over self",
            "panic or emotional instability in hypothetical crises",
            "fabricating experiences (bluffing the IO)",
            "lack of practical intelligence (unrealistic textbook solutions)",
            "giving up easily/lack of stamina"
        ]'''
content = content.replace(target_red_flags, new_red_flags)

# Update Green Flags
target_green_flags = '''        # Green flag indicators (positive signs)
        self.green_flags = [
            "taking initiative",
            "helping others",
            "ethical decision making",
            "calm under pressure",
            "quick practical thinking",
            "team orientation",
            "leadership qualities",
            "sense of duty",
            "resilience",
            "adaptability"
        ]'''

new_green_flags = '''        # Green flag indicators (authentic psychological markers for selection)
        self.green_flags = [
            "ruthless practicality and resourcefulness",
            "calm, structured reasoning under immense stress",
            "moral courage (admitting mistakes without hesitation)",
            "taking absolute ownership of failures",
            "placing team welfare before personal safety",
            "adaptability to sudden hypothetical constraints",
            "clear, concise communication without fluff",
            "genuine empathy paired with decisiveness",
            "resilience (bouncing back immediately after a mistake)",
            "spontaneous, unrehearsed displays of duty"
        ]'''
content = content.replace(target_green_flags, new_green_flags)

# Update Prompt
target_prompt = '''        # GRADING INSTRUCTIONS
        - Be absolutely BRUTAL and HONEST. Do not hand out 4s or 5s unless the response is genuinely exceptional and displays undeniable officer potential.
        - A '3' is standard/acceptable. 
        - If the candidate shifts blame, gives up easily, uses generic buzzwords, or dodges the core of a question, strike them with a 1 or 2 and aggressively flag the concern.
        - Look for micro-indicators of cowardice, selfishness, or indecisiveness.
        - Your assessment text MUST sound like the private notes of a highly demanding Brigadier. Use military terminology, be blunt, direct, and unsparing. No fluffy AI language like "The candidate showed good effort." 
        """'''

new_prompt = '''        # GRADING INSTRUCTIONS AND PSYCHOLOGICAL MARKERS
        - Be absolutely BRUTAL and HONEST. Do not hand out 4s or 5s unless the response displays undeniable, raw officer potential.
        - A '3' is standard/borderline. A '1' or '2' means they lack the psychological profile for the Armed Forces.
        - Analyze the brigadier_thoughts field first: dissect their psychology. Are they bluffing? Are they reciting a coaching academy script? Do they show real moral courage?
        - If they shift blame, offer unrealistic textbook solutions, get defensive, or dodge the core of a question: strike them with a 1 or 2 immediately.
        - Look deeply for micro-indicators of cowardice, selfishness, moral flexibility, or indecisiveness.
        - Pay attention to the "Red Flags" and "Green Flags" arrays. Identify which specific psychological markers the candidate is exhibiting.
        - Your assessment text MUST sound like the private notes of a highly demanding Brigadier evaluating a psychological profile. Use military terminology, be blunt, direct, and unsparing. NO FLUFF.
        """'''

content = content.replace(target_prompt, new_prompt)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated psychological markers in Assessor.")
