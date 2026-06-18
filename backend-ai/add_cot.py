import re

filepath = r'c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\backend-ai\app\agents\brigadier_assessor.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target_schema = '''class AssessmentOutput(BaseModel):
    score: int = Field(description="Score from 1 to 5")
    evidence: List[str] = Field(description="List of quotes from candidate response")
    assessment: str = Field(description="Brief explanation of your scoring")
    concerns: List[str] = Field(default_factory=list, description="Any concerns noted")
    positive_indicators: List[str] = Field(default_factory=list, description="Positive aspects of the response")'''

new_schema = '''class AssessmentOutput(BaseModel):
    brigadier_thoughts: str = Field(description="Internal monologue and psychological analysis (Chain of Thought) of the Brigadier evaluating this candidate")
    score: int = Field(description="Score from 1 to 5")
    evidence: List[str] = Field(description="List of quotes from candidate response")
    assessment: str = Field(description="Brief explanation of your scoring")
    concerns: List[str] = Field(default_factory=list, description="Any concerns noted")
    positive_indicators: List[str] = Field(default_factory=list, description="Positive aspects of the response")'''

content = content.replace(target_schema, new_schema)

target_return = '''            return {
                "score": parsed_data.get("score", 3),'''

new_return = '''            return {
                "brigadier_thoughts": parsed_data.get("brigadier_thoughts", ""),
                "score": parsed_data.get("score", 3),'''

content = content.replace(target_return, new_return)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added brigadier_thoughts CoT to schema.")
