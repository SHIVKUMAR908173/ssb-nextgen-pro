import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { type, content, context, userId, systemPrompt: customSystemPrompt, userContent: customUserContent, maxTokens = 1500 } = body

    // Support both legacy (type/content/context) and new (systemPrompt/userContent) formats
    if (userId && userId !== user.id) {
      return NextResponse.json({ error: 'User ID mismatch' }, { status: 403 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })
    }

    let systemPrompt = customSystemPrompt || 'You are an expert military psychologist and SSB assessor.'
    let userMessage = customUserContent || ''

    // If TAT, proxy to Python backend
    if (!customSystemPrompt && type === 'tat') {
      const pythonBackendUrl = process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://localhost:8000/api/v1'
      const pythonRes = await fetch(`${pythonBackendUrl}/psychologist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test_type: 'TAT',
          test_stimulus: context?.imageDesc || 'TAT Picture',
          candidate_response: content
        })
      })
      
      if (!pythonRes.ok) {
        return NextResponse.json({ error: 'Python backend failed' }, { status: 502 })
      }
      
      const pythonData = await pythonRes.json()
      const evalData = pythonData.evaluation
      
      // Map Python response back to legacy TAT UI format so we don't break everything,
      // but inject the new fields!
      const mappedResult = {
        scores: { heroQuality: evalData.recommendation_score * 2, themePositivity: evalData.recommendation_score * 2, olqsReflected: 0, structure: 0, expression: 0 },
        olqsIdentified: evalData.subconscious_traits,
        redFlags: [],
        overallScore: evalData.recommendation_score * 20, // 1-5 to 0-100
        grade: evalData.recommendation_score >= 4 ? 'RECOMMENDED' : evalData.recommendation_score >= 3 ? 'BORDERLINE' : 'NEEDS_WORK',
        feedback: evalData.psychologist_thoughts,
        modelStoryTheme: evalData.projection_analysis
      }
      
      // Save result to assessment_sessions table
      const { error: dbError } = await supabase
        .from('assessment_sessions')
        .insert({
          user_id: user.id,
          module: 'tat',
          session_data: { content, context },
          ai_feedback: mappedResult,
          score: mappedResult.overallScore,
          olq_scores: mappedResult.scores,
          duration_seconds: context?.seconds || 0
        })

      if (dbError) console.error('Database error saving session:', dbError)
      return NextResponse.json(mappedResult)
    }

    // Build prompts based on type if not using custom prompts
    if (!customSystemPrompt && type) {
      if (type === 'interview') {
        systemPrompt = `You are evaluating an SSB interview answer.
Return ONLY a raw JSON object with this exact structure:
{ "scores": { "content": 0, "confidence": 0, "structure": 0, "olqs": 0, "authenticity": 0 }, "microFeedback": "one line", "redFlags": [], "overallScore": 0 }`
        userMessage = `Question: ${context?.question}\nAnswer: ${content}\nTime taken: ${context?.seconds || 0} seconds`
      } else if (type === 'wat') {
        systemPrompt = `You are evaluating an SSB WAT (Word Association Test).
Return ONLY a raw JSON object:
{ "overallScore": 0, "positivityScore": 0, "feedback": "string", "redFlags": [], "negativeWordList": [], "olqsReflected": [], "patterns": "analysis", "strengths": [], "scores": { "positivity": 0, "speed": 0, "relevance": 0 }, "grade": "RECOMMENDED"|"BORDERLINE"|"NEEDS_WORK" }`
        userMessage = `Context: ${JSON.stringify(context)}\nCandidate responses: ${content}`
      } else if (type === 'srt') {
        systemPrompt = `You are evaluating an SSB SRT (Situation Reaction Test).
Return ONLY a raw JSON object:
{ "overallScore": 0, "decisionQuality": 0, "leadershipShown": 0, "ethicalAlignment": 0, "actionOrientation": 0, "socialSensitivity": 0, "feedback": "string", "redFlags": [], "olqsReflected": [], "patterns": "analysis", "grade": "RECOMMENDED"|"BORDERLINE"|"NEEDS_WORK", "scores": { "initiative": 0, "practicality": 0, "courage": 0 } }`
        userMessage = `Context: ${JSON.stringify(context)}\nCandidate reactions: ${content}`
      } else if (type === 'sd') {
        systemPrompt = `You are the SSB Board President evaluating a Self Description (SD) test.
Return ONLY a raw JSON object with this exact structure:
{
  "status": "success",
  "evaluation": {
    "board_verdict": "string",
    "authenticity_rating": "string",
    "consistency_check": "string",
    "psychological_self_awareness_score": 0,
    "section_evaluations": [{"section": "string", "candidate_response": "string", "strengths": [], "weaknesses": [], "ideal_rewrite": "string"}],
    "olq_projection_from_sd": [{"olq": "string", "score": 0}],
    "overall_sd_score": 0
  }
}`
        userMessage = `Candidate's SD Sections: ${content}`
      } else {
        systemPrompt = `You are evaluating an SSB candidate's response for a ${type} test.
Return ONLY a raw JSON object containing an "overallScore" (0-100), "feedback" (string), "grade" (string), and "olq_scores" (object with OLQ keys 0-10).`
        userMessage = `Context: ${JSON.stringify(context)}\nCandidate response: ${content}`
      }
    }

    // Raw fetch to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: 0.2,
          }
        })
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      console.error('Gemini error:', errText)
      return NextResponse.json({ error: 'AI evaluation failed' }, { status: 502 })
    }

    const data = await response.json()
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    let evaluationResult
    try {
      const cleaned = responseText.replace(/```json\n?|```\n?/g, '').trim()
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      evaluationResult = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned)
    } catch {
      console.error('Failed to parse AI response:', responseText)
      return NextResponse.json({ raw: responseText })
    }

    // Save result to assessment_sessions table
    const { error: dbError } = await supabase
      .from('assessment_sessions')
      .insert({
        user_id: user.id,
        module: type || 'custom',
        session_data: { content: typeof content === 'string' ? content.slice(0, 5000) : content, context },
        ai_feedback: evaluationResult,
        score: evaluationResult.overallScore || evaluationResult.overall_sd_score || 0,
        olq_scores: evaluationResult.scores || evaluationResult.olq_scores || {},
        duration_seconds: context?.seconds || 0
      })

    if (dbError) {
      console.error('Database error saving session:', dbError)
    }

    return NextResponse.json(evaluationResult)

  } catch (error) {
    console.error('ai-evaluate error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
