import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Load the JSON data
const dataPath = path.resolve(process.cwd(), 'src/data/study_material_data.json');
const studyData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

async function seed() {
    console.log('Starting seed...');

    for (const [examId, examData] of Object.entries(studyData) as any) {
        console.log(`Seeding exam: ${examId}...`);
        
        // 1. We already seeded exams in SQL, but let's make sure it exists, or update it
        // The SQL script inserted 'nda', 'cds', 'afcat', 'ssb'
        // Just in case, let's upsert the exam
        await supabase.from('study_exams').upsert({
            id: examId,
            title: examData.title,
            category: examData.category,
            description: examData.description || '',
            color: examData.color || 'emerald'
        });

        // 2. Resources (PDF/Video)
        if (examData.pdf_vault) {
            for (const pdf of examData.pdf_vault) {
                await supabase.from('study_resources').upsert({
                    id: pdf.id,
                    exam_id: examId,
                    resource_type: 'pdf',
                    title: pdf.title,
                    description: pdf.description,
                    url: pdf.filename, // Using URL to store filename for now
                    metadata: { pages: pdf.pages }
                });
            }
        }
        if (examData.video_vault) {
            for (const vid of examData.video_vault) {
                await supabase.from('study_resources').upsert({
                    id: vid.id,
                    exam_id: examId,
                    resource_type: 'video',
                    title: vid.title,
                    description: vid.description,
                    url: vid.videoId,
                    metadata: { instructor: vid.instructor, duration: vid.duration }
                });
            }
        }

        // 3. Subjects
        if (examData.subjects) {
            let subjectIndex = 0;
            for (const subject of examData.subjects) {
                console.log(`  - Subject: ${subject.name}`);
                await supabase.from('study_subjects').upsert({
                    id: subject.id,
                    exam_id: examId,
                    name: subject.name,
                    icon: subject.icon || 'book',
                    order_index: subjectIndex++
                });

                // 4. Chapters
                if (subject.chapters) {
                    let chapterIndex = 0;
                    for (const chapter of subject.chapters) {
                        await supabase.from('study_chapters').upsert({
                            id: chapter.id,
                            subject_id: subject.id,
                            name: chapter.name,
                            estimated_time: chapter.estimatedTime || '30 mins',
                            order_index: chapterIndex++
                        });

                        // 5. Topics
                        if (chapter.topics) {
                            let topicIndex = 0;
                            for (const topic of chapter.topics) {
                                await supabase.from('study_topics').upsert({
                                    id: topic.id,
                                    chapter_id: chapter.id,
                                    title: topic.title,
                                    type: topic.type || 'Theory',
                                    read_time: topic.readTime || '5 mins',
                                    content: topic.content || '',
                                    key_takeaways: topic.keyTakeaways || null,
                                    quick_quiz: topic.quickQuiz || null,
                                    order_index: topicIndex++
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    
    console.log('Seed completed successfully!');
}

seed().catch(console.error);
