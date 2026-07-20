import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServerUser } from '@/lib/supabase/auth';

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
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = await createClient();
  try {
    const { searchParams } = new URL(req.url);
    const count = parseInt(searchParams.get('count') || '50');
    const setNo = parseInt(searchParams.get('set') || '1');

    // Fetch random questions from the authentic OIR Engine table
    const { data: questions, error } = await supabase
      .from('oir_tests')
      .select('*')
      .eq('booklet_id', setNo)
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
      questions: formattedQuestions.length > 0 ? formattedQuestions : getFallbackMockQuestions(count, setNo)
    });

  } catch (err) {
    console.error('API Route Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Fallback just in case the database hasn't been seeded yet during development
function getFallbackMockQuestions(count: number, setNo: number) {
  return Array.from({ length: count }).map((_, i) => {
    // Make every even question NON_VERBAL with an image
    const isNonVerbal = i % 2 !== 0;
    return {
      id: `OIR-FALLBACK-${setNo}-${i}`,
      bookletNo: setNo,
      type: isNonVerbal ? 'NON_VERBAL' : 'VERBAL',
      category: isNonVerbal ? 'SPATIAL_REASONING' : 'ANALOGY',
      difficulty: 3,
      questionText: isNonVerbal 
          ? `OIR Set ${setNo} - Q${i+1}: Identify the figure that completes the pattern.` 
          : `OIR Set ${setNo} - Q${i+1}: If this is a fallback question, what should you do?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctOptionIndex: 1,
      explanation: "The database table 'oir_tests' is currently empty. Run the seed script to populate authentic questions.",
      imageUrl: isNonVerbal ? `https://via.placeholder.com/600x400.png?text=OIR+Set+${setNo}+Figure+${i+1}` : undefined
    };
  });
}
