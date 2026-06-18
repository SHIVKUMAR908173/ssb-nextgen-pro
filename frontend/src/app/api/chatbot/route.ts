import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/supabase/auth';

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

        // 3. API Gateway -> Forward to Python FastAPI Chatbot Engine
        const pythonApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 seconds for chat

        try {
            const pythonResponse = await fetch(`${pythonApiUrl}/api/v1/chatbot/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!pythonResponse.ok) {
                const errorText = await pythonResponse.text();
                throw new Error(`Python AI Engine Error: ${errorText}`);
            }

            const data = await pythonResponse.json();
            
            return NextResponse.json({ 
                status: 'success', 
                reply: data.reply 
            });

        } catch (fetchError: unknown) {
            clearTimeout(timeoutId);
            if ((fetchError as Error).name === 'AbortError') {
                throw new Error('The Brigadier is currently busy. Please try again later.');
            }
            throw fetchError;
        }

    } catch (error: unknown) {
        console.error("[CHATBOT_GATEWAY_ERROR]", error);
        return NextResponse.json(
            { 
                error: (error as Error).message || 'An unexpected error occurred.',
                fallbackMessage: 'Communication line to the Brigadier is currently down.' 
            }, 
            { status: 500 }
        );
    }
}
