import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL or Key missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const exams = ['nda', 'cds', 'afcat', 'ssb'];

async function verify() {
    console.log('🔍 Verifying exact topic counts per subject...\n');

    for (const exam of exams) {
        // Get subjects for this exam
        const { data: subjects } = await supabase
            .from('study_subjects')
            .select('id')
            .eq('exam_id', exam);

        if (!subjects || subjects.length === 0) {
            console.log(`❌ [${exam.toUpperCase()}] 0 topics (No subjects found)`);
            continue;
        }

        const subjectIds = subjects.map(s => s.id);

        // Get chapters for these subjects
        const { data: chapters } = await supabase
            .from('study_chapters')
            .select('id')
            .in('subject_id', subjectIds);

        if (!chapters || chapters.length === 0) {
            console.log(`❌ [${exam.toUpperCase()}] 0 topics (No chapters found)`);
            continue;
        }

        const chapterIds = chapters.map(c => c.id);

        // Get topics for these chapters
        const { data: topics, error } = await supabase
            .from('study_topics')
            .select('id')
            .in('chapter_id', chapterIds);

        if (error) {
            console.log(`❌ Error fetching topics for ${exam}: ${error.message}`);
            continue;
        }

        const count = topics ? topics.length : 0;
        
        if (count === 99) {
            console.log(`✅ [${exam.toUpperCase()}] EXACTLY ${count} topics!`);
        } else {
            console.log(`⚠️ [${exam.toUpperCase()}] Incorrect count: ${count} topics`);
        }
    }
}

verify();
