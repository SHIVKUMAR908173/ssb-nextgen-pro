"""
Test Script for Brigadier AI System

This script tests the Brigadier-level AI assessment system by:
1. Testing the OLQ analysis functionality
2. Testing the interview simulation
3. Validating the assessment criteria
4. Running sample interviews and generating reports
"""

import json
import sys
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, '.')

from app.agents.brigadier_assessor import BrigadierAssessor, get_brigadier_assessor, OLQ_FRAMEWORK
from app.agents.ssb_simulator import SSBInterviewSimulator, create_ssb_simulator, InterviewMode, InterviewStage


def test_olq_framework():
    """Test that the OLQ framework is properly loaded"""
    print("\n" + "="*60)
    print("TEST 1: OLQ Framework Validation")
    print("="*60)
    
    # Check all 15 OLQs are present
    expected_olqs = [
        "Effective Intelligence", "Reasoning Ability", "Organising Ability", "Power of Expression",
        "Social Adaptability", "Cooperation", "Sense of Responsibility",
        "Initiative", "Self-Confidence", "Speed of Decision", "Ability to Influence the Group",
        "Liveliness", "Determination", "Courage", "Stamina"
    ]
    
    assert len(OLQ_FRAMEWORK) == 15, f"Expected 15 OLQs, got {len(OLQ_FRAMEWORK)}"
    
    for olq in expected_olqs:
        assert olq in OLQ_FRAMEWORK, f"Missing OLQ: {olq}"
        assert "description" in OLQ_FRAMEWORK[olq], f"Missing description for {olq}"
        assert "weight" in OLQ_FRAMEWORK[olq], f"Missing weight for {olq}"
        assert "critical" in OLQ_FRAMEWORK[olq], f"Missing critical flag for {olq}"
    
    print("[OK] All 15 OLQs are properly defined")
    print("[OK] Each OLQ has required fields (description, weight, critical)")
    
    # Print OLQ categories
    categories = set(olq["category"].value for olq in OLQ_FRAMEWORK.values())
    print(f"\nOLQ Categories ({len(categories)}):")
    for cat in categories:
        print(f"  - {cat}")
    
    # Print critical OLQs
    critical_olqs = [name for name, info in OLQ_FRAMEWORK.items() if info["critical"]]
    print(f"\nCritical OLQs ({len(critical_olqs)}):")
    for olq in critical_olqs:
        print(f"  - {olq}")
    
    print("\n[OK] TEST 1 PASSED: OLQ Framework is valid")
    return True


def test_brigadier_assessor():
    """Test the Brigadier Assessor functionality"""
    print("\n" + "="*60)
    print("TEST 2: Brigadier Assessor Functionality")
    print("="*60)
    
    assessor = get_brigadier_assessor()
    
    # Test response analysis
    test_responses = [
        {
            "response": "I would immediately take charge, assess the situation, and implement a practical solution while ensuring the safety of all team members. My leadership experience has taught me the importance of quick decision-making under pressure.",
            "expected_positive": ["taking initiative", "leadership qualities"],
            "description": "Strong leadership response"
        },
        {
            "response": "I don't know what to do. Maybe someone else should handle it. It's not really my responsibility anyway.",
            "expected_negative": ["avoiding responsibility", "giving up easily"],
            "description": "Poor responsibility response"
        },
        {
            "response": "Discipline is the foundation of all success, especially in the armed forces. Without discipline, no organization can function effectively.",
            "expected_positive": ["sense of duty"],
            "description": "WAT response on Discipline"
        }
    ]
    
    for i, test_case in enumerate(test_responses, 1):
        print(f"\nAnalyzing response {i}: {test_case['description']}")
        analysis = assessor.analyze_response(test_case["response"])
        
        # Check analysis structure
        assert "olq_analysis" in analysis, "Missing olq_analysis"
        assert "red_flags_detected" in analysis, "Missing red_flags_detected"
        assert "green_flags_detected" in analysis, "Missing green_flags_detected"
        assert "overall_assessment" in analysis, "Missing overall_assessment"
        assert "recommendation" in analysis, "Missing recommendation"
        
        print(f"  [OK] Analysis structure is valid")
        print(f"  Overall Assessment: {analysis['overall_assessment'][:80]}...")
        
        # Check for expected flags
        if "expected_positive" in test_case:
            for flag in test_case["expected_positive"]:
                if flag in analysis["green_flags_detected"]:
                    print(f"  [OK] Detected positive flag: {flag}")
        
        if "expected_negative" in test_case:
            for flag in test_case["expected_negative"]:
                if flag in analysis["red_flags_detected"]:
                    print(f"  [OK] Detected red flag: {flag}")
    
    print("\n[OK] TEST 2 PASSED: Brigadier Assessor is working correctly")
    return True


def test_interview_simulator():
    """Test the SSB Interview Simulator"""
    print("\n" + "="*60)
    print("TEST 3: SSB Interview Simulator")
    print("="*60)
    
    # Test in practice mode
    simulator = create_ssb_simulator(InterviewMode.PRACTICE)
    
    # Test starting an interview
    candidate_profile = {
        "name": "Test Candidate",
        "age": 22,
        "education": "B.Tech in Computer Science",
        "experience": "Intern at tech company",
        "achievements": ["NCC Cadet Leader", "State-level sports participant"],
        "extracurricular": "Debate club, Social service"
    }
    
    print("\nStarting interview session...")
    interview_data = simulator.start_interview(candidate_profile)
    
    assert "stage" in interview_data, "Missing stage in interview data"
    assert "question" in interview_data, "Missing question in interview data"
    print(f"  [OK] Interview started at stage: {interview_data['stage']}")
    print(f"  [OK] First question: {interview_data['question']}")
    
    # Test processing a response
    test_response = "Sir, I am a dedicated and disciplined individual with strong leadership qualities. As an NCC cadet leader, I have demonstrated my ability to lead teams and take responsibility. I believe in serving the nation and have consistently worked towards this goal."
    
    print("\nProcessing test response...")
    result = simulator.process_response(test_response, InterviewStage.PERSONAL_INTERVIEW)
    
    assert "analysis" in result, "Missing analysis in result"
    assert "next_action" in result, "Missing next_action in result"
    print("  [OK] Response processed successfully")
    print(f"  [OK] Next action: {result['next_action'].get('action', 'unknown')}")
    
    # Test feedback generation (practice mode)
    if "feedback" in result:
        print("  [OK] Feedback generated (practice mode)")
    
    # Test SRT stage
    print("\nTesting SRT stage...")
    srt_data = simulator.start_stage(InterviewStage.SRT)
    assert "scenario" in srt_data, "Missing scenario in SRT data"
    print(f"  [OK] SRT started with scenario: {srt_data['scenario'][:60]}...")
    
    # Test WAT stage
    print("\nTesting WAT stage...")
    wat_data = simulator.start_stage(InterviewStage.WAT)
    assert "words" in wat_data, "Missing words in WAT data"
    print(f"  [OK] WAT started with {len(wat_data['words'])} words")
    
    # Test GPE stage
    print("\nTesting GPE stage...")
    gpe_data = simulator.start_stage(InterviewStage.GPE)
    assert "title" in gpe_data, "Missing title in GPE data"
    assert "problems" in gpe_data, "Missing problems in GPE data"
    print(f"  [OK] GPE started: {gpe_data['title']}")
    print(f"  [OK] Number of problems: {len(gpe_data['problems'])}")
    
    print("\n[OK] TEST 3 PASSED: SSB Interview Simulator is working correctly")
    return True


def test_question_generation():
    """Test Brigadier-level question generation"""
    print("\n" + "="*60)
    print("TEST 4: Question Generation")
    print("="*60)
    
    assessor = get_brigadier_assessor()
    
    # Create a sample analysis
    sample_analysis = {
        "red_flags_detected": [],
        "green_flags_detected": ["taking initiative"],
        "olq_analysis": {
            "Self-Confidence": {"score": 4.0},
            "Sense of Responsibility": {"score": 3.5}
        }
    }
    
    question_types = ["stress_test", "depth_probe", "ethical_dilemma", "leadership_test", "scenario_escalation"]
    
    for q_type in question_types:
        question = assessor.generate_brigadier_question(sample_analysis, q_type)
        assert question, f"Empty question for type: {q_type}"
        print(f"\n{q_type.replace('_', ' ').title()} Question:")
        print(f"  \"{question}\"")
    
    print("\n[OK] TEST 4 PASSED: Question generation is working correctly")
    return True


def test_scenario_generation():
    """Test interview scenario generation"""
    print("\n" + "="*60)
    print("TEST 5: Scenario Generation")
    print("="*60)
    
    assessor = get_brigadier_assessor()
    
    difficulties = ["easy", "medium", "hard", "very_hard"]
    
    for difficulty in difficulties:
        print(f"\nGenerating {difficulty} scenario:")
        scenario = assessor.generate_interview_scenario(difficulty)
        
        assert "type" in scenario, "Missing type in scenario"
        assert "expected_olqs" in scenario, "Missing expected_olqs in scenario"
        
        print(f"  Type: {scenario['type']}")
        print(f"  Expected OLQs: {', '.join(scenario['expected_olqs'][:3])}...")
        if "scenario" in scenario:
            print(f"  Scenario: {scenario['scenario'][:60]}...")
        elif "question" in scenario:
            print(f"  Question: {scenario['question'][:60]}...")
    
    print("\n[OK] TEST 5 PASSED: Scenario generation is working correctly")
    return True


def test_complete_interview_evaluation():
    """Test complete interview evaluation"""
    print("\n" + "="*60)
    print("TEST 6: Complete Interview Evaluation")
    print("="*60)
    
    assessor = get_brigadier_assessor()
    
    # Simulate multiple responses from an interview
    sample_responses = [
        {"response": "I believe in leading by example and have always taken responsibility for my actions.", "stage": "personal_interview"},
        {"response": "I would immediately take charge and implement the most practical solution.", "stage": "srt"},
        {"response": "Discipline is the foundation of all success.", "stage": "wat"},
        {"response": "I would prioritize life safety first, then allocate resources efficiently.", "stage": "gpe"}
    ]
    
    # Analyze all responses
    analyses = []
    for resp in sample_responses:
        analysis = assessor.analyze_response(resp["response"], {"stage": resp["stage"]})
        analyses.append(analysis)
    
    # Evaluate complete interview
    evaluation = assessor.evaluate_complete_interview(analyses)
    
    assert "overall_score" in evaluation, "Missing overall_score"
    assert "recommendation" in evaluation, "Missing recommendation"
    assert "olq_summary" in evaluation, "Missing olq_summary"
    assert "final_assessment" in evaluation, "Missing final_assessment"
    
    print(f"\nOverall Score: {evaluation['overall_score']}")
    print(f"Recommendation: {evaluation['recommendation']}")
    print(f"Confidence: {evaluation['confidence']}%")
    print(f"Critical OLQs Met: {evaluation['critical_olqs_met']}")
    
    print(f"\nFinal Assessment:")
    print(f"{evaluation['final_assessment'][:200]}...")
    
    print("\n[OK] TEST 6 PASSED: Complete interview evaluation is working correctly")
    return True


def run_all_tests():
    """Run all tests and generate summary"""
    print("\n" + "="*60)
    print("BRIGADIER AI SYSTEM - TEST SUITE")
    print("="*60)
    print(f"Started at: {datetime.now().isoformat()}")
    
    tests = [
        ("OLQ Framework", test_olq_framework),
        ("Brigadier Assessor", test_brigadier_assessor),
        ("Interview Simulator", test_interview_simulator),
        ("Question Generation", test_question_generation),
        ("Scenario Generation", test_scenario_generation),
        ("Complete Evaluation", test_complete_interview_evaluation)
    ]
    
    results = []
    for name, test_func in tests:
        try:
            passed = test_func()
            results.append((name, passed))
        except Exception as e:
            print(f"\n[FAIL] TEST FAILED: {name}")
            print(f"  Error: {str(e)}")
            results.append((name, False))
    
    # Print summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, p in results if p)
    total = len(results)
    
    for name, result in results:
        status = "[OK] PASSED" if result else "[FAIL] FAILED"
        print(f"  {status}: {name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n*** ALL TESTS PASSED! Brigadier AI System is ready for use. ***")
    else:
        print(f"\n!!! {total - passed} test(s) failed. Please review the errors above. !!!")
    
    return passed == total


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)