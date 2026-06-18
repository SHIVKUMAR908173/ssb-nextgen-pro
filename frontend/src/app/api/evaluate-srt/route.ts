import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/supabase/auth';

export async function POST(req: NextRequest) {
    try {
        // 1. Auth Check - Ensure only logged-in cadets can consume AI compute
        const user = await getServerUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized. Please log in to access AI evaluation.' }, { status: 401 });
        }

        // 2. Parse Request
        const body = await req.json();
        const { responses } = body;

        if (!responses || !Array.isArray(responses)) {
            return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
        }

        // 3. API Gateway -> Forward to Python FastAPI AI Engine
        const pythonApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        // Timeout promise to prevent hanging requests (e.g. if Python backend is offline)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 35000); // 35 seconds

        try {
            const pythonResponse = await fetch(`${pythonApiUrl}/api/v1/eval/srt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ responses }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!pythonResponse.ok) {
                const errorText = await pythonResponse.text();
                throw new Error(`Python AI Engine Error: ${errorText}`);
            }

            const data = await pythonResponse.json();
            
            // Save to Database
            try {
                // user is already fetched at the start of the function!
                const { createClient: createServerClient } = await import('@/lib/supabase/server');
                const supabaseServerClient = await createServerClient();
                await supabaseServerClient.from('psych_submissions').insert({
                    user_id: user.id,
                    scenario_id: null,
                    test_type: 'SRT',
                    content: { responses },
                    ai_feedback: JSON.stringify(data.evaluation)
                });
            } catch (dbError) {
                console.error('[evaluate-srt] DB Save Error:', dbError);
                // Don't fail the request if DB save fails
            }

            return NextResponse.json({ 
                status: 'success', 
                evaluation: data.evaluation 
            });

        } catch (fetchError: unknown) {
            clearTimeout(timeoutId);
            if ((fetchError as Error).name === 'AbortError') {
                throw new Error('AI Evaluation timed out. Please try again.');
            }
            throw fetchError;
        }

    } catch (error: unknown) {
        console.error("[SRT_EVAL_GATEWAY_ERROR]", error);
        return NextResponse.json(
            { 
                error: (error as Error).message || 'An unexpected error occurred during evaluation.',
                fallbackMessage: 'Evaluation currently unavailable. Please check back in 2 minutes.' 
            }, 
            { status: 500 }
        );
    }
}
