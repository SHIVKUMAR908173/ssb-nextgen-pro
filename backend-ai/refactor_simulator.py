filepath = r'c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\backend-ai\app\agents\ssb_simulator.py'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = '''    def _generate_simulated_response(self, stage: InterviewStage, context: Dict) -> str:
        """Generate a simulated candidate response for testing"""
        # This would use an AI model to generate realistic responses
        # For now, return placeholder responses
        
        if stage == InterviewStage.PERSONAL_INTERVIEW:
            return "Sir, I believe in leading by example and have always taken responsibility for my actions. My experience as NCC cadet leader has taught me the importance of discipline, teamwork, and dedication."
        
        elif stage == InterviewStage.SRT:
            return "I would immediately assess the situation, take charge, and implement the most practical solution while ensuring the safety of all involved."
        
        elif stage == InterviewStage.WAT:
            return f"The word '{context.get('word', '')}' represents the qualities that define a true leader."
        
        elif stage == InterviewStage.GPE:
            return "I would prioritize life safety first, then secure the area, allocate resources efficiently, and coordinate with all stakeholders to resolve the situation systematically."
        
        return "Sample response"'''

replacement = '''    def _generate_simulated_response(self, stage: InterviewStage, context: Dict) -> str:
        """Generate a simulated candidate response using an LLM"""
        if not self.assessor or not self.assessor.client:
            # Fallback to hardcoded if no client available
            if stage == InterviewStage.PERSONAL_INTERVIEW:
                return "Sir, I believe in leading by example..."
            return "Sample response"
            
        prompt = f"""
        Act as a candidate undergoing the Services Selection Board (SSB) interview.
        You are currently in the {stage.value} stage.
        Context/Question: {context}
        
        Respond naturally as a candidate would. Do not break character. 
        Sometimes show slight hesitation or realistic human flaws, but generally aim to show some Officer Like Qualities (OLQs).
        Keep your response concise and direct, just as you would speak it.
        """
        
        try:
            response = self.assessor.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            return response.text
        except Exception as e:
            print(f"Simulation generation failed: {e}")
            return "Sir, I would assess the situation and act accordingly."'''

content = content.replace(target, replacement)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ssb_simulator.py")
