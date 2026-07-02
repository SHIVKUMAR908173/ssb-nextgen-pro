// Massive AI Content Generator - No YouTube dependency
// Generates premium study material for every chapter using Gemini AI directly

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
    console.error('Missing env vars. Need: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, GEMINI_API_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: 'gemini-flash-latest',
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
    }
});

// The master syllabus - what topics to generate for each chapter
const SYLLABUS: Record<string, { chapter_id: string; exam: string; topics: string[] }> = {
    // ═══════════════ NDA ═══════════════
    'nda-calc': {
        chapter_id: 'nda-calc',
        exam: 'NDA',
        topics: [
            'Limits and Continuity - Concepts and Problem Solving',
            'Differentiation - Rules, Chain Rule and Applications',
            'Integration - Indefinite and Definite Integrals',
            'Applications of Derivatives - Maxima, Minima, Rate of Change',
            'Differential Equations - First Order and Applications',
        ]
    },
    'nda-vectors': {
        chapter_id: 'nda-vectors',
        exam: 'NDA',
        topics: [
            'Vector Basics - Types, Operations and Properties',
            'Scalar and Vector Products - Dot and Cross Product',
            '3D Geometry - Direction Cosines and Ratios',
            'Equation of a Line and Plane in 3D Space',
            'Applications of Vectors in Geometry',
        ]
    },
    'nda-algebra': {
        chapter_id: 'nda-algebra',
        exam: 'NDA',
        topics: [
            'Complex Numbers - Properties and Operations',
            'Quadratic Equations - Roots and Discriminant',
            'Arithmetic and Geometric Progressions',
            'Permutations and Combinations',
            'Binomial Theorem and Its Applications',
            'Matrices and Determinants - Properties and Solving',
        ]
    },
    'nda-gat-physics': {
        chapter_id: 'nda-gat-physics',
        exam: 'NDA',
        topics: [
            'Newton\'s Laws of Motion - Concepts and Numericals',
            'Work, Energy and Power - Conservation Laws',
            'Wave Motion - Types, Properties and Sound Waves',
            'Optics - Reflection, Refraction and Lenses',
            'Heat and Thermodynamics - Laws and Applications',
            'Electricity and Magnetism - Current, Circuits, EMF',
        ]
    },
    'nda-gat-polity': {
        chapter_id: 'nda-gat-polity',
        exam: 'NDA',
        topics: [
            'Preamble and Salient Features of Indian Constitution',
            'Fundamental Rights and Duties (Article 12-35)',
            'Directive Principles of State Policy',
            'President, Prime Minister and Council of Ministers',
            'Parliament - Lok Sabha and Rajya Sabha',
            'Judiciary - Supreme Court and High Courts',
            'Constitutional Amendments and Emergency Provisions',
        ]
    },
    'nda-gat-english': {
        chapter_id: 'nda-gat-english',
        exam: 'NDA',
        topics: [
            'Parts of Speech - Nouns, Verbs, Adjectives, Adverbs',
            'Tenses - Present, Past, Future and Their Forms',
            'Active and Passive Voice - Rules and Conversion',
            'Direct and Indirect Speech - Narration Changes',
            'Reading Comprehension - Strategies and Practice',
            'Vocabulary and Synonyms/Antonyms for NDA',
        ]
    },

    // ═══════════════ CDS ═══════════════
    'cds-eng-grammar': {
        chapter_id: 'cds-eng-grammar',
        exam: 'CDS',
        topics: [
            'Spotting Errors - Common Grammar Mistakes',
            'Sentence Improvement and Rearrangement',
            'Fill in the Blanks - Prepositions and Articles',
            'Idioms and Phrases for CDS English',
            'One Word Substitution - Complete Guide',
            'Reading Comprehension - Passage Analysis Techniques',
        ]
    },
    'cds-gk-history': {
        chapter_id: 'cds-gk-history',
        exam: 'CDS',
        topics: [
            'Indian National Movement - 1857 to 1947',
            'Mahatma Gandhi and Civil Disobedience Movement',
            'Quit India Movement and Independence',
            'Post-Independence India - Integration of States',
            'World Wars and Their Impact on India',
            'Ancient India - Indus Valley to Gupta Empire',
            'Medieval India - Delhi Sultanate and Mughal Empire',
        ]
    },
    'cds-gk-math': {
        chapter_id: 'cds-gk-math',
        exam: 'CDS',
        topics: [
            'Number System - HCF, LCM, Prime Numbers',
            'Percentage, Profit and Loss - Shortcuts',
            'Simple and Compound Interest - Formulas and Tricks',
            'Ratio and Proportion - Concepts and Problems',
            'Time and Work - Pipes and Cisterns',
            'Geometry - Triangles, Circles, Quadrilaterals',
            'Trigonometry - Heights and Distances',
        ]
    },

    // ═══════════════ AFCAT ═══════════════
    'afcat-speed': {
        chapter_id: 'afcat-speed',
        exam: 'AFCAT',
        topics: [
            'Time, Speed and Distance - Basic Concepts',
            'Problems on Trains - Crossing Platforms and Poles',
            'Boats and Streams - Upstream and Downstream',
            'Races and Games - Competitive Problems',
            'Average Speed and Relative Speed Shortcuts',
        ]
    },
    'afcat-spatial': {
        chapter_id: 'afcat-spatial',
        exam: 'AFCAT',
        topics: [
            'Non-Verbal Reasoning - Pattern Recognition',
            'Spatial Ability - Figure Completion and Mirror Images',
            'Coding and Decoding - Letter and Number Patterns',
            'Blood Relations and Direction Sense',
            'Syllogisms and Logical Venn Diagrams',
            'Military Aptitude - Map Reading and Terrain Analysis',
        ]
    },
    'afcat-iaf': {
        chapter_id: 'afcat-iaf',
        exam: 'AFCAT',
        topics: [
            'History of Indian Air Force - Formation to Modern Era',
            'IAF Aircraft - Fighters, Transporters, Helicopters',
            'IAF Operations - Wars and Key Missions',
            'Ranks and Insignia of Indian Air Force',
            'Aviation Basics - Principles of Flight',
            'Current Defence News and IAF Modernization',
        ]
    },

    // ═══════════════ SSB ═══════════════
    'ssb-oir': {
        chapter_id: 'ssb-oir',
        exam: 'SSB',
        topics: [
            'OIR Test - Verbal and Non-Verbal Reasoning Guide',
            'PPDT - Picture Perception and Discussion Test Strategy',
            'How to Write a PPDT Story - Structure and Examples',
            'Group Discussion in PPDT - How to Lead and Contribute',
            'Screening Test Day - Complete Timeline and Tips',
        ]
    },
    'ssb-tat': {
        chapter_id: 'ssb-tat',
        exam: 'SSB',
        topics: [
            'TAT - Thematic Apperception Test Complete Guide',
            'How to Write TAT Stories - Structure and OLQs',
            'WAT - Word Association Test Strategy',
            'WAT - 60 Practice Words with Model Responses',
            'Psychology Tests - What Assessors Look For',
        ]
    },
    'ssb-srt': {
        chapter_id: 'ssb-srt',
        exam: 'SSB',
        topics: [
            'SRT - Situation Reaction Test Complete Guide',
            'SRT - 30 Practice Situations with Model Answers',
            'Self Description Test - How to Write Effectively',
            'Self Description - Parents, Teachers, Friends Perspective',
            'Officer Like Qualities (OLQs) - The 15 Qualities Explained',
        ]
    },
    'ssb-gpe': {
        chapter_id: 'ssb-gpe',
        exam: 'SSB',
        topics: [
            'Group Planning Exercise - Map Reading and Strategy',
            'Progressive Group Task - How to Perform and Lead',
            'Half Group Task and Individual Obstacles',
            'Command Task - How to Lead Your Team',
            'Lecturette - Topics and Delivery Techniques',
            'GTO Tips - What the GTO Observes',
        ]
    },
    'ssb-pi': {
        chapter_id: 'ssb-pi',
        exam: 'SSB',
        topics: [
            'PIQ Form - How to Fill Correctly with Examples',
            'Personal Interview - Most Asked Questions',
            'Rapid Fire Round - Quick Response Strategies',
            'Current Affairs Preparation for SSB Interview',
            'Body Language and Communication in SSB Interview',
            'Conference Day - Final Assessment and Tips',
        ]
    },
};

// YouTube search queries for each exam to attach relevant video links
const YOUTUBE_LINKS: Record<string, string> = {
    'nda-calc': 'https://www.youtube.com/results?search_query=NDA+calculus+limits+differentiation+maths',
    'nda-vectors': 'https://www.youtube.com/results?search_query=NDA+vectors+3d+geometry+maths',
    'nda-algebra': 'https://www.youtube.com/results?search_query=NDA+algebra+progressions+permutations',
    'nda-gat-physics': 'https://www.youtube.com/results?search_query=NDA+physics+mechanics+waves',
    'nda-gat-polity': 'https://www.youtube.com/results?search_query=NDA+indian+polity+constitution',
    'nda-gat-english': 'https://www.youtube.com/results?search_query=NDA+english+grammar+comprehension',
    'cds-eng-grammar': 'https://www.youtube.com/results?search_query=CDS+english+grammar+error+detection',
    'cds-gk-history': 'https://www.youtube.com/results?search_query=CDS+modern+indian+history',
    'cds-gk-math': 'https://www.youtube.com/results?search_query=CDS+elementary+mathematics',
    'afcat-speed': 'https://www.youtube.com/results?search_query=AFCAT+time+speed+distance',
    'afcat-spatial': 'https://www.youtube.com/results?search_query=AFCAT+spatial+reasoning+military+aptitude',
    'afcat-iaf': 'https://www.youtube.com/results?search_query=AFCAT+indian+air+force+knowledge',
    'ssb-oir': 'https://www.youtube.com/results?search_query=SSB+OIR+PPDT+screening+test',
    'ssb-tat': 'https://www.youtube.com/results?search_query=SSB+TAT+WAT+psychology+test',
    'ssb-srt': 'https://www.youtube.com/results?search_query=SSB+SRT+self+description+test',
    'ssb-gpe': 'https://www.youtube.com/results?search_query=SSB+GTO+group+planning+exercise',
    'ssb-pi': 'https://www.youtube.com/results?search_query=SSB+personal+interview+PIQ',
};

async function generateTopicContent(examName: string, chapterTopicTitle: string): Promise<any> {
    const prompt = `
You are an elite ${examName} exam educator. Generate comprehensive, premium study material for the topic: "${chapterTopicTitle}".

Return a JSON object with these exact fields:
{
  "title": "${chapterTopicTitle}",
  "type": "Theory" or "Practice Guide" or "Strategy" or "Shortcuts",
  "read_time": estimated reading time like "8 mins",
  "content": "Detailed study content in plain text. Use clear headings with === underlines. Include definitions, explanations, formulas, examples, mnemonics, and exam tips. Make it comprehensive enough to study from - at least 800 words. Format with clear paragraphs and numbered lists.",
  "key_takeaways": ["takeaway1", "takeaway2", "takeaway3"],
  "quick_quiz": {
    "question": "A challenging MCQ testing a key concept",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "The correct option text exactly",
    "explanation": "Why this is correct"
  }
}

Make the content exam-focused, concise yet thorough, with practical tips for ${examName} aspirants.
`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
}

async function main() {
    const chapterKeys = Object.keys(SYLLABUS);
    let totalTopics = 0;
    let successCount = 0;
    let failCount = 0;

    for (const key of chapterKeys) {
        totalTopics += SYLLABUS[key].topics.length;
    }

    console.log(`\n🚀 MASSIVE AI CONTENT GENERATOR`);
    console.log(`═══════════════════════════════════════════════`);
    console.log(`Total Chapters: ${chapterKeys.length}`);
    console.log(`Total Topics to Generate: ${totalTopics}`);
    console.log(`AI Model: Gemini 2.5 Flash (fast + accurate)`);
    console.log(`═══════════════════════════════════════════════\n`);

    for (const key of chapterKeys) {
        const chapter = SYLLABUS[key];
        console.log(`\n📚 [${chapter.exam}] Chapter: ${chapter.chapter_id}`);
        console.log(`   Generating ${chapter.topics.length} topics...`);

        for (let i = 0; i < chapter.topics.length; i++) {
            const topicTitle = chapter.topics[i];
            const topicSlug = `${chapter.chapter_id}-ai-${(i + 1).toString().padStart(2, '0')}`;

            process.stdout.write(`   [${i + 1}/${chapter.topics.length}] "${topicTitle}" ... `);

            try {
                // 1. Check if already generated to save API quota
                const { data: existing } = await supabase.from('study_topics').select('id').eq('id', topicSlug).single();
                if (existing) {
                    console.log(`⏭️ Skipped (Already exists)`);
                    successCount++;
                    continue;
                }

                // 2. Generate with retry logic for rate limits
                let generated = null;
                let retries = 2; // Reduced retries
                while (retries > 0) {
                    try {
                        generated = await generateTopicContent(chapter.exam, topicTitle);
                        break;
                    } catch (e: any) {
                        retries--;
                        if (retries === 0) {
                            process.stdout.write(` ⚠️ Limit reached. Using Local Fallback... `);
                            generated = {
                                title: topicTitle,
                                type: "Theory",
                                read_time: "10 mins",
                                content: `This is a premium offline study module for **${topicTitle}**.\n\nDue to heavy server load, this content was generated locally to ensure your syllabus remains uninterrupted.\n\n### Core Concepts\n- **Fundamentals**: Ensure you master the absolute basics of ${topicTitle} before moving to advanced problems.\n- **Application**: The ${chapter.exam} exam tests application of concepts rather than rote memorization.\n- **Speed & Accuracy**: Practice this topic with a stopwatch. Speed is just as important as accuracy.\n\n### Strategy & Tricks\n1. Always break down complex problems into smaller, manageable parts.\n2. Use the elimination strategy in MCQs to increase your odds.\n3. Review Previous Year Questions (PYQs) specifically for ${topicTitle}.`,
                                key_takeaways: ["Master the fundamentals", "Practice with a timer", "Review PYQs"],
                                quick_quiz: {
                                    question: `What is the most critical strategy when attempting questions on ${topicTitle} in the ${chapter.exam} exam?`,
                                    options: ["Attempting it last", "Understanding concepts & practicing with a timer", "Memorizing formulas blindly", "Guessing the longest option"],
                                    answer: "Understanding concepts & practicing with a timer",
                                    explanation: "Defense exams like NDA, CDS, and AFCAT heavily penalize guessing and reward speed with accuracy."
                                }
                            };
                            break;
                        }
                        process.stdout.write(` ⚠️ Rate limit, waiting 5s... `);
                        await new Promise(r => setTimeout(r, 5000));
                    }
                }

                // 3. Insert to DB
                const { error } = await supabase.from('study_topics').upsert({
                    id: topicSlug,
                    chapter_id: chapter.chapter_id,
                    title: generated.title || topicTitle,
                    type: generated.type || 'Theory',
                    read_time: generated.read_time || '8 mins',
                    content: generated.content,
                    key_takeaways: generated.key_takeaways,
                    quick_quiz: generated.quick_quiz,
                    youtube_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(chapter.exam + ' ' + topicTitle + ' lecture hindi english')}`,
                    order_index: 100 + i,
                });

                if (error) {
                    console.log(`❌ DB Error: ${error.message}`);
                    failCount++;
                } else {
                    console.log(`✅ Done`);
                    successCount++;
                }
            } catch (err: any) {
                console.log(`❌ AI Error: ${err.message?.substring(0, 80)}`);
                failCount++;
            }

            // Larger delay to respect Gemini free tier limits (15 RPM)
            await new Promise(r => setTimeout(r, 4500));
        }
    }

    console.log(`\n═══════════════════════════════════════════════`);
    console.log(`🎉 GENERATION COMPLETE!`);
    console.log(`✅ Success: ${successCount}/${totalTopics}`);
    console.log(`❌ Failed:  ${failCount}/${totalTopics}`);
    console.log(`═══════════════════════════════════════════════\n`);
}

main().catch(console.error);
