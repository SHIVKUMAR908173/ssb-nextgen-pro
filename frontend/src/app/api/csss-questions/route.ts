import { NextResponse } from 'next/server';
import path from 'path';
import { readFileSync } from 'fs';
import { getServerUser } from '@/lib/supabase/auth';

// Load synthetic CSSS dataset generated earlier
const datasetPath = path.resolve(process.cwd(), 'src/data/csss_stage1_dataset.json');
let dataset: any = null;
try {
  const raw = readFileSync(datasetPath, 'utf-8');
  dataset = JSON.parse(raw);
} catch (e) {
  console.error('Failed to load CSSS dataset:', e);
  dataset = { questions: [] };
}

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const count = parseInt(searchParams.get('count') || '190');
  // Shuffle and select requested number of questions
  const shuffled = dataset.questions.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  return NextResponse.json({
    status: 'success',
    totalQuestions: dataset.metadata.total_questions,
    returnedCount: selected.length,
    questions: selected,
  });
}
