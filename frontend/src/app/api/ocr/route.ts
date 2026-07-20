import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerUser } from '@/lib/supabase/auth';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ success: false, error: 'GEMINI_API_KEY is not configured.' }, { status: 500 });
  }

  try {
    const { imageBase64, words } = await req.json();
    
    if (!imageBase64 || !words || !Array.isArray(words)) {
      return NextResponse.json({ success: false, error: 'Missing imageBase64 or words array.' }, { status: 400 });
    }

    // Extract mime type and base64 string
    const match = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ success: false, error: 'Invalid imageBase64 format.' }, { status: 400 });
    }
    
    const mimeType = match[1];
    const base64Data = match[2];

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    
    const prompt = `You are an expert handwriting transcriber. 
I have uploaded an image of a candidate's answer sheet for a Word Association Test.
The candidate was shown these exact stimulus words in this specific order: ${JSON.stringify(words)}.
They wrote down a sentence for each word.
Please carefully transcribe their handwritten sentences. 
Align your transcription with the provided words array.
Return a strict JSON array where each object has two keys: "word" (the stimulus word from the array) and "response" (the transcribed handwritten sentence).
If a sentence is completely illegible or missing for a particular word, put "[SKIPPED]" as the response.
Do NOT include markdown formatting like \`\`\`json in the response, output ONLY the raw JSON array.`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      },
      prompt
    ]);

    const text = result.response.text();
    // Clean potential markdown blocks
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanText);

    return NextResponse.json({ success: true, parsed });

  } catch (err: unknown) {
    console.error('OCR Error:', err);
    return NextResponse.json({ success: false, error: (err as Error).message || 'Failed to process OCR' }, { status: 500 });
  }
}
