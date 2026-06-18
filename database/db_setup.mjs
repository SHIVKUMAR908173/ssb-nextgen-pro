// Direct PostgreSQL connection to Supabase
import pg from 'pg';

const PROJECT_REF = 'oexyteyhyefabiecizfw';
const DB_PASSWORD = 'Shiv@9081735915';

// Try multiple connection approaches
const connectionConfigs = [
  // Approach 1: Supabase Pooler (session mode)
  {
    name: 'Pooler (session)',
    connectionString: `postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`,
    ssl: { rejectUnauthorized: false }
  },
  // Approach 2: Supabase Pooler (transaction mode)
  {
    name: 'Pooler (transaction)',
    connectionString: `postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`,
    ssl: { rejectUnauthorized: false }
  },
  // Approach 3: Direct connection
  {
    name: 'Direct connection',
    connectionString: `postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres`,
    ssl: { rejectUnauthorized: false }
  }
];

const sqlStatements = [
  // Table: users
  `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
  )`,
  // Table: oir_tests
  `CREATE TABLE IF NOT EXISTS oir_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    set_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    type TEXT CHECK (type IN ('Verbal', 'Non-Verbal')),
    difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
  // Table: test_results
  `CREATE TABLE IF NOT EXISTS test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    test_id UUID REFERENCES oir_tests(id),
    score INTEGER,
    total_questions INTEGER,
    time_taken INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
  // Table: vacha_interview_bank
  `CREATE TABLE IF NOT EXISTS vacha_interview_bank (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    question_text TEXT NOT NULL,
    ideal_points TEXT[],
    difficulty TEXT DEFAULT 'Medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
  // Table: vacha_gd_topics
  `CREATE TABLE IF NOT EXISTS vacha_gd_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    lead_points TEXT[],
    background_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
  // Table: mansa_scenarios
  `CREATE TABLE IF NOT EXISTS mansa_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_type TEXT CHECK (test_type IN ('TAT', 'PPDT', 'WAT', 'SRT')),
    prompt_text TEXT,
    image_url TEXT,
    suggested_themes TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
  // Table: psych_submissions
  `CREATE TABLE IF NOT EXISTS psych_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    scenario_id UUID REFERENCES mansa_scenarios(id),
    test_type TEXT CHECK (test_type IN ('TAT', 'WAT', 'SRT', 'SD')),
    content JSONB,
    ai_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
  // Table: audit_log
  `CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
  // Indexes
  `CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_test_results_completed_at ON test_results(completed_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_psych_submissions_user_id ON psych_submissions(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_psych_submissions_created_at ON psych_submissions(created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`
];

async function tryConnect(config) {
  const client = new pg.Client({
    connectionString: config.connectionString,
    ssl: config.ssl,
    connectionTimeoutMillis: 10000,
  });
  
  try {
    console.log(`Trying: ${config.name}...`);
    await client.connect();
    console.log(`✅ Connected via ${config.name}!`);
    return client;
  } catch (e) {
    console.log(`❌ ${config.name}: ${e.message}`);
    try { await client.end(); } catch {}
    return null;
  }
}

async function main() {
  console.log('Database Setup Started...\n');
  
  let client = null;
  for (const config of connectionConfigs) {
    client = await tryConnect(config);
    if (client) break;
  }
  
  if (!client) {
    console.log('\\n❌ Could not connect to database.');
    process.exit(1);
  }
  
  console.log('\\n🔧 Executing SQL statements...\\n');
  
  let success = 0;
  for (let i = 0; i < sqlStatements.length; i++) {
    const sql = sqlStatements[i];
    try {
      await client.query(sql);
      success++;
    } catch (e) {
      console.log(`❌ Error on statement ${i + 1}: ${e.message}`);
    }
  }
  
  console.log(`\\n✅ Setup complete: ${success}/${sqlStatements.length} statements executed successfully.`);
  await client.end();
}

main().catch(console.error);
