// Usage: npx ts-node scripts/generate-youtube-course.ts <youtube_url> <chapter_id>

import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local for Supabase and Gemini keys
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

if (!GEMINI_API_KEY) {
    console.error('Missing GEMINI_API_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Define the exact JSON schema we want Gemini to return
const topicSchema = {
    type: SchemaType.OBJECT,
    properties: {
        title: {
            type: SchemaType.STRING,
            description: "A concise, academic title for this topic based on the video content.",
        },
        type: {
            type: SchemaType.STRING,
            description: "The type of content (e.g., 'Theory', 'Shortcuts', 'Strategy', 'Practice Guide')",
        },
        read_time: {
            type: SchemaType.STRING,
            description: "Estimated read time in minutes (e.g., '12 mins')",
        },
        content: {
            type: SchemaType.STRING,
            description: "The main study material content. Thorough, detailed, and formatted beautifully in Markdown. Extract all key formulas, historical facts, or tactical steps from the transcript. Make it read like a premium UPSC/SSB textbook.",
        },
        key_takeaways: {
            type: SchemaType.ARRAY,
            description: "Array of 3 to 4 bullet points summarizing the most critical points.",
            items: { type: SchemaType.STRING }
        },
        quick_quiz: {
            type: SchemaType.OBJECT,
            properties: {
                question: { type: SchemaType.STRING, description: "A multiple-choice question testing a key concept from the material." },
                options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Array of exactly 4 options." },
                answer: { type: SchemaType.STRING, description: "The exact string from options that is correct." },
                explanation: { type: SchemaType.STRING, description: "A brief explanation of why the answer is correct." }
            },
            required: ["question", "options", "answer", "explanation"]
        }
    },
    required: ["title", "type", "read_time", "content", "key_takeaways", "quick_quiz"]
};

async function main() {
    const youtubeUrl = process.argv[2];
    const chapterId = process.argv[3];

    if (!youtubeUrl || !chapterId) {
        console.error('Usage: npx ts-node scripts/generate-youtube-course.ts <youtube_url> <chapter_id>');
        process.exit(1);
    }

    console.log(`[1] Fetching transcript for ${youtubeUrl}...`);
    let transcriptText = "";
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(youtubeUrl);
        transcriptText = transcript.map(t => t.text).join(' ');
        console.log(`✅ Transcript fetched (${transcriptText.split(' ').length} words).`);
    } catch (e: any) {
        console.error('❌ Failed to fetch transcript:', e.message);
        console.error('Make sure the video has closed captions enabled.');
        process.exit(1);
    }

    console.log(`\n[2] Processing transcript with Gemini AI...`);
    const model = genAI.getGenerativeModel({
        model: 'gemini-flash-latest',
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: topicSchema as any,
            temperature: 0.2, // Low temp for factual textbook generation
        }
    });

    const prompt = `
    Act as an elite UPSC/Defense educator (like SuperKalam). 
    I am giving you the raw transcript of a YouTube educational video. 
    Your job is to transform this raw spoken text into highly structured, premium study material for an aspiring officer.
    
    TRANSCRIPT:
    ${transcriptText.substring(0, 30000)} // Truncate if extremely long to fit context
    
    Extract the core concepts, format them beautifully with headings/bullet points in the 'content' field. Generate key takeaways and a practice question.
    Ensure the output strictly follows the provided JSON schema.
    `;

    let generatedData;
    try {
        const result = await model.generateContent(prompt);
        generatedData = JSON.parse(result.response.text());
        console.log(`✅ AI processing complete. Generated topic: "${generatedData.title}"`);
    } catch (e: any) {
        console.error('❌ AI processing failed:', e.message);
        process.exit(1);
    }

    console.log(`\n[3] Inserting topic into Supabase under chapter_id: ${chapterId}...`);
    
    // Generate a slug-like ID
    const topicId = `${chapterId}-${generatedData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 20)}`;

    const { data, error } = await supabase
        .from('study_topics')
        .insert({
            id: topicId,
            chapter_id: chapterId,
            title: generatedData.title,
            type: generatedData.type,
            read_time: generatedData.read_time,
            content: generatedData.content,
            key_takeaways: generatedData.key_takeaways,
            quick_quiz: generatedData.quick_quiz,
            youtube_url: youtubeUrl
        })
        .select()
        .single();

    if (error) {
        console.error('❌ Supabase insertion failed:', error.message);
        process.exit(1);
    }

    console.log(`\n🎉 Success! Topic inserted into database.`);
    console.log(`ID: ${data.id}`);
    console.log(`Title: ${data.title}`);
}

main().catch(console.error);
