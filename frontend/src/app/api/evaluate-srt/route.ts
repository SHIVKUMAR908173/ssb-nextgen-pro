import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/supabase/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const user = await getServerUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized. Please log in to access AI evaluation.' }, { status: 401 });
        }

        const body = await req.json();
        const { responses } = body;

        if (!responses || !Array.isArray(responses)) {
            return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
        }

        const systemInstruction = `
You are a senior DIPR Psychologist at the Services Selection Board (SSB).
Your task is to evaluate a candidate's responses to Situation Reaction Test (SRT) scenarios.
For each scenario and response, evaluate based on Officer Like Qualities (OLQs).
Identify the prominent OLQs shown (or lacking) and provide a constructive feedback snippet.

Return the result as a strict JSON object with this structure:
{
  "evaluation": {
    "qualities_observed": ["OLQ1", "OLQ2"],
    "overall_score": 75,
    "feedback_summary": "Overall feedback...",
    "detailed_analysis": [
      {
        "scenario": "...",
        "response": "...",
        "feedback": "...",
        "score": 7
      }
    ]
  }
}
`;
        const promptContext = JSON.stringify(responses);
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
        
        const result = await model.generateContent({
            contents: [
                { role: 'user', parts: [{ text: systemInstruction + "\\n\\nCandidate Responses:\\n" + promptContext }] }
            ],
            generationConfig: {
                temperature: 0.4,
                responseMimeType: "application/json",
            }
        });

        const responseText = result.response.text();
        const parsedData = JSON.parse(responseText);

        try {
            const { createClient: createServerClient } = await import('@/lib/supabase/server');
            const supabaseServerClient = await createServerClient();
            await supabaseServerClient.from('psych_submissions').insert({
                user_id: user.id,
                scenario_id: null,
                test_type: 'SRT',
                content: { responses },
                ai_feedback: JSON.stringify(parsedData.evaluation)
            });
        } catch (dbError) {
            console.error('[evaluate-srt] DB Save Error:', dbError);
        }

        return NextResponse.json({ 
            status: 'success', 
            evaluation: parsedData.evaluation 
        });

    } catch (error: unknown) {
        console.error("[SRT_EVAL_ERROR]", error);
        return NextResponse.json(
            { 
                error: (error as Error).message || 'An unexpected error occurred during evaluation.',
                fallbackMessage: 'Evaluation currently unavailable. Please try again.' 
            }, 
            { status: 500 }
        );
    }
}
