import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/supabase/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
    try {
        // 1. Auth Check - Ensure only logged-in cadets can chat with the Brigadier
        const user = await getServerUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized. Please log in to speak with the Brigadier.' }, { status: 401 });
        }

        // 2. Parse Request
        const body = await req.json();
        const { messages } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid chat payload.' }, { status: 400 });
        }

        // 3. Native Gemini Chatbot Engine
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const systemPrompt = `You are Brigadier 'Alpha', a seasoned veteran and SSB President. You mentor cadets preparing for the SSB interview.
You are strict, highly disciplined, but deeply caring about their success.
Keep your answers relatively brief, authoritative, and practical. Always relate things back to Officer Like Qualities (OLQs).`;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "System instructions: " + systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am Brigadier Alpha. I am ready to mentor the cadets." }],
                }
            ],
            generationConfig: {
                temperature: 0.7,
            },
        });

        // Convert the incoming messages format to Gemini format if necessary,
        // but here we just take the last message for the current prompt.
        // Assuming messages is an array of { role: 'user'|'assistant', content: string }
        const lastMessage = messages[messages.length - 1].content;
        
        try {
            const result = await chat.sendMessage(lastMessage);
            const responseText = result.response.text();
            
            return NextResponse.json({ 
                status: 'success', 
                reply: responseText 
            });

        } catch (genError: unknown) {
            throw new Error('The Brigadier is currently busy. Please try again later.');
        }

    } catch (error: unknown) {
        console.error("[CHATBOT_ERROR]", error);
        return NextResponse.json(
            { 
                error: (error as Error).message || 'An unexpected error occurred.',
                fallbackMessage: 'Communication line to the Brigadier is currently down.' 
            }, 
            { status: 500 }
        );
    }
}
