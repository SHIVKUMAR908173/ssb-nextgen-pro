import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/supabase/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const user = await getServerUser();
        if (!user) {
            return NextResponse.json({ status: 'error', error: 'Unauthorized.' }, { status: 401 });
        }

        const payload = await req.json();
        
        const systemInstruction = `
You are the Chief Psychologist of the Services Selection Board (SSB).
You are evaluating a candidate's complete psychological dossier, which includes their TAT (Thematic Apperception Test), WAT (Word Association Test), SRT (Situation Reaction Test), and SDT (Self Description Test) responses.
Analyze the candidate's subconscious alignment, cross-test consistency, and overall suitability for military leadership based on the Officer Like Qualities (OLQs).

Your output MUST be a strict JSON object matching this structure exactly:
{
  "evaluation": {
    "verdict": "Your final qualitative verdict on the candidate (e.g., 'Highly Recommended. Exhibits strong leadership and psychological resilience under pressure.')",
    "overall_score": 85,
    "strengths": ["Strength 1", "Strength 2", "Strength 3"],
    "weaknesses": ["Fatal Red Flag 1", "Weakness 2"],
    "consistency_analysis": "A paragraph explaining whether the candidate's subconscious traits observed in TAT align with their conscious self-image in SDT, and their reflex actions in SRT/WAT. Point out any fabrications or inconsistencies."
  }
}
`;
        
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
        
        const result = await model.generateContent({
            contents: [
                { role: 'user', parts: [{ text: systemInstruction + "\\n\\nCandidate Dossier:\\n" + JSON.stringify(payload) }] }
            ],
            generationConfig: {
                temperature: 0.4,
                responseMimeType: "application/json",
            }
        });

        const responseText = result.response.text();
        const parsedData = JSON.parse(responseText);

        return NextResponse.json({ 
            status: 'success', 
            evaluation: parsedData.evaluation 
        });

    } catch (error: unknown) {
        console.error('Error in comprehensive psych evaluation:', error);
        return NextResponse.json(
            { status: 'error', error: 'Internal server error during evaluation' },
            { status: 500 }
        );
    }
}
