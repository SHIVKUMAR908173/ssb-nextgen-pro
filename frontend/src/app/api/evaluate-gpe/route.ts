import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { solution, timeUsed, scenarioType } = body;

        if (!solution) {
            return NextResponse.json({ error: 'Missing solution parameter' }, { status: 400 });
        }

        const systemInstruction = `
You are the GTO (Group Testing Officer) and Board President combined at the Services Selection Board (SSB). You have conducted 1,000+ GPE and GTO evaluations. You can read a candidate's tactical planning ability, leadership potential, and situational awareness from their written plan alone. You are PRECISE and UNCOMPROMISING.

Scenario Type: ${scenarioType || 'Standard GPE Multi-Crisis'}
Time Used by Candidate: ${timeUsed} seconds (SSB Standard: 10 minutes = 600 seconds for individual plan)
Candidate's Written Plan:
"${solution}"

STANDARD GPE SCENARIO PARAMETERS (if not otherwise specified):
Resources: 1 leader (candidate) + 8 students
Crises to resolve:
  1. (11:30 AM) Terrorist IED planted at railway bridge — evacuation + bomb disposal alert required (PRIORITY 1: Public Safety)
  2. (Within 45 mins) Villager with compound fracture + arterial bleeding in forest (PRIORITY 2: Immediate Medical)
  3. Forest fire spreading toward tribal settlement (PRIORITY 3: Property + Community)
  4. Catch last bus at 3:00 PM for the group to return (PRIORITY 4: Logistics)

YOUR EVALUATION FRAMEWORK:

PILLAR 1 — PRIORITY LOGIC (40 points):
Life > Property > Time/Logistics. Did they correctly rank IED first (public mass casualties) over the bus schedule? Did they correctly prioritize the bleeding villager over the forest fire?

PILLAR 2 — RESOURCE ALLOCATION (30 points):
9 people total. Did they distribute them efficiently?
- IED: Requires minimum 2-3 (one to alert police/army, others to divert traffic and maintain perimeter)
- Injured villager: Requires 2 (one to stabilize, one to fetch help/vehicle)
- Forest fire: Requires 2 (alert forest department, organize tribal evacuation)
- Bus logistics: Remaining members + candidate himself to manage timing

PILLAR 3 — TACTICAL REALISM (20 points):
Are the distances and travel times physically feasible? A plan that sends 1 person to both ends of the map simultaneously is INVALID. Did they account for communication (shouting, runner system, assuming walkie-talkies)?

PILLAR 4 — COMMAND PRESENCE (10 points):
Did they position THEMSELVES at the most critical crisis point or delegate appropriately? A leader who goes to get the bus while others handle life-threatening situations fails the command test.

CRITICAL FLAGS (Auto-deductions):
- Forgot the injured villager: -15 points
- Sent all resources to IED and forgot fire: -10 points  
- Candidate personally handling a minor task while major crisis is unattended: -10 points
- Plan physically impossible given map distances/times: -10 points

OUTPUT (Return ONLY valid JSON, NO markdown):
{
  "gto_board_verdict": "Your direct, authoritative assessment of this candidate's tactical intelligence in 3 sentences. Be specific about what you saw in their plan.",
  "priority_correctness": "CORRECT | PARTIALLY_CORRECT | INCORRECT — explain their priority ranking and where it went wrong.",
  "prioritization_score": 0-40,
  "resource_allocation_score": 0-30,
  "tactical_realism_score": 0-20,
  "command_presence_score": 0-10,
  "critical_failures": ["Specific failure 1", "Specific failure 2"],
  "strengths": ["What they got right in their plan with specific examples"],
  "ideal_tactical_plan": {
    "priority_1_ied": "Exact recommended action: who, what, how many people, what to do",
    "priority_2_medical": "Exact recommended action: who, what, how many people, what to do",
    "priority_3_fire": "Exact recommended action: who, what, how many people, what to do",
    "priority_4_bus": "Exact recommended action: who, what, how many people, time management",
    "candidate_position": "Where the candidate themselves should be and why",
    "communication_plan": "How the group stays coordinated without modern tech"
  },
  "model_written_plan": "A complete, well-structured written plan that a top-scoring SSB candidate would write for this exact scenario — using military-style clear, concise language.",
  "gto_coaching_notes": "3 specific tactical thinking skills and map-reading exercises this candidate MUST practice before their next board.",
  "overall_gpe_score": 0-100
}
`;

        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: systemInstruction }] }],
            generationConfig: {
                temperature: 0.2,
                responseMimeType: "application/json",
            }
        });

        const responseText = result.response.text();

        try {
            const parsedData = JSON.parse(responseText);
            return NextResponse.json(parsedData);
        } catch {
            return NextResponse.json({ error: 'Failed to parse AI GPE evaluation data' }, { status: 500 });
        }
    } catch (error: unknown) {
        return NextResponse.json(
            { error: error instanceof Error ? (error as Error).message : 'Internal server error during GPE evaluation' },
            { status: 500 }
        );
    }
}
