#!/usr/bin/env python3
"""
OLQ Data Seeder Script
Generates realistic sample OLQ assessment data for testing the tracking system
"""

import asyncpg
import asyncio
import random
import os
import sys
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

# Sample user ID for testing (replace with actual user ID from your system)
TEST_USER_ID = "00000000-0000-0000-0000-000000000001"  # First user

# OLQ names for reference
OLQ_FIELDS = [
    'effective_intelligence',
    'reasoning_ability',
    'organizing_ability',
    'power_of_expression',
    'social_adaptability',
    'cooperation',
    'sense_of_responsibility',
    'initiative',
    'self_confidence',
    'speed_of_decision',
    'ability_to_influence',
    'liveliness',
    'determination',
    'courage',
    'stamina'
]

TEST_TYPES = ['OIR', 'PPDT', 'TAT', 'WAT', 'SRT', 'SD', 'GPE', 'GTO', 'INTERVIEW', 'MOCK_SSB']

def generate_realistic_olq_scores(base_skill_level=6.0):
    """Generate realistic OLQ scores with natural variation"""
    scores = {}
    
    # Base scores around the skill level with some variation
    for field in OLQ_FIELDS:
        # Add some randomness but keep scores realistic (1-10)
        base = base_skill_level + random.uniform(-2.0, 2.0)
        
        # Some OLQs tend to correlate
        if field in ['effective_intelligence', 'reasoning_ability']:
            base = max(base, base_skill_level - 1.0)  # These tend to be higher together
        
        if field in ['social_adaptability', 'cooperation', 'ability_to_influence']:
            base = max(base, base_skill_level - 0.5)  # Social skills correlate
        
        # Clamp to 1-10 range
        scores[field] = max(1, min(10, round(base)))
    
    return scores

def generate_overall_score(olq_scores):
    """Calculate overall score based on OLQ scores (0-100)"""
    avg_olq = sum(olq_scores.values()) / len(olq_scores)
    # Convert 1-10 scale to 0-100 with some variation
    overall = round((avg_olq - 1) * 11.11 + random.uniform(-5, 5))
    return max(0, min(100, overall))

async def seed_olq_data():
    """Seed the database with sample OLQ assessment data"""
    
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL not found in .env file")
        sys.exit(1)
    
    print("Connecting to database...")
    conn = await asyncpg.connect(database_url)
    
    try:
        # Check if test user exists
        user_exists = await conn.fetchval(
            "SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)", 
            TEST_USER_ID
        )
        
        if not user_exists:
            print(f"Test user {TEST_USER_ID} does not exist. Creating test user...")
            await conn.execute(
                """INSERT INTO users (id, email, full_name, created_at) 
                   VALUES ($1, $2, $3, $4)
                   ON CONFLICT (id) DO NOTHING""",
                TEST_USER_ID, 
                "test@example.com", 
                "Test Candidate",
                datetime.now() - timedelta(days=90)
            )
        
        print("Clearing existing OLQ data for test user...")
        await conn.execute("DELETE FROM olq_assessments WHERE user_id = $1", TEST_USER_ID)
        await conn.execute("DELETE FROM olq_daily_summary WHERE user_id = $1", TEST_USER_ID)
        
        print("Generating sample OLQ assessments...")
        
        # Generate assessments over the last 30 days
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        assessments = []
        current_date = start_date
        
        # Skill progression: candidate improves over time
        base_skill = 5.0  # Starting skill level
        
        while current_date <= end_date:
            # Generate 1-3 assessments per day (realistic usage pattern)
            assessments_per_day = random.choices([1, 2, 3], weights=[0.6, 0.3, 0.1])[0]
            
            for i in range(assessments_per_day):
                # Choose a random test type
                test_type = random.choice(TEST_TYPES)
                
                # Generate realistic scores with gradual improvement
                # Skill improves by ~0.1 per day on average
                days_elapsed = (current_date - start_date).days
                current_skill = base_skill + (days_elapsed * 0.1) + random.uniform(-0.5, 0.5)
                current_skill = max(3.0, min(8.5, current_skill))  # Keep realistic bounds
                
                olq_scores = generate_realistic_olq_scores(current_skill)
                overall_score = generate_overall_score(olq_scores)
                
                # Add some variation based on test type
                # Some tests emphasize certain OLQs
                if test_type == 'OIR':
                    olq_scores['effective_intelligence'] = min(10, olq_scores['effective_intelligence'] + 1)
                    olq_scores['reasoning_ability'] = min(10, olq_scores['reasoning_ability'] + 1)
                elif test_type == 'GTO':
                    olq_scores['organizing_ability'] = min(10, olq_scores['organizing_ability'] + 1)
                    olq_scores['ability_to_influence'] = min(10, olq_scores['ability_to_influence'] + 1)
                    olq_scores['cooperation'] = min(10, olq_scores['cooperation'] + 1)
                elif test_type in ['TAT', 'WAT', 'SRT']:
                    olq_scores['power_of_expression'] = min(10, olq_scores['power_of_expression'] + 1)
                    olq_scores['initiative'] = min(10, olq_scores['initiative'] + 1)
                
                # Random timestamp within the day
                assessment_time = current_date + timedelta(
                    hours=random.randint(6, 22),
                    minutes=random.randint(0, 59)
                )
                
                assessments.append({
                    'user_id': TEST_USER_ID,
                    'test_type': test_type,
                    'test_id': None,  # No specific test reference
                    'overall_score': overall_score,
                    'olq_scores': olq_scores,
                    'assessed_by': random.choice(['AI', 'AI', 'AI', 'Human']),  # Mostly AI
                    'notes': f"Sample assessment for {test_type}",
                    'created_at': assessment_time
                })
            
            current_date += timedelta(days=1)
        
        print(f"Inserting {len(assessments)} assessments...")
        
        # Insert assessments
        for assessment in assessments:
            await conn.execute("""
                INSERT INTO olq_assessments (
                    user_id, test_type, test_id, overall_score,
                    effective_intelligence, reasoning_ability, organizing_ability, power_of_expression,
                    social_adaptability, cooperation, sense_of_responsibility,
                    initiative, self_confidence, speed_of_decision, ability_to_influence,
                    liveliness, determination, courage, stamina,
                    assessed_by, notes, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
            """,
                assessment['user_id'],
                assessment['test_type'],
                assessment['test_id'],
                assessment['overall_score'],
                assessment['olq_scores']['effective_intelligence'],
                assessment['olq_scores']['reasoning_ability'],
                assessment['olq_scores']['organizing_ability'],
                assessment['olq_scores']['power_of_expression'],
                assessment['olq_scores']['social_adaptability'],
                assessment['olq_scores']['cooperation'],
                assessment['olq_scores']['sense_of_responsibility'],
                assessment['olq_scores']['initiative'],
                assessment['olq_scores']['self_confidence'],
                assessment['olq_scores']['speed_of_decision'],
                assessment['olq_scores']['ability_to_influence'],
                assessment['olq_scores']['liveliness'],
                assessment['olq_scores']['determination'],
                assessment['olq_scores']['courage'],
                assessment['olq_scores']['stamina'],
                assessment['assessed_by'],
                assessment['notes'],
                assessment['created_at']
            )
        
        print("✓ Successfully seeded OLQ assessment data!")
        print(f"  • {len(assessments)} assessments created")
        print(f"  • Date range: {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}")
        print(f"  • Test types: {', '.join(set(a['test_type'] for a in assessments))}")
        
        # Show some statistics
        avg_scores = {}
        for field in OLQ_FIELDS:
            values = [a['olq_scores'][field] for a in assessments]
            avg_scores[field] = round(sum(values) / len(values), 2)
        
        print("\nAverage OLQ Scores:")
        for field, avg in sorted(avg_scores.items(), key=lambda x: x[1], reverse=True):
            print(f"  {field.replace('_', ' ').title()}: {avg}")
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await conn.close()
        print("\nDatabase connection closed.")

if __name__ == "__main__":
    print("🚀 OLQ Data Seeder")
    print("=" * 50)
    asyncio.run(seed_olq_data())