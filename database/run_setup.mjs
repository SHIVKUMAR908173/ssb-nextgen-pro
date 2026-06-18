// Run database schema setup against Supabase using service_role key
const SUPABASE_URL = 'https://oexyteyhyefabiecizfw.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9leHl0ZXloeWVmYWJpZWNpemZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjYyODg0MywiZXhwIjoyMDg4MjA0ODQzfQ.vodhlRKNphphrpmKznN47ut9UrlR71NEq5pM1ys_HBs';

const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal'
};

// SQL statements to execute one at a time
const statements = [
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
  `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
];

async function tryExecuteSQL(sql) {
  // Method 1: Try /pg endpoint
  const endpoints = [
    { path: '/pg/query', body: { query: sql } },
    { path: '/rest/v1/rpc/exec_sql', body: { query: sql } },
  ];

  for (const ep of endpoints) {
    try {
      const r = await fetch(SUPABASE_URL + ep.path, {
        method: 'POST',
        headers,
        body: JSON.stringify(ep.body)
      });
      if (r.status >= 200 && r.status < 300) {
        return { ok: true, endpoint: ep.path, status: r.status };
      }
    } catch (e) {
      // continue
    }
  }
  return { ok: false };
}

async function verifyTablesExist() {
  const tables = ['users', 'oir_tests', 'test_results', 'vacha_interview_bank', 
                  'vacha_gd_topics', 'mansa_scenarios', 'psych_submissions', 'audit_log'];
  
  console.log('\n📊 Verifying tables...');
  const results = [];
  
  for (const table of tables) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=0`, {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
        }
      });
      const status = r.status === 200 ? '✅' : '❌';
      console.log(`  ${status} ${table}: ${r.status}`);
      results.push({ table, exists: r.status === 200 });
    } catch (e) {
      console.log(`  ❌ ${table}: ${e.message}`);
      results.push({ table, exists: false });
    }
  }
  
  const existing = results.filter(r => r.exists).length;
  const missing = results.filter(r => !r.exists).length;
  
  console.log(`\n📋 Summary: ${existing} tables exist, ${missing} missing`);
  return { existing, missing, results };
}

async function main() {
  console.log('🗄️  SSB NextGen Pro — Database Setup');
  console.log('====================================\n');
  
  // First check what already exists
  const before = await verifyTablesExist();
  
  if (before.missing === 0) {
    console.log('\n✅ All tables already exist! Nothing to do.');
    return;
  }
  
  // Try to execute SQL
  console.log('\n🔧 Attempting to create missing tables...');
  const result = await tryExecuteSQL(statements[0]);
  
  if (result.ok) {
    console.log(`✅ SQL execution works via ${result.endpoint}`);
    // Execute remaining statements
    for (let i = 1; i < statements.length; i++) {
      await tryExecuteSQL(statements[i]);
    }
    // Verify again
    await verifyTablesExist();
  } else {
    console.log('⚠️  Direct SQL execution not available via API.');
    console.log('');
    console.log('📋 TO COMPLETE SETUP, please do ONE of these:');
    console.log('');
    console.log('Option 1: Supabase SQL Editor (easiest)');
    console.log('  1. Go to: https://supabase.com/dashboard/project/oexyteyhyefabiecizfw/sql/new');
    console.log('  2. Copy-paste the contents of: ssb-nextgen-pro/database/full_setup.sql');
    console.log('  3. Click "Run"');
    console.log('');
    console.log('Option 2: Supabase CLI');
    console.log('  npx supabase db push --db-url postgresql://postgres:YOUR_DB_PASSWORD@db.oexyteyhyefabiecizfw.supabase.co:5432/postgres');
  }
}

main().catch(console.error);
