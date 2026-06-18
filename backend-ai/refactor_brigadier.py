import json
import re

filepath = r'c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\backend-ai\app\agents\brigadier_assessor.py'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the imports
content = content.replace('from google import genai\n', 'from google import genai\nfrom pydantic import BaseModel, Field\nfrom google.genai import types\n')

schema_class = '''class AssessmentOutput(BaseModel):
    score: int = Field(description="Score from 1 to 5")
    evidence: List[str] = Field(description="List of quotes from candidate response")
    assessment: str = Field(description="Brief explanation of your scoring")
    concerns: List[str] = Field(default_factory=list, description="Any concerns noted")
    positive_indicators: List[str] = Field(default_factory=list, description="Positive aspects of the response")

'''

# Add schema class after imports
content = content.replace('class OLQCategory(Enum):', schema_class + 'class OLQCategory(Enum):')

# Replace _model_based_olq_analysis
target_method = '''    def _model_based_olq_analysis(self, response: str, olq_name: str, olq_info: Dict, context: Dict) -> Dict:
        """Use AI model for OLQ analysis"""
        prompt = f"""
        As an experienced SSB Board President (Brigadier rank), analyze the following candidate response
        for the Officer Like Quality (OLQ) of "{olq_name}".
        
        OLQ Description: {olq_info['description']}
        Assessment Criteria: {olq_info['assessment_prompts']}
        
        Candidate Response: "{response}"
        
        Context: {json.dumps(context)}
        
        {self._get_relevant_training_examples(olq_name, context)}
        
        Provide your analysis purely in valid JSON format. Do not use markdown blocks, just raw JSON. The JSON structure MUST be:
        {{
          "score": [number 1-5],
          "evidence": ["[Quote 1]", "[Quote 2]"],
          "assessment": "[Brief explanation of your scoring]",
          "concerns": ["[concern 1]", "[concern 2]"],
          "positive_indicators": ["[indicator 1]"]
        }}
        
        Be strict but fair in your assessment. Remember, you are evaluating potential officers
        for the armed forces.
        """
        
        try:
            response_obj = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            result_text = response_obj.text
            
            # Extract JSON from markdown if present
            if "```json" in result_text:
                json_str = result_text.split("```json")[1].split("```")[0].strip()
            elif "```" in result_text:
                json_str = result_text.split("```")[1].split("```")[0].strip()
            else:
                json_str = result_text.strip()
                
            # If it didn't return JSON but a numbered list, we could try to parse it,
            # but for reliability let's enforce JSON in the prompt. Let's update the prompt format.
            parsed_data = json.loads(json_str)
            
            return {
                "score": parsed_data.get("Score", parsed_data.get("score", 3)),
                "evidence": parsed_data.get("Evidence", parsed_data.get("evidence", [])),
                "assessment": parsed_data.get("Assessment", parsed_data.get("assessment", "Analysis complete.")),
                "concerns": parsed_data.get("Concerns", parsed_data.get("concerns", [])),
                "positive_indicators": parsed_data.get("Positive Indicators", parsed_data.get("positive_indicators", [])),
                "critical_olq": olq_info["critical"]
            }
        except Exception as e:
            # Fallback to rule-based on failure
            return self._rule_based_olq_analysis(response, olq_name, olq_info, context)'''

new_method = '''    def _model_based_olq_analysis(self, response: str, olq_name: str, olq_info: Dict, context: Dict) -> Dict:
        """Use AI model for OLQ analysis"""
        prompt = f"""
        As an experienced SSB Board President (Brigadier rank), analyze the following candidate response
        for the Officer Like Quality (OLQ) of "{olq_name}".
        
        OLQ Description: {olq_info['description']}
        Assessment Criteria: {olq_info['assessment_prompts']}
        
        Candidate Response: "{response}"
        
        Context: {json.dumps(context)}
        
        {self._get_relevant_training_examples(olq_name, context)}
        
        Be strict but fair in your assessment. Remember, you are evaluating potential officers
        for the armed forces.
        """
        
        try:
            response_obj = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=AssessmentOutput,
                ),
            )
            parsed_data = json.loads(response_obj.text)
            
            return {
                "score": parsed_data.get("score", 3),
                "evidence": parsed_data.get("evidence", []),
                "assessment": parsed_data.get("assessment", "Analysis complete."),
                "concerns": parsed_data.get("concerns", []),
                "positive_indicators": parsed_data.get("positive_indicators", []),
                "critical_olq": olq_info["critical"]
            }
        except Exception as e:
            # Fallback to rule-based on failure
            print(f"Model-based analysis failed: {e}")
            return self._rule_based_olq_analysis(response, olq_name, olq_info, context)'''

content = content.replace(target_method, new_method)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
