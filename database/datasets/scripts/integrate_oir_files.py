#!/usr/bin/env python3
"""
OIR Integration Script
Integrates all existing OIR JSON files (149 files) into a unified practice bank.
Each set has 40 questions (verbal or non-verbal).
"""

import json
import os
import re
from pathlib import Path

def get_all_oir_files(base_dir):
    """Find all OIR JSON files in the datasets directory"""
    oir_files = []
    datasets_dir = Path(base_dir)
    
    for json_file in datasets_dir.glob("oir_*.json"):
        if json_file.name in ["oir_practice_bank.json"]:
            continue  # Skip the consolidated file
        oir_files.append(json_file)
    
    return sorted(oir_files)

def parse_set_info(filename):
    """Extract set number and type from filename"""
    name = filename.stem
    
    # Patterns like: oir_set1_verbal, oir_set15_visual, oir_premium_set1_verbal
    match = re.search(r'set(\d+)', name)
    if match:
        set_num = int(match.group(1))
    else:
        set_num = 0
    
    # Determine type
    if 'verbal' in name.lower():
        oir_type = 'verbal'
    elif 'visual' in name.lower() or 'non' in name.lower():
        oir_type = 'non_verbal'
    else:
        oir_type = 'unknown'
    
    # Check if premium
    is_premium = 'premium' in name.lower()
    
    return set_num, oir_type, is_premium

def load_oir_file(filepath):
    """Load an OIR JSON file and return questions"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return []

def transform_question(question, set_num, q_offset=0):
    """Transform question from old format to new format"""
    # Handle case where question might be a string or other format
    if isinstance(question, str):
        return {
            "id": f"OIR_S{set_num}_Q{q_offset + 1}",
            "type": "unknown",
            "question": question,
            "options": [],
            "correct_answer": "",
            "explanation": ""
        }
    
    if not isinstance(question, dict):
        return None
    
    return {
        "id": f"OIR_S{set_num}_Q{question.get('question_number', q_offset + 1)}",
        "type": question.get('category', question.get('type', 'unknown')),
        "question": question.get('question_text', question.get('question', '')),
        "options": question.get('options', []),
        "correct_answer": question.get('correct_option', question.get('correct_answer', '')),
        "explanation": question.get('explanation', '')
    }

def integrate_oir_files():
    """Main integration function"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    datasets_dir = os.path.join(base_dir, "..")
    
    print("Scanning for OIR files...")
    oir_files = get_all_oir_files(datasets_dir)
    print(f"Found {len(oir_files)} OIR files")
    
    # Group files by set number
    sets_dict = {}
    
    for filepath in oir_files:
        set_num, oir_type, is_premium = parse_set_info(filepath)
        
        if set_num not in sets_dict:
            sets_dict[set_num] = {
                'type': oir_type,
                'is_premium': is_premium,
                'files': [],
                'questions': []
            }
        
        sets_dict[set_num]['files'].append(filepath)
        
        # Load questions
        questions = load_oir_file(filepath)
        for q in questions:
            transformed = transform_question(q, set_num, len(sets_dict[set_num]['questions']))
            sets_dict[set_num]['questions'].append(transformed)
    
    # Create consolidated sets
    consolidated_sets = []
    
    for set_num in sorted(sets_dict.keys()):
        set_data = sets_dict[set_num]
        questions = set_data['questions']
        
        # Determine difficulty based on set number
        if set_num <= 16:
            difficulty = "easy"
        elif set_num <= 32:
            difficulty = "medium"
        else:
            difficulty = "hard"
        
        consolidated_sets.append({
            "set_number": set_num,
            "type": set_data['type'],
            "is_premium": set_data['is_premium'],
            "difficulty": difficulty,
            "time_limit_minutes": 30 if len(questions) > 20 else 15,
            "total_questions": len(questions),
            "questions": questions
        })
        
        print(f"Set {set_num}: {len(questions)} questions ({set_data['type']})")
    
    # Create final OIR bank
    oir_bank = {
        "metadata": {
            "name": "OIR Practice Bank - Integrated",
            "description": "Comprehensive OIR practice questions integrated from 149+ source files",
            "version": "3.0",
            "total_sets": len(consolidated_sets),
            "total_questions": sum(s['total_questions'] for s in consolidated_sets),
            "structure": {
                "verbal_reasoning": f"Sets 1-{len([s for s in consolidated_sets if s['type'] == 'verbal'])}",
                "non_verbal_reasoning": f"Sets {len([s for s in consolidated_sets if s['type'] == 'verbal'])+1}-{len(consolidated_sets)}"
            },
            "last_updated": "2026-05-20",
            "source_files": len(oir_files)
        },
        "sets": consolidated_sets
    }
    
    # Save to practice_questions directory
    output_path = os.path.join(datasets_dir, "practice_questions", "oir_practice_bank.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(oir_bank, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Integration complete!")
    print(f"  Total sets: {len(consolidated_sets)}")
    print(f"  Total questions: {oir_bank['metadata']['total_questions']}")
    print(f"  Verbal sets: {len([s for s in consolidated_sets if s['type'] == 'verbal'])}")
    print(f"  Non-verbal sets: {len([s for s in consolidated_sets if s['type'] == 'non_verbal'])}")
    print(f"✓ Saved to: {output_path}")

if __name__ == "__main__":
    integrate_oir_files()