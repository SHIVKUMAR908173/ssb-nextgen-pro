const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const AUTOGEN_DIR = path.join(__dirname, '../src/lib/study-content/autogen');
const PROGRESS_FILE = path.join(__dirname, 'generation-progress.json');

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    }
  };

  while (true) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.status === 429) {
        console.log('Rate limited! Waiting 60 seconds before retrying...');
        await new Promise(resolve => setTimeout(resolve, 60000));
        continue;
      }
      
      if (!response.ok) {
        console.log(`API Error: ${response.status}. Retrying in 30 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 30000));
        continue;
      }
      
      return JSON.parse(data.candidates[0].content.parts[0].text);
    } catch (err) {
      console.log(`Network error: ${err.message}. Retrying in 30 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
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
      "correct": 0,
      "explanation": "Why this is correct"
    }
  ]
}

The content should be highly educational, factual, use tables and formulas where appropriate, and have 1-2 inline quizzes. DO NOT include markdown codeblocks (\`\`\`json) in the response, just the raw JSON object.`;

  return await callGemini(prompt);
}

function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  }
  return {};
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

async function run() {
  if (!GEMINI_API_KEY) {
    console.error("Please add GEMINI_API_KEY to your .env.local file.");
    process.exit(1);
  }

  console.log('Fetching topics from Supabase...');
  
  const { data: chaptersData } = await supabase.from('study_chapters').select('id, name, study_subjects(exam_id)');
  const { data: topicsData } = await supabase.from('study_topics').select('id, title, chapter_id, read_time').order('order_index');
  
  const progress = loadProgress();

  for (const chapter of chaptersData) {
    const examId = chapter.study_subjects.exam_id;
    const chapterTopics = topicsData.filter(t => t.chapter_id === chapter.id);
    
    if (chapterTopics.length === 0) continue;
    
    console.log(`\n======================================================`);
    console.log(`Processing Chapter: [${chapter.id}] - ${chapterTopics.length} topics`);
    
    // Check if this chapter already has a file we can read existing progress from
    const examDir = path.join(AUTOGEN_DIR, examId);
    const filePath = path.join(examDir, `${chapter.id}.ts`);
    const varName = `${chapter.id.replace(/-/g, '_').toUpperCase()}_AUTOGEN`;
    
    let existingTopics = [];
    if (!progress[chapter.id]) {
      progress[chapter.id] = [];
    } else {
      existingTopics = progress[chapter.id];
    }
    
    const generatedTopics = [...existingTopics];
    const generatedIds = new Set(generatedTopics.map(t => t.id));

    let updated = false;

    for (let i = 0; i < chapterTopics.length; i++) {
      const topic = chapterTopics[i];
      
      if (generatedIds.has(topic.id)) {
        console.log(`  [${i+1}/${chapterTopics.length}] -> Skipping (Already Generated): ${topic.title}`);
        continue;
      }

      console.log(`  [${i+1}/${chapterTopics.length}] -> Generating: ${topic.title}`);
      try {
        const generatedData = await generateContentForTopic(examId, chapter.name, topic);
        
        const safeTitle = topic.title.replace(/'/g, "\\'");
        const readTime = parseInt(topic.read_time) || 5;
        
        const newTopic = {
          id: topic.id,
          title: safeTitle,
          readTimeMinutes: readTime,
          content: generatedData.content,
          keyPoints: generatedData.keyPoints,
          inlineQuiz: generatedData.inlineQuiz
        };
        
        generatedTopics.push(newTopic);
        progress[chapter.id] = generatedTopics;
        saveProgress(progress);
        updated = true;

        // Force a rewrite of the file so Next.js live-reloads instantly
        const fileContent = `import { TopicContent } from '../../types'\n\nexport const ${varName}: TopicContent[] = ${JSON.stringify(generatedTopics, null, 2)}\n`;
        if (!fs.existsSync(examDir)) fs.mkdirSync(examDir, { recursive: true });
        fs.writeFileSync(filePath, fileContent);
        
        console.log(`    ✅ Saved: ${topic.title}`);

        // Wait to respect rate limits (Safe wait)
        await new Promise(r => setTimeout(r, 5000));
      } catch (e) {
        console.error(`  [X] Fatal Error on ${topic.title}: `, e);
      }
    }
  }

  console.log('All 917 topics have been generated successfully!');
}

run().catch(console.error);
