import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/supabase/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { promises as fs } from 'fs';

interface SrtResponsePayload {
  scenarioId: string;
  scenario: string;
  response: string;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { responses } = await req.json();

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty responses.' }, { status: 400 });
    }

    // Load the enriched dataset for context
    const datasetPath = path.join(process.cwd(), 'src/data/srt_scenarios_enriched.json');
    const datasetRaw = await fs.readFile(datasetPath, 'utf8');
    const enrichedData = JSON.parse(datasetRaw);

    // Prepare context mapping
    const evaluationContext = responses.map((r: SrtResponsePayload) => {
      const enriched = enrichedData.find((e: any) => e.id === r.scenarioId);
      return {
        id: r.scenarioId,
        scenario: r.scenario,
        cadet_response: r.response,
        category: enriched?.category || 'Unknown',
        target_olqs: enriched?.olq_assessment || [],
        positive_indicators: enriched?.positive_indicators || [],
        negative_indicators: enriched?.negative_indicators || []
      };
    });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `You are Brigadier 'Alpha', a strict and seasoned expert SSB Psychologist evaluating a cadet's responses to a Situation Reaction Test (SRT).

Here are the cadet's responses along with the grading criteria (positive indicators, negative indicators, and target OLQs) for each scenario:
${JSON.stringify(evaluationContext, null, 2)}

**STRICT EVALUATION INSTRUCTIONS:**
1. Be extremely critical. Do not give a 'Good' rating unless the cadet's response explicitly hits the positive indicators and demonstrates a clear, logical, and complete action.
2. If the response is vague, lacks initiative, or shows any signs of the negative indicators, penalize it heavily and rate it 'Poor' or 'Average'.
3. Do not hesitate to give a low overall score if the cadet demonstrates a lack of Officer Like Qualities (OLQs).
4. Provide your response as a valid JSON object matching this exact structure:
{
  "overall_score": <number between 1 and 10>,
  "summary": "<A short paragraph summarizing their psychological profile and reaction tendencies>",
  "detected_olqs": ["<olq1>", "<olq2>"],
  "scenarios_feedback": [
    {
      "id": "<scenarioId>",
      "rating": "<Good | Average | Poor>",
      "feedback": "<One brief sentence explaining why>"
    }
  ]
}

Ensure the output is ONLY valid JSON, with no markdown formatting or code blocks.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean up potential markdown code blocks returned by Gemini
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const evaluation = JSON.parse(cleanedText);
      return NextResponse.json({ status: 'success', evaluation });
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON output:", cleanedText);
      return NextResponse.json({ error: 'Failed to parse evaluation results.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error("[EVALUATE_SRT_ERROR]", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
