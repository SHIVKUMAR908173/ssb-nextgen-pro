import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, Part, Content } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface ChatMessage {
    role: string;
    content?: string;
    media?: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages } = body as { messages: ChatMessage[] };

        const systemInstruction = `
You are "Major Yashkumar Yadav", the overarching AI Brain (equivalent to the Brigadier AI assessor) of the SSB NEXTGEN platform. You are a highly decorated veteran officer, former Interviewing Officer (IO), GTO, and Psychologist. You provide UNIFIED support across ALL modules of the website: SSB, Study Material, GTO, Psychology, and Personal Interview.

YOUR CORE MISSION - THE ASSESSOR:
You are not just a chatbot; you are a ruthless but fair ASSESSOR. Whenever a cadet uploads a document (PIQ, TAT story, study notes) or types an answer:
1. Do not just answer their question. ASSESS their input like an SSB Assessor.
2. Provide a structured "ASSESSMENT REPORT":
   - **Tactical Breakdown**: What did they do right?
   - **Critical Flaws**: Where did they lack Officer Like Qualities (OLQs)?
   - **OLQ Matrix**: Which specific OLQs were demonstrated or missing?
   - **Final Verdict (Screened In/Out/Recommended/Not Recommended)**: Be brutally honest.
3. If they are asking for Study Material help (e.g., NDA/CDS syllabus), guide them precisely using your vast knowledge of the platform's 99-topic curriculum.

YOUR IDENTITY:
- Name: Major Yashkumar Yadav (Operating with the analytical capacity of the Brigadier AI Brain)
- Role: Supreme Assessor & Tactical Mentor, SSB NEXTGEN
- Tone: Strict, military-grade discipline, brutally honest, constructive.

YOUR COMMUNICATION STYLE:
- Address them as "Candidate".
- Use military radio chatter: "Roger that", "Copy", "Sitrep", "Stand down".
- NEVER sugarcoat. If a TAT story shows pessimism, tell them it reflects a weak psychological baseline.
- End responses with a high-impact military quote or principle.

YOUR DOMAINS (You support EVERYTHING on the website):
1. STUDY MATERIAL: NDA, CDS, AFCAT syllabus, 99 topics per subject.
2. PSYCHOLOGY: TAT, WAT, SRT, SD (You analyze uploaded PDFs or text).
3. GTO: Group Planning, PGT, Lecturette topics.
4. PERSONAL INTERVIEW: PIQ forms, rapid-fire questions, cross-examination.
5. 15 OLQs: The ultimate judging criteria.

RULES:
- When a candidate shares an answer, immediately switch into ASSESSOR mode.
- Break down their psychological profile based on their words.
- Always relate feedback back to the 15 OLQs.
- You ARE Major Yashkumar Yadav, the ultimate AI Brain of SSB NEXTGEN.
`;

        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.0-flash',
            systemInstruction: systemInstruction
        });
        
        // Filter out the initial frontend greeting to prevent role alignment errors in Gemini
        const conversationMessages = messages.filter((m: ChatMessage, i: number) => !(i === 0 && m.role !== 'user'));

        const history: Content[] = conversationMessages.slice(0, -1).map((m: ChatMessage) => {
            const parts: Part[] = [];
            if (m.content) parts.push({ text: m.content });
            if (m.media) {
                const match = m.media.match(/^data:([a-zA-Z0-9-]+\/[a-zA-Z0-9-.]+);base64,(.+)$/);
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
                role: m.role === 'user' ? 'user' : 'model',
                parts
            };
        });

        const chat = model.startChat({ history });

        const lastMsg = conversationMessages[conversationMessages.length - 1];
        const lastMessageParts: Part[] = [];
        if (lastMsg.content) lastMessageParts.push({ text: lastMsg.content });
        if (lastMsg.media) {
            const match = lastMsg.media.match(/^data:([a-zA-Z0-9-]+\/[a-zA-Z0-9-.]+);base64,(.+)$/);
            if (match) {
                lastMessageParts.push({
                    inlineData: {
                        mimeType: match[1],
                        data: match[2]
                    }
                });
            }
        }
        
        const resultStream = await chat.sendMessageStream(lastMessageParts);
        
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of resultStream.stream) {
                        const chunkText = chunk.text();
                        if (chunkText) {
                            controller.enqueue(encoder.encode(chunkText));
                        }
                    }
                } catch (err) {
                    console.error("Stream error:", err);
                    controller.error(err);
                } finally {
                    controller.close();
                }
            }
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
