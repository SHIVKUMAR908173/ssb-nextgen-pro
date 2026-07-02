import { NextResponse } from 'next/server';
// Edge disabled for Langchain Node.js compat
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { createClient } from "@supabase/supabase-js";
import { getServerUser } from '@/lib/supabase/auth';
import { createClient as createServerClient } from '@/lib/supabase/server';

// ─── The 15 OLQs used as scoring rubric ──────────────────────────────────
const OLQ_RUBRIC = `
The 15 Officer Like Qualities (OLQs) evaluated at SSB:
1.  Effective Intelligence
2.  Reasoning Ability
3.  Organising Ability
4.  Power of Expression
5.  Social Adaptability
6.  Co-operation
7.  Sense of Responsibility
8.  Initiative
9.  Self Confidence
10. Speed of Decision
11. Ability to Influence the Group
12. Liveliness
13. Dominating Ability (appropriate, not domineering)
14. Courage
15. Stamina
`;

export async function POST(req: Request) {
    try {
        const reqBody = await req.json();
        const { testType, stimulus, response: candidateResponse, isSpoken } = reqBody;

        // ─── Semantic Search / RAG Execution ─────────────────────────────────
        let retrievedContext = '';
        try {
            if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
                const supabaseClient = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL,
                    process.env.SUPABASE_SERVICE_ROLE_KEY
                );

                const embeddings = new GoogleGenerativeAIEmbeddings({
                    model: "text-embedding-004",
                });

                const vectorStore = new SupabaseVectorStore(embeddings, {
                    client: supabaseClient,
                    tableName: "ssb_documents",
                    queryName: "match_ssb_documents",
                });

                // Pull the top 2 highly relevant chunks based on the stimulus 
                const results = await vectorStore.similaritySearch(stimulus, 2);
                retrievedContext = results.map((r: { pageContent: string }) => r.pageContent).join('\n\n');
            }
        } catch (e) {
            console.warn('[RAG Engine] Missing authentic materials context:', e);
        }

        // ─── Gemini 3.1 Pro Prompt Configuration ──────────────────────────────
        // Adapted instructions to heavily weight spoken delivery, power of expression, and confidence.
        const evalPrompt = `
You are a DIPR-certified SSB Psychologist evaluating a candidate's ${testType} response with 90-95% accuracy.
The candidate gave this response via ${isSpoken ? 'VOICE (speech-to-text transcript)' : 'TEXT'}.

${OLQ_RUBRIC}

AUTHENTIC SSB REFERENCE DATA (Use this dataset heavily to calibrate your 90-95% accuracy):
${retrievedContext || 'No referenced dataset available. Fallback to base knowledge.'}

STIMULUS (shown to candidate): "${stimulus || reqBody.context?.test || 'Assessment'}"
CANDIDATE'S RESPONSE (transcript): "${typeof reqBody.content !== 'undefined' ? JSON.stringify(reqBody.content) : candidateResponse}"

EVALUATION RULES:
1. Heavily weight 'Power of Expression' (OLQ 4) and 'Self-Confidence' (OLQ 9).
*** CRITICAL DIRECTIVE (Centurion & SSBPsych Methodology): Focus heavily on how naturally the candidate projects OLQs. Specifically penalize canned/memorized responses. Ensure your feedback is calibrated to the timed, high-pressure 30s/4m breakdown of the real SSB environment. ***
2. Analyze the script's fluidity, sentence structure, and vocabulary to determine vocal confidence.
3. Identify specific strengths and negative traits (red flags).
4. You MUST return a STRICT JSON object in exactly this format, with no markdown code blocks around it:
{
  "strengths": ["Strength 1 with evidence", "Strength 2..."],
  "redFlags": ["Red flag 1 with evidence", "Red flag 2..."],
  "confidenceScore": 85,
  "olqAnalysis": [
    { "olq": "Power of Expression", "score": 8, "note": "Clear articulation..." },
    { "olq": "Self Confidence", "score": 7, "note": "Hesitant start..." }
  ],
  "verdict": "Recommended / Not Yet Ready",
  "advice": "One hard-hitting line of advice."
}
`;

        const apiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: evalPrompt }] }],
                    generationConfig: {
                        temperature: 0.2,
                        responseMimeType: 'application/json'
                    }
                })
            }
        );

        if (!apiResponse.ok) {
            console.error('[psych-evaluate] Gemini API Error:', await apiResponse.text());
            throw new Error('Gemini API request failed.');
        }

        const data = await apiResponse.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
            throw new Error('No assessment text returned from AI.');
        }

        let parsedFeedback;
        try {
            parsedFeedback = JSON.parse(responseText);
        } catch {
            // Fallback if AI didn't stick to JSON
            parsedFeedback = { error: 'Failed to parse JSON response', raw: responseText };
        }

        // Save to Database
        try {
            const user = await getServerUser();
            if (user) {
                const supabaseServerClient = await createServerClient();
                // Ensure test_type matches the CHECK constraint ('TAT', 'WAT', 'SRT', 'SD')
                const parsedTestType = (testType || reqBody.type || 'SD').toUpperCase();
                const validTestTypes = ['TAT', 'WAT', 'SRT', 'SD'];
                const dbTestType = validTestTypes.includes(parsedTestType) ? parsedTestType : 'SD';
                
                // Content payload
                const contentPayload = reqBody.content ? reqBody.content : { stimulus, response: candidateResponse, isSpoken };
                const scenarioId = reqBody.scenario_id || null;

                await supabaseServerClient.from('psych_submissions').insert({
                    user_id: user.id,
                    scenario_id: scenarioId,
                    test_type: dbTestType,
                    content: contentPayload,
                    ai_feedback: JSON.stringify(parsedFeedback)
                });

                // --- Gamification Logic ---
                try {
                    const todayStr = new Date().toISOString().split('T')[0];
                    const { data: profile } = await supabaseServerClient
                        .from('user_profiles')
                        .select('xp, streak, last_active')
                        .eq('id', user.id)
                        .single();

                    let newXp = 50;
                    let newStreak = 1;

                    if (profile) {
                        newXp = (profile.xp || 0) + 50;
                        if (profile.last_active) {
                            // Compare using UTC strings to avoid timezone shift issues
                            const lastActive = profile.last_active.split('T')[0];
                            
                            if (lastActive === todayStr) {
                                newStreak = profile.streak || 1; // Same day, keep streak
                            } else {
                                const lastDate = new Date(lastActive);
                                const todayDate = new Date(todayStr);
                                const diffTime = todayDate.getTime() - lastDate.getTime();
                                const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
                                
                                if (diffDays === 1) {
                                    newStreak = (profile.streak || 0) + 1; // Consecutive day
                                } else {
                                    newStreak = 1; // Streak broken
                                }
                            }
                        }
                    }

                    await supabaseServerClient.from('user_profiles').upsert({
                        id: user.id,
                        xp: newXp,
                        streak: newStreak,
                        last_active: todayStr
                    });
                } catch (gamificationError) {
                    console.error('[psych-evaluate] Gamification Save Error:', gamificationError);
                }
            }
        } catch (dbError) {
            console.error('[psych-evaluate] DB Save Error:', dbError);
            // Don't fail the request if DB save fails
        }

        return NextResponse.json({ feedback: parsedFeedback, testType });
    } catch (error) {
        console.error('[psych-evaluate] Error:', error);
        return NextResponse.json({ error: 'OLQ evaluation failed.' }, { status: 500 });
    }
}
