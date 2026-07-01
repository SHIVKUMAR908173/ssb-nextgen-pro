const fs = require('fs')
const path = require('path')
const https = require('https')

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const OUTPUT_DIR = './src/lib/study-content'
const DELAY_MS = 5000
const BATCH_SIZE = 15
const RESUME_FROM = 0

const ALL_TOPICS = require('./scratch/all_topics_generated.js');
const YT_SEARCH_BASE = 'https://www.youtube.com/results?search_query='

function getYouTubeLinks(topic) {
  return {
    english: YT_SEARCH_BASE + encodeURIComponent(topic.title + ' ' + topic.exam + ' exam tutorial'),
    hindi: YT_SEARCH_BASE + encodeURIComponent(topic.title + ' in Hindi ' + topic.exam),
    ncert: (topic.subject === 'Mathematics' || topic.subject === 'Physics' || topic.subject === 'Chemistry' || topic.subject === 'Biology') ? YT_SEARCH_BASE + encodeURIComponent(topic.title + ' NCERT Class 11 12') : null
  }
}

function generatePromptForBatch(topics) {
  const topicsList = topics.map(t => '- ID: ' + t.id + ' | Title: "' + t.title + '" | Subject: ' + t.subject + ' | Exam: ' + t.exam.toUpperCase()).join('\n')
  return 'Generate comprehensive study material for the following ' + topics.length + ' topics:\n\n' + topicsList + '\n\nReturn ONLY a valid JSON ARRAY of objects. The array must contain exactly ' + topics.length + ' objects, one for each topic requested.\nDo not output markdown code blocks. Just raw JSON array starting with [ and ending with ].\n\nEACH OBJECT in the array MUST match this exact structure:\n{\n  "id": "<THE EXACT ID PROVIDED ABOVE>",\n  "title": "<THE EXACT TITLE PROVIDED ABOVE>",\n  "exam": "<the exam>",\n  "subject": "<the subject>",\n  "chapter": "<the chapter id>",\n  "readTimeMinutes": <number 4-10>,\n  "content": [\n    {\n      "type": "text",\n      "data": "<introductory paragraph explaining the concept>"\n    },\n    {\n      "type": "diagram",\n      "data": {\n        "title": "<diagram title>",\n        "description": "<what the diagram shows>",\n        "diagramType": "<either mermaid or plantuml>",\n        "diagramCode": "<raw code>"\n      }\n    }\n  ],\n  "keyPoints": ["<pt1>", "<pt2>"],\n  "commonMistakes": ["<m1>", "<m2>"],\n  "examTips": ["<t1>", "<t2>"],\n  "inlineQuiz": [\n    {\n      "question": "<MCQ>",\n      "options": ["A", "B", "C", "D"],\n      "correct": 0,\n      "explanation": "<expl>"\n    }\n  ]\n}\n\nRequirements per topic:\n- Include at least: 1 table, 1 formula/list, 1 example, 1 diagram, 2 callouts\n- Examples must be fully solved with steps\n- Diagrams use Mermaid.js or PlantUML syntax\n- NO MARKDOWN, strictly a JSON array of objects.'
}

async function callGeminiAPI(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    })
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: '/v1beta/models/gemini-flash-latest:generateContent?key=' + GEMINI_API_KEY,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          if (parsed.error) reject(new Error(parsed.error.message))
          else resolve(parsed.candidates[0].content.parts[0].text)
        } catch (e) { reject(e) }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

const PROGRESS_FILE = './topic_generation_progress.json'
function loadProgress() { try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')) } catch { return { completed: [], failed: [] } } }
function saveProgress(progress) { fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2)) }

async function generateAllTopics() {
  console.log('\n🚀 SSB NEXTGEN PRO — BATCH Topic Generator')
  console.log('📚 Total topics: ' + ALL_TOPICS.length)
  console.log('📦 Batch size: ' + BATCH_SIZE);
  
  ['nda', 'cds', 'afcat'].forEach(exam => {
    const dir = path.join(OUTPUT_DIR, exam)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  })

  const progress = loadProgress()
  const completedIds = new Set(progress.completed)
  let generated = completedIds.size
  let failed = progress.failed.length

  for (let i = RESUME_FROM; i < ALL_TOPICS.length; i += BATCH_SIZE) {
    const batch = ALL_TOPICS.slice(i, i + BATCH_SIZE).filter(t => !completedIds.has(t.id))
    if (batch.length === 0) continue

    console.log('\n📦 Generating batch ' + (Math.floor(i/BATCH_SIZE) + 1) + ' (' + batch.length + ' topics)...')

    try {
      const prompt = generatePromptForBatch(batch)
      const rawResponse = await callGeminiAPI(prompt)
      
      const cleaned = rawResponse.replace(/```json\n?|\n?```/g, '').trim()
      const parsedArray = JSON.parse(cleaned)
      if (!Array.isArray(parsedArray)) throw new Error('Response is not a JSON array')

      parsedArray.forEach(topicContent => {
        if (!topicContent.id) return
        const originalTopic = batch.find(t => t.id === topicContent.id)
        if (originalTopic) {
          topicContent.youtubeLinks = getYouTubeLinks(originalTopic)
          topicContent.exam = originalTopic.exam
          topicContent.chapter = originalTopic.chapter
        }
        const examDir = topicContent.exam || (originalTopic ? originalTopic.exam : 'nda')
        fs.writeFileSync(path.join(OUTPUT_DIR, examDir, topicContent.id + '.json'), JSON.stringify(topicContent, null, 2))

        if (!completedIds.has(topicContent.id)) {
          progress.completed.push(topicContent.id)
          completedIds.add(topicContent.id)
          generated++
        }
      })
      
      saveProgress(progress)
      console.log('  ✅ Batch saved successfully.')
      
      if (i + BATCH_SIZE < ALL_TOPICS.length) {
        console.log('  ⏳ Waiting ' + DELAY_MS + 'ms...')
        await new Promise(r => setTimeout(r, DELAY_MS))
      }
    } catch (err) {
      console.log('  ❌ Failed Batch: ' + err.message)
      if (err.message.toLowerCase().includes('quota') || err.message.toLowerCase().includes('429')) {
        console.log('  ⏳ Rate limit! Pausing 60s...')
        await new Promise(r => setTimeout(r, 60000))
        i -= BATCH_SIZE
        continue
      }
      batch.forEach(t => {
        progress.failed.push({ id: t.id, error: err.message, timestamp: new Date().toISOString() })
        failed++
      })
      saveProgress(progress)
    }
    console.log('📊 PROGRESS: ' + generated + ' done, ' + failed + ' failed, ' + (ALL_TOPICS.length - generated - failed) + ' remaining')
  }
  console.log('\n✅ GENERATION COMPLETE')
}
generateAllTopics().catch(console.error)
