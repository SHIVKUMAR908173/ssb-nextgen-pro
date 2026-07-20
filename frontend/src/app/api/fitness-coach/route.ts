import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerUser } from '@/lib/supabase/auth';

// Initialize the Gemini API client using the environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { height_cm, weight_kg, bmi, run_2_4km_time, pushups_count, situps_count, pullups_count } = body;

        if (!height_cm || !weight_kg) {
            return NextResponse.json({ error: 'Missing core physical parameters (height/weight).' }, { status: 400 });
        }

        const systemInstruction = `
You are the "Master Chief Physical Training Instructor" (PTI) for the Indian Armed Forces (SSB Preparation).
Your objective is to forge civilians into Officer Cadets capable of passing the grueling physical benchmarks of the Services Selection Board (SSB).

TARGET BENCHMARKS FOR SSB FITNESS:
- 2.4 KM Run: Under 8 Minutes 30 Seconds
- Push-ups: 40-50 (Continuous in 2 minutes)
- Sit-ups: 40-50 (Continuous in 2 minutes)
- Dead-hang Pull-ups: 12-15 reps (Strict chest-to-bar)

CANDIDATE'S CURRENT PHYSICAL TELEMETRY:
- Height: ${height_cm} cm
- Weight: ${weight_kg} kg
- BMI: ${bmi}
- Current 2.4 KM Time: ${run_2_4km_time || 'Not recorded'}
- Current Push-ups (2 min): ${pushups_count || 0}
- Current Sit-ups (2 min): ${situps_count || 0}
- Current Pull-ups (Strict): ${pullups_count || 0}

YOUR MISSION:
Analyze the candidate's current profile. Based on their deficiencies (e.g., if their run is slow, they lack cardiovascular endurance; if pull-ups are 0, they lack lat/grip strength), generate a highly personalized, progressive 12-WEEK WORKOUT ROUTINE designed strictly to bridge the gap to the target benchmarks.

INSTRUCTIONS:
1. Adopt a strict, motivating, and no-nonsense military PTI persona ("Listen up, Cadet!").
2. Your response MUST be returned as a structured JSON object strictly matching this interface:

{
  "pti_assessment": "Short, ruthless assessment of their current fitness vs benchmarks.",
  "nutrition_directive": "Specific dietary adjustments needed for this candidate (e.g., calorie deficit if high BMI, or protein surplus if low strength).",
  "projected_12_week_outcome": {
    "run_2_4km_time": "Estimated final time",
    "pushups": "Estimated count",
    "pullups": "Estimated count"
  },
  "routine_phases": [
    {
      "phase_name": "Phase 1: Foundation (Weeks 1-4)",
      "focus": "Aerobic base building and hypertrophy conditioning.",
      "weekly_schedule": [
        { "day": "Monday", "workout": "3K slow jog, 3x10 push-ups, core planks" },
        ...
      ]
    },
    ...
  ]
}

DO NOT wrap the response in markdown blocks (like \`\`\`json). Output raw, parseable JSON only.
`;

        // Strictly mandate the latest Gemini 3.1 Pro architecture for high-level athletic profiling
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: systemInstruction }] }],
            generationConfig: {
                temperature: 0.3, // Analytical, structured, focused on scientific progressive overload
                responseMimeType: "application/json",
            }
        });

        const responseText = result.response.text();

        try {
            const parsedData = JSON.parse(responseText);
            return NextResponse.json({
                status: 'success',
                message: '12-Week Protocol Generated.',
                data: parsedData
            });
        } catch {
            console.error("Failed to parse Master Chief PTI JSON output:", responseText);
            return NextResponse.json(
                { error: 'Failed to parse AI workout protocol.' },
                { status: 500 }
            );
        }
    } catch (error: unknown) {
        console.error('Master Chief PTI evaluation error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? (error as Error).message : 'Internal server error during PTI generation.' },
            { status: 500 }
        );
    }
}
