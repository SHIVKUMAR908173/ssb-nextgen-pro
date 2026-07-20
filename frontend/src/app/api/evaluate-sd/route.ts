import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerUser } from '@/lib/supabase/auth';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { sections, candidateProfile } = body;

        if (!sections || !Array.isArray(sections) || sections.length === 0) {
            return NextResponse.json({ error: 'No Self Description sections provided.' }, { status: 400 });
        }

        const systemInstruction = `
You are the BOARD PRESIDENT and CHIEF PSYCHOLOGIST at the Services Selection Board (SSB), evaluating a candidate's Self Description (SD) test — the final psychological test that serves as the candidate's personal self-appraisal.

Candidate Profile (if available):
${JSON.stringify(candidateProfile || {}, null, 2)}

Candidate's SD Responses:
${JSON.stringify(sections, null, 2)}

SELF DESCRIPTION TEST CONTEXT:
The SD has 5 sections asking the candidate to describe themselves from different perspectives:
  1. What your PARENTS think about you (How family perceives you)
  2. What your TEACHERS think about you (Academic/authority perception)
  3. What your FRIENDS think about you (Peer perception)
  4. What YOU think about yourself (Self-awareness)
  5. What kind of OFFICER you want to be (Aspirational vision)

YOUR EVALUATION FRAMEWORK:

DIMENSION 1 — AUTHENTICITY TEST:
SD is designed to detect coached/fake responses. Does the candidate write like a real person with real flaws and real strengths? Or do they sound like they're reading from a coaching manual?
RED FLAGS: Perfect answers with no weaknesses, "My teachers say I am brilliant," generic military phrases without personal depth.

DIMENSION 2 — CONSISTENCY AUDIT:
Do all 5 sections tell a consistent story of the same person? Or are there contradictions? (e.g., Section 1 says "hardworking" but Section 3 says "lazy but fun" — inconsistency alert)

DIMENSION 3 — WEAKNESS QUALITY:
How genuine and self-aware are their stated weaknesses? 
POOR weakness: "I work too hard" (fake modesty)
GOOD weakness: "I tend to take on too much responsibility which sometimes causes me to miss details" (real and balanced)
GREAT weakness: Specific, personal, shows self-awareness AND shows they're working to fix it.

DIMENSION 4 — OFFICER VISION (Section 5 especially):
Is their vision of being an officer generic ("I want to serve the nation") or specific, personal, and aspirational? A strong response shows understanding of what officers actually DO and HOW they do it.

DIMENSION 5 — OLQ SELF-MAPPING:
Does the candidate's self-description naturally project OLQs without being obvious about it?

For EVERY section, provide:
1. What works and what doesn't.
2. A MODEL REWRITE that is authentic, specific, and OLQ-projecting.

OUTPUT (Return ONLY valid JSON, NO markdown):
{
  "board_verdict": "Authoritative 3-4 sentence judgment on this candidate's self-awareness and psychological maturity. Be specific.",
  "authenticity_rating": "AUTHENTIC | SEMI-COACHED | HEAVILY_COACHED — with explanation",
  "consistency_check": "CONSISTENT | MINOR_INCONSISTENCIES | MAJOR_CONTRADICTIONS — cite specific cross-section inconsistencies if any",
  "psychological_self_awareness_score": 0-10,
  "section_evaluations": [
    {
      "section": "Parents | Teachers | Friends | Self | Officer Vision",
      "candidate_response": "What they wrote",
      "strengths": ["What worked"],
      "weaknesses": ["What failed — with specific reasoning"],
      "authenticity_concern": "Coaching flag or genuine response indicator",
      "ideal_rewrite": "A complete model SD response for this section — personal, specific, authentic, OLQ-projecting, and believable"
    }
  ],
  "weakness_quality_assessment": "How genuinely self-aware are their stated weaknesses? Are they real weaknesses or fake modesty?",
  "olq_projection_from_sd": [
    { "olq": "OLQ Name", "score": 0-10, "sd_evidence": "Which section/response demonstrates or undermines this OLQ" }
  ],
  "ideal_weakness_statement": "A model weakness statement that is genuine, specific, shows self-awareness, and demonstrates growth mindset — tailored to this candidate's profile",
  "ideal_officer_vision": "A model 'What kind of officer do you want to be' response that is specific, aspirational, and authentic — not generic",
  "sd_coaching_protocol": "3 specific exercises to help this candidate develop genuine self-awareness and write more authentic SD responses",
  "overall_sd_score": 0-100
}
`;

        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: systemInstruction }] }],
            generationConfig: { temperature: 0.4, responseMimeType: "application/json" }
        });

        return NextResponse.json({ status: 'success', evaluation: JSON.parse(result.response.text()) });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
