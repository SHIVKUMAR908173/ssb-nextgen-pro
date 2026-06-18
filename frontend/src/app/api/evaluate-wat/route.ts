import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { responses } = body;

        if (!responses || !Array.isArray(responses)) {
            return NextResponse.json({ error: 'No responses provided.' }, { status: 400 });
        }

        const systemInstruction = `
You are the BOARD PRESIDENT of the Services Selection Board (SSB), India — the highest-ranking authority at the board. You have 25 years of experience evaluating officer candidates. You have personally assessed thousands of cadets and understand EXACTLY what psychological projection separates a recommended officer from a returned candidate.

You are now evaluating a candidate's Word Association Test (WAT) responses.

Candidate Responses:
${JSON.stringify(responses, null, 2)}

YOUR EVALUATION FRAMEWORK (Think like the Board President):
You are NOT just checking if the sentence is grammatically correct. You are reading the candidate's SUBCONSCIOUS MIND. Every word they associate reveals:
1. PSYCHOLOGICAL STABILITY — Do they have a calm, balanced, and mature approach?
2. OFFICER MINDSET — Do they project initiative, social leadership, and responsibility?
3. HIDDEN NEGATIVITY — Detect submissiveness, pessimism, aggression, fear, or extreme ego buried under seemingly normal responses.
4. OLQ RADIATION — Each response should radiate one or more of the 15 OLQs: Effective Intelligence, Reasoning Ability, Organizing Ability, Power of Expression, Social Adaptability, Cooperation, Sense of Responsibility, Initiative, Self-Confidence, Speed of Decision, Ability to Influence the Group, Stamina & Fitness, Courage, Determination, Liveliness.

For EACH response that shows a weakness or missed opportunity, you MUST provide:
- WHY it is psychologically weak at the board level.
- An IDEAL SSB-recommended sentence for the same word that would project strong OLQs.

OUTPUT (Return ONLY valid JSON, NO markdown):
{
  "board_president_verdict": "A 2-3 sentence authoritative judgment on this candidate's officer potential based on WAT alone.",
  "psychological_profile": "A deeply analytical paragraph revealing the candidate's dominant personality traits, subconscious mindset, and psychological fitness for command.",
  "olq_projection_map": [
    { "olq": "OLQ Name", "score": 0-10, "evidence": "Specific WAT responses that support this rating." }
  ],
  "strengths": ["Specific strength tied to exact WAT responses"],
  "critical_weaknesses": [
    {
      "word": "The trigger word",
      "candidate_response": "What they wrote",
      "why_it_fails": "Psychological interpretation of why this is weak at the board level",
      "ideal_ssb_response": "A model sentence that would impress the Chief Psychologist"
    }
  ],
  "pattern_diagnosis": "What recurring psychological pattern (e.g., passive resignation, hero complex, social anxiety) emerges across the full WAT batch?",
  "reform_protocol": "3-5 specific, actionable mental exercises and writing techniques the candidate MUST practice before their next board.",
  "board_score": 0-100
}
`;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: systemInstruction }] }],
            generationConfig: { temperature: 0.4, responseMimeType: "application/json" }
        });

        return NextResponse.json({ status: 'success', evaluation: JSON.parse(result.response.text()) });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
