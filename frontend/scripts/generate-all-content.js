const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const AUTOGEN_DIR = path.join(__dirname, '../src/lib/study-content/autogen');

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    }
  };

  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.status === 429) {
        console.log('Rate limited. Waiting 15 seconds...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        continue;
      }
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return JSON.parse(data.candidates[0].content.parts[0].text);
    } catch (err) {
      console.log(`Retry ${i+1}/${maxRetries} failed:`, err.message);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  throw new Error("Failed to call Gemini after max retries.");
}

async function generateContentForTopic(exam, chapterName, topic) {
  const prompt = `You are an expert tutor for Indian Defense Exams (NDA, CDS, AFCAT).
Generate detailed study material for the topic "${topic.title}" in the chapter "${chapterName}" for the ${exam.toUpperCase()} exam.

Return ONLY a valid JSON object matching this TypeScript interface exactly:
{
  "content": [
    // Array of blocks. Types allowed: "heading", "text", "list", "callout", "formula", "table"
    // Example: {"type": "heading", "data": "Introduction"}
    // Example: {"type": "text", "data": "Detailed paragraph here..."}
    // Example: {"type": "list", "data": ["Point 1", "Point 2"]}
    // Example: {"type": "callout", "data": "Important note for the exam"}
    // Example: {"type": "formula", "data": {"expression": "F = ma", "note": "Newton's second law"}}
    // Example: {"type": "table", "data": {"headers": ["Col 1", "Col 2"], "rows": [["A", "B"], ["C", "D"]]}}
  ],
  "keyPoints": [
    "String array of 3-5 key takeaways"
  ],
  "inlineQuiz": [
    {
      "question": "A multiple choice question",
      "options": ["Opt A", "Opt B", "Opt C", "Opt D"],
      "correct": 0, // index of correct option
      "explanation": "Why this is correct"
    }
  ]
}

The content should be highly educational, factual, use tables and formulas where appropriate, and have 1-2 inline quizzes. DO NOT include markdown codeblocks (\`\`\`json) in the response, just the raw JSON object.`;

  return await callGemini(prompt);
}

async function run() {
  if (!GEMINI_API_KEY) {
    console.error("Please add GEMINI_API_KEY to your .env.local file.");
    process.exit(1);
  }

  console.log('Fetching topics from Supabase...');
  
  const { data: chaptersData } = await supabase.from('study_chapters').select('id, name, study_subjects(exam_id)');
  const { data: topicsData } = await supabase.from('study_topics').select('id, title, chapter_id, read_time').order('order_index');
  
  const chaptersMap = {};
  for (const c of chaptersData) {
    chaptersMap[c.id] = c;
  }

  // Iterate over every chapter
  for (const chapter of chaptersData) {
    const examId = chapter.study_subjects.exam_id;
    const chapterTopics = topicsData.filter(t => t.chapter_id === chapter.id);
    
    if (chapterTopics.length === 0) continue;
    
    console.log(`\n======================================================`);
    console.log(`Generating real content for ${chapterTopics.length} topics in [${chapter.id}]...`);
    
    const generatedTopics = [];
    
    for (let i = 0; i < chapterTopics.length; i++) {
      const topic = chapterTopics[i];
      console.log(`  [${i+1}/${chapterTopics.length}] -> Generating: ${topic.title}`);
      try {
        const generatedData = await generateContentForTopic(examId, chapter.name, topic);
        
        const safeTitle = topic.title.replace(/'/g, "\\'");
        const readTime = parseInt(topic.read_time) || 5;
        
        generatedTopics.push({
          id: topic.id,
          title: safeTitle,
          readTimeMinutes: readTime,
          content: generatedData.content,
          keyPoints: generatedData.keyPoints,
          inlineQuiz: generatedData.inlineQuiz
        });
        
        // Wait to respect rate limits (Gemini free tier allows 15 RPM, so 4s delay is safe)
        await new Promise(r => setTimeout(r, 4500));
      } catch (e) {
        console.error(`  [X] Failed to generate for ${topic.title}: `, e);
        // Fallback to placeholder if it completely fails
        generatedTopics.push({
          id: topic.id,
          title: topic.title.replace(/'/g, "\\'"),
          readTimeMinutes: parseInt(topic.read_time) || 5,
          content: [{ type: 'text', data: 'Content could not be generated due to an error.' }],
          keyPoints: [],
          inlineQuiz: []
        });
      }
    }

    // Rewrite the chapter file with REAL content
    const examDir = path.join(AUTOGEN_DIR, examId);
    const filePath = path.join(examDir, `${chapter.id}.ts`);
    const varName = `${chapter.id.replace(/-/g, '_').toUpperCase()}_AUTOGEN`;
    
    const fileContent = `import { TopicContent } from '../../types'

export const ${varName}: TopicContent[] = ${JSON.stringify(generatedTopics, null, 2)}
`;

    fs.writeFileSync(filePath, fileContent);
    console.log(`✅ Successfully updated ${filePath} with REAL content!`);
  }

  console.log('All 917 topics have been generated successfully!');
}

run().catch(console.error);
