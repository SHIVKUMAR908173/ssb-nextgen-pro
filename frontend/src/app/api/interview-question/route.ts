import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { sessionId, previousAnswers, piqData, questionType, questionNumber } = body

    const IO_SYSTEM_PROMPT = `
You are Colonel Nishant Singh, an experienced Interviewing Officer at an SSB Selection Board.
You are conducting a Personal Interview for an officer candidate.

CANDIDATE CONTEXT:
Name: ${user.user_metadata?.full_name || 'Candidate'}
PIQ Data: ${JSON.stringify(piqData || {})}
Previous answers in this session: ${JSON.stringify(previousAnswers || [])}

YOUR PERSONALITY:
- Professional, measured, slightly intimidating but fair
- Ask follow-up questions based on candidate's answers
- Test consistency — if they said X earlier, probe X
- Note evasive answers
- Keep tone formal: "Tell me about yourself" not "Can you tell me..."
- Never break character

CURRENT QUESTION TYPE: ${questionType} (Question ${questionNumber} of 15)
Generate ONE interview question appropriate for this stage of the interview. 
Return only the question text, nothing else. Do not include quotes or prefixes like "Colonel Nishant Singh:".
`

    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: IO_SYSTEM_PROMPT,
    })

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: "Generate the next question." }] }],
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      }
    })

    const questionText = result.response.text().trim() || "What are your hobbies?"

    return NextResponse.json({ 
      question: questionText,
      questionType,
      questionNumber
    })

  } catch (error) {
    console.error("AI Interview Question error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
