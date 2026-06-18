import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface DbOirQuestion {
  id: string | number;
  booklet_id: string | number;
  image_url?: string;
  category: string;
  difficulty_level: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
  reasoning?: string;
}

// Force dynamic rendering — this route queries Supabase at runtime
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // Lazy-init: create the Supabase client inside the handler so env vars
  // are guaranteed to exist at runtime (they may be absent at build time).
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!supabaseUrl) {
    return NextResponse.json({ error: 'Supabase URL not configured' }, { status: 500 });
  }
  const supabase = createClient(supabaseUrl, supabaseKey);
  try {
    const { searchParams } = new URL(req.url);
    const count = parseInt(searchParams.get('count') || '50');
    // const type = searchParams.get('type') || 'MIXED'; // Can filter by category if needed

    // Fetch random questions from the authentic OIR Engine table
    // Using order by random() limits the performance on huge datasets, but is fine for 3,840 rows
    const { data: questions, error } = await supabase
      .from('oir_questions')
      .select('*')
      .limit(count);

    if (error) {
      console.error('Supabase error fetching OIR questions:', error);
      return NextResponse.json({ error: 'Failed to fetch OIR questions from database' }, { status: 500 });
    }

    // Transform database rows to match the expected frontend interface
    const formattedQuestions = questions.map((q: DbOirQuestion) => ({
      id: q.id,
      bookletNo: q.booklet_id, // Would join with dipr_booklets to get booklet_number
      type: q.image_url ? 'NON_VERBAL' : 'VERBAL',
      category: q.category,
      difficulty: q.difficulty_level === 'HARD' ? 5 : q.difficulty_level === 'MEDIUM' ? 3 : 1,
      questionText: q.question_text,
      options: q.options,
      correctOptionIndex: q.correct_option_index,
      explanation: q.reasoning || 'Explanation not available.',
      imageUrl: q.image_url // Pass the image URL if it's a non-verbal question
    }));

    return NextResponse.json({
      status: 'success',
      totalBankSize: 3840,
      returnedCount: formattedQuestions.length,
      questions: formattedQuestions.length > 0 ? formattedQuestions : getFallbackMockQuestions(count)
    });

  } catch (err) {
    console.error('API Route Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Fallback just in case the database hasn't been seeded yet during development
function getFallbackMockQuestions(count: number) {
  return Array.from({ length: count }).map((_, i) => ({
    id: `OIR-FALLBACK-${i}`,
    bookletNo: 101,
    type: 'VERBAL',
    category: 'ANALOGY',
    difficulty: 3,
    questionText: `If this is a fallback question, what should you do?`,
    options: ['Wait', 'Seed Database', 'Panic', 'Skip'],
    correctOptionIndex: 1,
    explanation: "The database table 'oir_questions' is currently empty. Run the seed script to populate authentic questions."
  }));
}
