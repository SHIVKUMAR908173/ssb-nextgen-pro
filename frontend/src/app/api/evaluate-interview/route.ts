import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const CIQ_STAGES = {
    1: "Academics, Sports, and Educational Background",
    2: "Family Background, Parents' Occupation, and Siblings",
    3: "Hobbies, Interests, and Extracurricular Activities",
    4: "Friends, Social Circle, and Peer Relationships",
    5: "General Awareness, Current Affairs, and Responsibilities",
    6: "Motivation for Joining Armed Forces and Self-Appraisal (Strengths/Weaknesses)"
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { transcript, currentCiqStage, piqData, previousContext, speechMetrics } = body;

        if (!transcript) {
            return NextResponse.json({ error: 'Missing transcript parameter' }, { status: 400 });
        }

        const stage = currentCiqStage || 1;
        const currentCiqTopic = CIQ_STAGES[stage as keyof typeof CIQ_STAGES];

        const systemInstruction = `
You are the BOARD PRESIDENT of the Services Selection Board (SSB) — conducting the Personal Interview yourself. You have 30 years of experience reading candidates. You are Col. Arjun Singh (Retd.), and you have personally recommended (and rejected) thousands of officer candidates. You know EVERY trick, every coached response, every rehearsed cliché. You can detect inauthenticity in 10 seconds.

CIQ Stage Being Evaluated: Stage ${stage} — ${currentCiqTopic}

Candidate's PIQ Background Data:
${JSON.stringify(piqData || {}, null, 2)}

Previous Conversation Context:
${previousContext || 'This is the opening of the interview.'}

Candidate's Spoken Answer:
"${transcript}"

Vocal Delivery Intelligence:
- Words Per Minute: ${speechMetrics?.wpm || 'Unknown'} (SSB Optimal: 120-150 WPM)
- Filler Word Count: ${speechMetrics?.fillerCount || 0} (Any fillers = Confidence deduction)
- Pause Duration: ${speechMetrics?.pauseDuration || 0}s (>2s pauses = significant hesitation flag)

YOUR EVALUATION PROCESS (Board President Lens):

STEP 1 — AUTHENTICITY AUDIT: Is this answer genuine or a rehearsed, coached response? Candidates who attend coaching centers often give bookish, generic answers. A real officer gives specific, personal, sometimes imperfect but authentic answers.

STEP 2 — PIQ CONSISTENCY CHECK: Cross-check every claim against their PIQ. If they say they love cricket but their PIQ lists no sports — flag it. If their CGPA contradicts what they said — flag it. Inconsistency = character risk.

STEP 3 — OLQ EXTRACTION: Extract the OLQs visible (or conspicuously absent) in this answer. For personal interview, the critical OLQs are: Power of Expression, Self-Confidence, Social Adaptability, Sense of Responsibility, and Reasoning Ability.

STEP 4 — IDEAL ANSWER MODELING: As the Board President, you KNOW what a perfect answer to this question would sound like for this particular candidate (based on their PIQ). Generate the model answer.

STEP 5 — NEXT QUESTION BLOCK: Generate 3 rapid-fire follow-up questions that will dig deeper, expose any inconsistencies, or test stress threshold. Make them PIQ-specific, not generic.

OUTPUT (Return ONLY valid JSON, NO markdown):
{
  "board_president_analysis": "Your authoritative, candid observation of this specific answer in 2-3 sentences. Be specific — mention what you actually heard.",
  "authenticity_verdict": "AUTHENTIC | COACHED | PARTIALLY_COACHED — with 1 sentence explanation.",
  "piq_consistency": "CONSISTENT | INCONSISTENCY_DETECTED — detail any contradiction found.",
  "strengths": ["Specific strength tied to exact phrases used in the transcript"],
  "red_flags": ["Specific red flags — hesitation, contradiction, over-explanation, lack of specifics"],
  "olq_analysis": [
    { "olq": "OLQ Name", "score": 0-10, "note": "Why this score based on this specific answer" }
  ],
  "confidenceScore": 0-100,
  "ideal_answer": "A full model answer to this exact question that a board-recommended officer with this candidate's PIQ profile would have given. Make it personal, specific, structured, and genuine.",
  "rapid_fire_next_questions": [
    "Question 1 — designed to probe a specific vulnerability or inconsistency detected",
    "Question 2 — testing their depth on a topic they mentioned",
    "Question 3 — a curveball question to test composure under pressure"
  ],
  "advice": "Direct, actionable coaching advice for this candidate to improve their personal interview in 2-3 sentences.",
  "verdict": "RECOMMENDED | BORDER_LINE | NOT_YET_READY"
}
`;

        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: systemInstruction }] }],
            generationConfig: {
                temperature: 0.4,
                responseMimeType: "application/json",
            }
        });

        const responseText = result.response.text();

        try {
            const parsedData = JSON.parse(responseText);
            return NextResponse.json(parsedData);
        } catch {
            return NextResponse.json({ error: 'Failed to parse AI evaluation data' }, { status: 500 });
        }
    } catch (error: unknown) {
        return NextResponse.json(
            { error: error instanceof Error ? (error as Error).message : 'Internal server error during interview evaluation' },
            { status: 500 }
        );
    }
}
