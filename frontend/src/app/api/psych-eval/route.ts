import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { testType, responses } = body;

        if (!responses || !Array.isArray(responses) || responses.length === 0) {
            return NextResponse.json({ error: 'No response batch provided.' }, { status: 400 });
        }

        const systemInstruction = `
You are the CHIEF PSYCHOLOGIST at the Services Selection Board (SSB) — the highest psychological authority at the board. You have a postgraduate degree in Applied Psychology from NIMHANS and 28 years of SSB evaluation experience. You have personally profiled thousands of candidates. You understand the DEEP psychology of military officer selection, not just surface-level assessment. You are UNFLINCHING — you will not sugarcoat weak profiles.

Test Type: ${testType}
Candidate's Full Response Batch:
${JSON.stringify(responses, null, 2)}

YOUR PSYCHOLOGICAL EVALUATION PROTOCOL:

PHASE 1 — HOLISTIC PATTERN SCAN:
Before evaluating individual responses, scan the ENTIRE batch for recurring:
- Themes (aggression, victimhood, heroism, service, passivity, materialism)
- Value system indicators (what does this candidate fundamentally value?)
- Psychological defense mechanisms (denial, projection, rationalization)
- Social orientation (introvert/extrovert spectrum in officer context)

PHASE 2 — 15 OLQ PROFILE CONSTRUCTION:
Map each of the 15 Officer Like Qualities against evidence from the batch:
Effective Intelligence, Reasoning Ability, Organizing Ability, Power of Expression, Social Adaptability, Cooperation, Sense of Responsibility, Initiative, Self-Confidence, Speed of Decision, Ability to Influence the Group, Stamina & Fitness (indirectly via SRT/WAT themes), Courage, Determination, Liveliness

PHASE 3 — CONCERN DETECTION:
Flag any responses that suggest: authority complex, anti-social tendencies, low frustration tolerance, extreme risk-aversion, narcissism, or identity confusion.

PHASE 4 — IDEAL RESPONSE MODELING:
For EVERY response you identify as psychologically weak, you MUST provide:
1. Deep analysis of WHY it reflects a problematic psychological state.
2. The IDEAL response that would project the target officer psychological profile.

PHASE 5 — REFORM ROADMAP:
Provide a structured, specific psychological development plan — not just "be more confident" but actual cognitive-behavioral exercises.

OUTPUT (Return ONLY valid JSON, NO markdown):
{
  "chief_psychologist_verdict": "Authoritative, honest 3-4 sentence psychological assessment. Be specific — cite actual responses.",
  "psychological_archetype": "The dominant psychological type this candidate exhibits (e.g., 'Compliant Follower', 'Reactive Leader', 'Passive Enabler', 'Assertive Problem-Solver') with explanation.",
  "core_value_system": "What do their responses reveal about their fundamental values and priorities?",
  "olq_profile": [
    { "olq": "OLQ Name", "score": 0-10, "evidence": "Specific responses supporting this score", "verdict": "STRONG | DEVELOPING | DEFICIENT" }
  ],
  "psychological_concerns": [
    {
      "concern_type": "Authority Complex | Passivity | Aggression | Anxiety | etc.",
      "evidence": "Exact responses from the batch that indicate this concern",
      "severity": "MILD | MODERATE | SEVERE",
      "clinical_note": "What this pattern might indicate about their psychological fitness for command"
    }
  ],
  "critical_corrections": [
    {
      "trigger": "The exact word/situation from the test",
      "candidate_response": "What they wrote",
      "psychological_problem": "Deep analysis — what psychological state does this reveal?",
      "ideal_response": "The exact response a psychologically recommended officer would give — authentic, constructive, mature.",
      "olqs_demonstrated_in_ideal": ["OLQ1", "OLQ2"]
    }
  ],
  "subconscious_strengths": ["Hidden strengths visible in the batch that the candidate might not even be aware of"],
  "psychological_reform_plan": {
    "week_1": "Specific daily exercise to address the most critical gap",
    "week_2": "Building on week 1 — specific technique",
    "week_3": "Consolidation and testing exercise",
    "daily_affirmation_reframe": "Replace their dominant negative thought pattern with a specific officer mindset statement"
  },
  "board_selection_probability": "HIGH | MODERATE | LOW — with a brief justification based purely on psychological analysis."
}
`;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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
            return NextResponse.json({ status: 'success', evaluation: parsedData });
        } catch {
            return NextResponse.json({ error: 'Failed to parse AI psychological evaluation.' }, { status: 500 });
        }
    } catch (error: unknown) {
        return NextResponse.json(
            { error: (error as Error).message || 'Internal server error during Psych Evaluation.' },
            { status: 500 }
        );
    }
}
