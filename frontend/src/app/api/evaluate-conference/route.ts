import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const { transcript, psychScores, gtoScores } = await req.json();

        const systemPrompt = `
      You are the President of the Services Selection Board (SSB) conducting the Day 5 Conference.
      You are evaluating a candidate based on three profiles:
      1. Psychologist Profile (Score: ${psychScores}/10)
      2. GTO Profile (Score: ${gtoScores}/10)
      3. IO Profile (Based on the interview transcript provided below).
      
      Task:
      - Compare the three profiles for consistency. 
      - Base your evaluation STRICTLY on exact quotes from the transcript.
      - If the candidate is a borderline case (scores mismatch), generate a concluding Situation Reaction Test (SRT) to test their composure under pressure.
      *** CRITICAL DIRECTIVE (SSB WORLD Methodology): For borderline candidates, ask a highly situational, uncomfortable question designed to test their ability to handle closed-door scrutiny (e.g., 'If your IO didn't like you, how would you convince us?'). ***
      - Output a final "Recommended" or "Not Recommended" verdict with a 3-bullet point justification highlighting their Officer Like Qualities (OLQs).
      
      Transcript: "${transcript}"
    `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }]
            })
        });

        const data = await response.json();
        return NextResponse.json({ evaluation: data.candidates?.[0]?.content?.parts?.[0]?.text || "No evaluation found" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to generate conference evaluation.' }, { status: 500 });
    }
}
