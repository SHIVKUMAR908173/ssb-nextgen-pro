"""
Test Script for Brigadier AI System

This script tests the Brigadier-level AI assessment system.
"""

import json
import sys
from datetime import datetime

sys.path.insert(0, '.')

from app.agents.brigadier_assessor import BrigadierAssessor, get_brigadier_assessor, OLQ_FRAMEWORK
from app.agents.ssb_simulator import SSBInterviewSimulator, get_ssb_simulator, InterviewMode, InterviewStage


def test_olq_framework():
    """Test that the OLQ framework is properly loaded"""
    print("\n" + "="*60)
    print("TEST 1: OLQ Framework Validation")
    print("="*60)
    
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
    
    print("✓ All 15 OLQs are properly defined")
    
    categories = set(olq["category"].value for olq in OLQ_FRAMEWORK.values())
    print(f"\nOLQ Categories ({len(categories)}):")
    for cat in categories:
        print(f"  - {cat}")
    
    critical_olqs = [name for name, info in OLQ_FRAMEWORK.items() if info["critical"]]
    print(f"\nCritical OLQs ({len(critical_olqs)}):")
    for olq in critical_olqs:
        print(f"  - {olq}")
    
    print("\n✓ TEST 1 PASSED: OLQ Framework is valid")
    return True


def test_brigadier_assessor():
    """Test the Brigadier Assessor functionality"""
    print("\n" + "="*60)
    print("TEST 2: Brigadier Assessor Functionality")
    print("="*60)
    
    assessor = get_brigadier_assessor()
    
    test_responses = [
        {
            "response": "I would immediately take charge, assess the situation, and implement a practical solution.",
            "description": "Strong leadership response"
        },
        {
            "response": "I don't know what to do. Maybe someone else should handle it.",
            "description": "Poor responsibility response"
        },
        {
            "response": "Discipline is the foundation of all success, especially in the armed forces.",
            "description": "WAT response on Discipline"
        }
    ]
    
    for i, test_case in enumerate(test_responses, 1):
        print(f"\nAnalyzing response {i}: {test_case['description']}")
        analysis = assessor.analyze_response(test_case["response"])
        
        assert "olq_analysis" in analysis, "Missing olq_analysis"
        assert "red_flags_detected" in analysis, "Missing red_flags_detected"
        assert "green_flags_detected" in analysis, "Missing green_flags_detected"
        assert "overall_assessment" in analysis, "Missing overall_assessment"
        
        print(f"  ✓ Analysis structure is valid")
        print(f"  Overall: {analysis['overall_assessment'][:80]}...")
    
    print("\n✓ TEST 2 PASSED: Brigadier Assessor is working correctly")
    return True


def test_interview_simulator():
    """Test the SSB Interview Simulator"""
    print("\n" + "="*60)
    print("TEST 3: SSB Interview Simulator")
    print("="*60)
    
    simulator = get_ssb_simulator(InterviewMode.PRACTICE)
    
    candidate_profile = {
        "name": "Test Candidate",
        "age": 22,
        "education": "B.Tech in Computer Science",
        "achievements": ["NCC Cadet Leader"]
    }
    
    print("\nStarting interview session...")
    interview_data = simulator.start_interview(candidate_profile)
    
    assert "stage" in interview_data, "Missing stage"
    assert "question" in interview_data, "Missing question"
    print(f"  ✓ Interview started: {interview_data['stage']}")
    print(f"  ✓ First question: {interview_data['question']}")
    
    print("\nTesting SRT stage...")
    srt_data = simulator.start_stage(InterviewStage.SRT)
    assert "scenario" in srt_data, "Missing scenario"
    print(f"  ✓ SRT started")
    
    print("\nTesting WAT stage...")
    wat_data = simulator.start_stage(InterviewStage.WAT)
    assert "words" in wat_data, "Missing words"
    print(f"  ✓ WAT started with {len(wat_data['words'])} words")
    
    print("\n✓ TEST 3 PASSED: SSB Interview Simulator is working correctly")
    return True


def test_question_generation():
    """Test Brigadier-level question generation"""
    print("\n" + "="*60)
    print("TEST 4: Question Generation")
    print("="*60)
    
    assessor = get_brigadier_assessor()
    
    sample_analysis = {
        "red_flags_detected": [],
        "green_flags_detected": ["taking initiative"],
        "olq_analysis": {
            "Self-Confidence": {"score": 4.0},
            "Sense of Responsibility": {"score": 3.5}
        }
    }
    
    question_types = ["stress_test", "depth_probe", "ethical_dilemma", "leadership_test"]
    
    for q_type in question_types:
        question = assessor.generate_brigadier_question(sample_analysis, q_type)
        assert question, f"Empty question for type: {q_type}"
        print(f"\n{q_type.replace('_', ' ').title()}: \"{question}\"")
    
    print("\n✓ TEST 4 PASSED: Question generation is working correctly")
    return True


def test_complete_evaluation():
    """Test complete interview evaluation"""
    print("\n" + "="*60)
    print("TEST 5: Complete Interview Evaluation")
    print("="*60)
    
    assessor = get_brigadier_assessor()
    
    sample_responses = [
        {"response": "I believe in leading by example.", "stage": "personal_interview"},
        {"response": "I would take charge immediately.", "stage": "srt"},
        {"response": "Discipline is the foundation of success.", "stage": "wat"}
    ]
    
    analyses = []
    for resp in sample_responses:
        analysis = assessor.analyze_response(resp["response"], {"stage": resp["stage"]})
        analyses.append(analysis)
    
    evaluation = assessor.evaluate_complete_interview(analyses)
    
    assert "overall_score" in evaluation, "Missing overall_score"
    assert "recommendation" in evaluation, "Missing recommendation"
    
    print(f"\nOverall Score: {evaluation['overall_score']}")
    print(f"Recommendation: {evaluation['recommendation']}")
    
    print("\n✓ TEST 5 PASSED: Complete evaluation is working correctly")
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
        ("Complete Evaluation", test_complete_evaluation)
    ]
    
    results = []
    for name, test_func in tests:
        try:
            passed = test_func()
            results.append((name, passed))
        except Exception as e:
            print(f"\n✗ TEST FAILED: {name}")
            print(f"  Error: {str(e)}")
            results.append((name, False))
    
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, p in results if p)
    total = len(results)
    
    for name, result in results:
        status = "✓ PASSED" if result else "✗ FAILED"
        print(f"  {status}: {name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! Brigadier AI System is ready for use.")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed.")
    
    return passed == total


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)