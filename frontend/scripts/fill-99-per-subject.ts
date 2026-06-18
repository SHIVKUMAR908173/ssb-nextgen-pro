import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL or Key missing in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const exams = ['nda', 'cds', 'afcat', 'ssb'];

async function fill99PerSubject() {
    console.log('🚀 Filling exactly 99 topics PER SUBJECT...\n');

    for (const exam of exams) {
        console.log(`\n📚 Processing Exam: ${exam.toUpperCase()}`);

        // Get subjects for this exam
        const { data: subjects, error: subjErr } = await supabase
            .from('study_subjects')
            .select('id, name')
            .eq('exam_id', exam);

        if (subjErr || !subjects || subjects.length === 0) {
            console.log(`❌ No subjects found for ${exam}`);
            continue;
        }

        for (const subject of subjects) {
            console.log(`  ➔ Checking Subject: ${subject.name}`);

            // Get chapters for this specific subject
            const { data: chapters, error } = await supabase
                .from('study_chapters')
                .select('id, name')
                .eq('subject_id', subject.id);

            if (error || !chapters || chapters.length === 0) {
                console.log(`     ❌ No chapters found in subject ${subject.name}`);
                continue;
            }

            // Get existing topics for this subject's chapters
            const chapterIds = chapters.map(c => c.id);
            const { data: existingTopics } = await supabase
                .from('study_topics')
                .select('id, chapter_id')
                .in('chapter_id', chapterIds);

            const currentCount = existingTopics ? existingTopics.length : 0;
            console.log(`     Current topics: ${currentCount}/99`);

            let topicsNeeded = 99 - currentCount;
            if (topicsNeeded <= 0) {
                console.log(`     ✅ ${subject.name} already has ${currentCount} topics.`);
                continue;
            }

            console.log(`     Generating ${topicsNeeded} missing topics for ${subject.name}...`);

            let insertedCount = 0;
            // Distribute evenly among chapters
            while (topicsNeeded > 0) {
                for (const chapter of chapters) {
                    if (topicsNeeded <= 0) break;

                    const topicIndex = currentCount + insertedCount + 1;
                    const topicSlug = `${chapter.id}-bulk-${topicIndex}`;
                    const topicTitle = `${chapter.name.split(' - ')[0]} - Advanced Topic ${topicIndex}`;

                    const { error: insertError } = await supabase.from('study_topics').upsert({
                        id: topicSlug,
                        chapter_id: chapter.id,
                        title: topicTitle,
                        type: 'Theory',
                        read_time: '12 mins',
                        content: `This is a premium offline study module for **${topicTitle}** within the subject **${subject.name}**.\n\n### Core Concepts\n- **Fundamentals**: Ensure you master the absolute basics before moving to advanced problems.\n- **Application**: The ${exam.toUpperCase()} exam tests application of concepts rather than rote memorization.\n- **Speed & Accuracy**: Practice this topic with a stopwatch. Speed is just as important as accuracy.\n\n### Strategy & Tricks\n1. Always break down complex problems into smaller, manageable parts.\n2. Use the elimination strategy in MCQs to increase your odds.\n3. Review Previous Year Questions (PYQs) specifically for ${topicTitle}.`,
                        key_takeaways: ["Master the fundamentals", "Practice with a timer", "Review PYQs"],
                        quick_quiz: {
                            question: `What is the most critical strategy when attempting questions on ${topicTitle} in the ${exam.toUpperCase()} exam?`,
                            options: ["Attempting it last", "Understanding concepts & practicing with a timer", "Memorizing formulas blindly", "Guessing the longest option"],
                            answer: "Understanding concepts & practicing with a timer",
                            explanation: "Defense exams heavily penalize guessing and reward speed with accuracy."
                        },
                        youtube_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(exam + ' ' + topicTitle + ' lecture')}`,
                        order_index: 500 + topicIndex,
                    });

                    if (insertError) {
                        console.log(`\n     ❌ DB Error: ${insertError.message}`);
                    } else {
                        insertedCount++;
                        topicsNeeded--;
                        process.stdout.write(`\r     Inserted: ${insertedCount} topics... `);
                    }
                }
            }
            console.log(`\n     ✅ Completed Subject: ${subject.name}`);
        }
    }

    console.log(`\n🎉 ALL SUBJECTS FULLY POPULATED TO 99 TOPICS!`);
}

fill99PerSubject();
