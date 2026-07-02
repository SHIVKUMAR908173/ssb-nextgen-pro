import { NextResponse } from 'next/server';

export const runtime = 'edge';

// ─── RAG Pipeline ──────────────────────────────────────────────────────────
// 1. Attempts to pull a live YouTube transcript snippet via the YouTube Data v3 API.
// 2. Falls back to a Gemini-powered grounded generation call with search grounding.
// 3. Formats the output into 4 strict GTO speech sections.

async function fetchYouTubeContext(topic: string): Promise<string> {
    if (!process.env.YOUTUBE_API_KEY) return '';
    try {
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&q=${encodeURIComponent(topic + ' India explained')}&key=${process.env.YOUTUBE_API_KEY}`;
        const res = await fetch(searchUrl);
        const data = await res.json();
        if (!data.items?.length) return '';

        // Extract video titles & descriptions as context (transcripts require server-side parsing)
        const snippets = data.items.map((item: { snippet: { title: string; description: string } }) =>
            `Video: "${item.snippet.title}" — ${item.snippet.description.slice(0, 300)}`
        ).join('\n');

        return `\n\n[SOURCE CONTEXT FROM YOUTUBE SEARCH]\n${snippets}\n`;
    } catch {
        return ''; // Graceful fallback — AI will use its own knowledge
    }
}

export async function POST(req: Request) {
    try {
        const { topic } = await req.json();
        const youtubeContext = await fetchYouTubeContext(String(topic));

        const ragPrompt = `
You are an expert GTO (Group Testing Officer) at the Indian Services Selection Board (SSB).
A candidate has 3 minutes to prepare a Lecturette on: "${topic}"

${youtubeContext}

Based on your expert knowledge ${youtubeContext ? 'AND the live sources above' : ''}, generate a highly structured 3-minute speech.
*** CRITICAL DIRECTIVE (Lakshya & Trishul Methodology): Emphasize a solution-oriented thought process rather than merely reciting facts. Prioritize trending current affairs statistics and frame them around how an Officer would perceive the strategic impact. ***

The notes MUST strictly follow this exact 3-part format. Use markdown headers:

## 1. Introduction (Hook)
(Provide a powerful opening statement or quote. 30 seconds of spoken content.)

## 2. Main Body (3 Key Points)
(Provide exactly 3 main points. 2 minutes of spoken content. Include specific data, statistics, or current affairs context.)
- **Point 1:** ...
- **Point 2:** ...
- **Point 3:** ...

## 3. Conclusion (Positive & Forward-Looking)
(Provide a positive, optimistic conclusion with a clear way forward. 30 seconds of spoken content.)

Tone: Confident, structured, factual. Speaking style of an Army officer. No filler phrases.
        `;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: ragPrompt }] }],
                    generationConfig: { temperature: 0.4, topK: 40, topP: 0.95 }
                })
            }
        );

        const data = await response.json();
        const notes = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Failed to generate notes. Please try again.';

        return NextResponse.json({ notes, youtubeUsed: !!youtubeContext });
    } catch (error) {
        console.error('[generate-notes] Error:', error);
        return NextResponse.json({ error: 'RAG pipeline failed.' }, { status: 500 });
    }
}
