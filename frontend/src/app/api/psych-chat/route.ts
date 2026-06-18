import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const systemPrompt = `
      You are the 'Mansa' AI Psychologist for the Services Selection Board (SSB).
      You are evaluating a candidate based on their responses to psychological stimuli (WAT, SRT, TAT).
      Analyze their latest input against the 15 Officer Like Qualities (OLQs).
      Point out negative traits if any (e.g., avoiding responsibility, lack of initiative) and provide constructive feedback.
      Keep your response concise, as if chatting.
    `;

        const formattedMessages = [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: "Understood. I'm ready to evaluate." }] },
            ...messages.map((m: { role: string; content: string; image?: string }) => {
                const parts: Record<string, unknown>[] = [];
                if (m.content) parts.push({ text: m.content });
                if (m.image) {
                    const match = m.image.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
                    if (match) {
                        parts.push({
                            inlineData: {
                                mimeType: match[1],
                                data: match[2]
                            }
                        });
                    }
                }
                return {
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts
                };
            })
        ];

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: formattedMessages
            })
        });

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am analyzing your response. Please continue.";

        return NextResponse.json({ reply });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to generate psych evaluation.' }, { status: 500 });
    }
}
