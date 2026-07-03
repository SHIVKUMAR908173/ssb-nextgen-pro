import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { promises as fs } from 'fs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface WatResponsePayload {
  word: string;
  response: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { responses } = body;

        if (!responses || !Array.isArray(responses)) {
            return NextResponse.json({ error: 'No responses provided.' }, { status: 400 });
        }

        // Load the enriched dataset for context
        const datasetPath = path.join(process.cwd(), 'src/data/wat_repository_enriched.json');
        const datasetRaw = await fs.readFile(datasetPath, 'utf8');
        const enrichedData = JSON.parse(datasetRaw);

        // Prepare context mapping
        const evaluationContext = responses.map((r: WatResponsePayload) => {
            const enriched = enrichedData.find((e: any) => e.word.toLowerCase() === r.word.toLowerCase());
            return {
                word: r.word,
                candidate_response: r.response,
                category: enriched?.category || 'Unknown',
                difficulty: enriched?.difficulty || 'Medium',
                target_olqs: enriched?.olq_mapping || [],
                ideal_sentences: enriched?.sample_sentences || []
            };
        });

        const systemInstruction = `
You are the BOARD PRESIDENT of the Services Selection Board (SSB), India — the highest-ranking authority at the board. You have 25 years of experience evaluating officer candidates. You have personally assessed thousands of cadets and understand EXACTLY what psychological projection separates a recommended officer from a returned candidate.

You are now evaluating a candidate's Word Association Test (WAT) responses.

Here are the candidate's responses along with the grading criteria (target OLQs and sample ideal sentences) for each word:
${JSON.stringify(evaluationContext, null, 2)}

YOUR EVALUATION FRAMEWORK (Think like the Board President):
You are NOT just checking if the sentence is grammatically correct. You are reading the candidate's SUBCONSCIOUS MIND. Every word they associate reveals:
1. PSYCHOLOGICAL STABILITY — Do they have a calm, balanced, and mature approach?
2. OFFICER MINDSET — Do they project initiative, social leadership, and responsibility?
3. HIDDEN NEGATIVITY — Detect submissiveness, pessimism, aggression, fear, or extreme ego buried under seemingly normal responses.
4. OLQ RADIATION — Each response should radiate one or more of the 15 OLQs: Effective Intelligence, Reasoning Ability, Organizing Ability, Power of Expression, Social Adaptability, Cooperation, Sense of Responsibility, Initiative, Self-Confidence, Speed of Decision, Ability to Influence the Group, Stamina & Fitness, Courage, Determination, Liveliness.

STRICT INSTRUCTIONS:
- Grade strictly against the target OLQs associated with each word in the provided context.
- For EACH response that shows a weakness or missed opportunity (e.g. failing to project the target OLQ), you MUST provide WHY it is weak, and an IDEAL SSB-recommended sentence that would project strong OLQs.

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
  "board_score": <number between 0 and 100>
}
`;

        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: systemInstruction }] }],
            generationConfig: { temperature: 0.4, responseMimeType: "application/json" }
        });

        const text = result.response.text();
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        return NextResponse.json({ status: 'success', evaluation: JSON.parse(cleanedText) });
    } catch (error: unknown) {
        console.error("[EVALUATE_WAT_ERROR]", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
