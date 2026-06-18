import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        
        // Use environment variable for backend URL, default to localhost:8000 for local dev
        const backendUrl = process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://localhost:8000';
        
        const response = await fetch(`${backendUrl}/api/evaluate-comprehensive-psych`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { status: 'error', error: errorData.detail || 'Backend evaluation failed' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: unknown) {
        console.error('Error proxying to comprehensive psych evaluation:', error);
        return NextResponse.json(
            { status: 'error', error: 'Internal server error during evaluation' },
            { status: 500 }
        );
    }
}
