import json
import os
import psycopg2
from psycopg2.extras import execute_values

# Database connection parameters (update with actual Supabase/Local PG credentials)
DB_CONFIG = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "yourpassword",
    "host": "localhost",
    "port": "5432"
}

DATASETS_DIR = "database/datasets"

def seed_interview_bank(cur):
    with open(os.path.join(DATASETS_DIR, "interview_bank.json"), 'r') as f:
        data = json.load(f)
    
    values = [(q['category'], q['question_text'], q['ideal_points']) for q in data]
    execute_values(cur, """
        INSERT INTO vacha_interview_bank (category, question_text, ideal_points)
        VALUES %s
    """, values)

def seed_gd_topics(cur):
    with open(os.path.join(DATASETS_DIR, "gd_topics.json"), 'r') as f:
        data = json.load(f)
    
    values = [(t['title'], t['lead_points'], t['background_info']) for t in data]
    execute_values(cur, """
        INSERT INTO vacha_gd_topics (title, lead_points, background_info)
        VALUES %s
    """, values)

def seed_oir_tests(cur):
    # This seeds the OIR master registry
    with open("database/oir_master_bank.json", 'r') as f:
        bank = json.load(f)
    
    # Just seed the test headers
    for set_id in bank['verbal']:
        cur.execute("INSERT INTO oir_tests (set_number, title, type, difficulty) VALUES (%s, %s, 'Verbal', 'Medium')", (set_id, f"Verbal OIR Set {set_id}"))
    for set_id in bank['visual']:
        cur.execute("INSERT INTO oir_tests (set_number, title, type, difficulty) VALUES (%s, %s, 'Non-Verbal', 'Medium')", (set_id, f"Visual OIR Set {set_id}"))

def main():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        print("Seeding Interview Bank...")
        seed_interview_bank(cur)
        
        print("Seeding GD Topics...")
        seed_gd_topics(cur)
        
        print("Seeding OIR Test Registry...")
        seed_oir_tests(cur)
        
        conn.commit()
        print("Database seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        if conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    main()
