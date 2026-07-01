import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mocking the 84 AFPA GD Topics (Sample of 10 for demonstration)
export const LECTURETTE_TOPICS = [
  "FDI in Defence",
  "Emerging Multipolar World",
  "Artificial Intelligence in Warfare",
  "Women in Armed Forces",
  "Cyber Security Threats to India",
  "Privatization of Space Exploration (ISRO/SpaceX)",
  "Agneepath Scheme: Pros and Cons",
  "India's Foreign Policy in the Middle East",
  "Impact of Climate Change on National Security",
  "Digital Rupee & Economy"
];

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: 'Lecturette topic is required.' }, { status: 400 });
        }

        // Simulating a LangChain RAG Pipeline Retrieval Phase
        // In a full RAG, we would query Pinecone/Supabase pgvector here for existing documents on the topic
        const simulatedRetrievedContext = `Information regarding ${topic}: Provide structured introduction, 3 main body arguments (pros/cons), and a definitive conclusion suitable for a 3-minute SSB speech.`;

        const systemInstruction = `
You are an expert SSB GTO (Group Testing Officer). 
Your task is to generate highly structured, point-wise speech notes for a 3-minute Lecturette on the topic: "${topic}".

RAG Context retrieved: ${simulatedRetrievedContext}

Format the output strictly as a JSON object with this schema:
{
  "introduction": "Catchy hook and basic definition/background of the topic (30 seconds).",
  "bodyPoints": [
    "Point 1: Core argument or statistic.",
    "Point 2: Counter-argument or secondary aspect.",
    "Point 3: Impact on India or National Security."
  ],
  "conclusion": "A strong, decisive conclusion reflecting Officer Like Qualities (OLQ).",
  "timeDistribution": "Intro: 30s | Body: 2m | Conclusion: 30s"
}
DO NOT wrap the response in markdown blocks. Return ONLY the raw JSON string.
`;

        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
        
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: systemInstruction }] }],
            generationConfig: {
                temperature: 0.2, // Low temperature for factual RAG-like structure
                responseMimeType: "application/json",
            }
        });

        const responseText = result.response.text();
        const parsedData = JSON.parse(responseText);

        return NextResponse.json({
            status: 'success',
            topic,
            notes: parsedData
        });

    } catch (error: unknown) {
        console.error('Lecturette Gen error:', error);
        return NextResponse.json({ error: (error as Error).message || 'Internal server error.' }, { status: 500 });
    }
}
