import re

filepath = r'c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\backend-ai\app\agents\ssb_simulator.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Import the new agents
import_target = '''from .brigadier_assessor import BrigadierAssessor, get_brigadier_assessor, OLQ_FRAMEWORK'''
import_replacement = '''from .brigadier_assessor import BrigadierAssessor, get_brigadier_assessor, OLQ_FRAMEWORK
from .psychologist_assessor import PsychologistAssessor
from .gto_assessor import GTOAssessor'''
content = content.replace(import_target, import_replacement)

# Instantiate the agents
init_target = '''        self.assessor = get_brigadier_assessor(model)
        self.conversation_history = []'''
init_replacement = '''        self.assessor = get_brigadier_assessor(model)
        client = self.assessor.client if hasattr(self.assessor, 'client') else None
        self.psych_assessor = PsychologistAssessor(client)
        self.gto_assessor = GTOAssessor(client)
        self.conversation_history = []'''
content = content.replace(init_target, init_replacement)

# Update `process_response` to route to correct agent
process_target = '''        # Analyze response using Brigadier Assessor
        analysis = self.assessor.analyze_response(response, {
            "stage": stage.value,
            "mode": self.mode.value,
            "candidate_profile": self.candidate_profile
        })'''

process_replacement = '''        # ROUTE TO SPECIFIC OFFICER BASED ON STAGE
        if stage in [InterviewStage.SRT, InterviewStage.WAT, InterviewStage.TAT, InterviewStage.SD]:
            # Route to Psychologist
            # We reconstruct the stimulus loosely based on the previous question
            stimulus = self.conversation_history[-2]['response'] if len(self.conversation_history) > 1 else str(stage.value)
            analysis = self.psych_assessor.evaluate(stage.value, stimulus, response)
            # Normalize key for downstream compatibility
            analysis['overall_assessment'] = analysis.get('projection_analysis', '')
            
        elif stage == InterviewStage.GPE:
            # Route to GTO
            stimulus = self.conversation_history[-2]['response'] if len(self.conversation_history) > 1 else str(stage.value)
            analysis = self.gto_assessor.evaluate(stage.value, stimulus, response)
            analysis['overall_assessment'] = analysis.get('practical_intelligence', '')
            
        else:
            # Route to IO / Board President (Brigadier Assessor)
            analysis = self.assessor.analyze_response(response, {
                "stage": stage.value,
                "mode": self.mode.value,
                "candidate_profile": self.candidate_profile
            })'''
content = content.replace(process_target, process_replacement)

# Update the Generate Interview Report to use the Conference format
report_target = '''        # Generate final evaluation
        final_evaluation = self.assessor.evaluate_complete_interview(all_analyses)'''

report_replacement = '''        # Generate final evaluation (THE BOARD CONFERENCE)
        # This is where the Brigadier synthesizes Psych, GTO, and IO reports.
        final_evaluation = self.assessor.evaluate_complete_interview(all_analyses)
        final_evaluation['conference_note'] = "The Board President has reviewed the independent evaluations from the Psychologist, GTO, and IO. The final decision is based on the consensus of all three dimensions."
'''
content = content.replace(report_target, report_replacement)


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated simulator routing.")
