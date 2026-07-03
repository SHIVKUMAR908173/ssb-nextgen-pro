import { NextRequest, NextResponse } from 'next/server';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import path from 'path';
import { promises as fs } from 'fs';

export const maxDuration = 60; // Allow longer execution if on Vercel Pro

const tatEvaluationSchema = z.object({
  chief_psychologist_verdict: z.string(),
  dominant_psychological_theme: z.string(),
  hero_pattern_analysis: z.string(),
  olq_projection: z.array(z.object({
    olq: z.string(),
    score: z.number(),
    story_evidence: z.string()
  })),
  story_evaluations: z.array(z.object({
    story_number: z.string(),
    candidate_story: z.string(),
    formula_compliance: z.string(),
    red_flags: z.array(z.string()),
    psychological_insight: z.string(),
    board_score: z.number(),
    ideal_story_rewrite: z.string()
  })),
  recurring_vulnerabilities: z.string(),
  tat_mastery_plan: z.string(),
  overall_tat_score: z.number()
});

interface TatResponsePayload {
  trigger: string;
  response: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { stories } = body;

        if (!stories || !Array.isArray(stories) || stories.length === 0) {
            return NextResponse.json({ error: 'No TAT stories provided.' }, { status: 400 });
        }

        // Load the enriched dataset for context
        const datasetPath = path.join(process.cwd(), 'src/data/tat_sample_stories.json');
        let enrichedData: any[] = [];
        try {
            const datasetRaw = await fs.readFile(datasetPath, 'utf8');
            enrichedData = JSON.parse(datasetRaw);
        } catch (e) {
            console.error("Failed to load TAT enriched data", e);
        }

        // Prepare context mapping
        const evaluationContext = stories.map((r: TatResponsePayload, index: number) => {
            // Map slide 1 to 11 to the enriched data, slide 12 is blank.
            const enriched = enrichedData[index];
            return {
                story_trigger: r.trigger,
                candidate_story: r.response,
                image_description: enriched?.image_description || (r.trigger === 'Blank Slide' ? 'Blank slide - Candidate must imagine their own scene' : 'Unknown'),
                target_themes: enriched?.themes || [],
                target_olqs: enriched?.olq_mapping || [],
                ideal_story_structure: enriched?.story_structure || null,
                ideal_sample_story: enriched?.sample_story || null
            };
        });

        const systemInstruction = `
You are the CHIEF PSYCHOLOGIST at the Services Selection Board (SSB), specializing in projective psychology and Thematic Apperception Test analysis. You have a deep command of Murray's TAT theory and its application in officer selection. You have personally scored thousands of TAT stories and know EXACTLY what separates a recommended narrative from a returned one.

YOUR TAT EVALUATION FRAMEWORK:

PRINCIPLE 1 — THE SSB TAT FORMULA:
Every ideal TAT story MUST follow this structure:
  • SITUATION: Describe what's happening in the picture (set the scene)
  • CHARACTER: Who is the hero? What are they feeling/thinking?
  • ACTION: What does the hero DO? (MUST be positive, proactive, concrete action)
  • OUTCOME: What is the result? (MUST be positive/constructive)
The hero MUST solve the problem. The hero MUST be the agent of change.

PRINCIPLE 2 — PSYCHOLOGICAL PROJECTION ANALYSIS:
The stories are projections of the candidate's SUBCONSCIOUS MIND. Analyze:
  - What does the hero's choices reveal about the candidate's own values?
  - Is the hero passive (waits for help) or active (takes initiative)?
  - Is conflict resolution internal (emotional struggle) or external (action-taking)?
  - Are outcomes positive, ambiguous, or negative? (Negative outcomes = RED FLAG)
  - Does the candidate project leadership, social responsibility, and courage?

PRINCIPLE 3 — CRITICAL RED FLAGS:
Automatically flag: Death/injury of hero, criminal behavior, romantic obsession, victimhood narrative, submission to authority without taking own initiative, pessimistic endings, hero who gives up.

PRINCIPLE 4 — ENRICHED CONTEXT ALIGNMENT:
Evaluate the candidate's story strictly against the provided target themes and OLQs. The candidate's response should hit the target themes for that specific image description. Use the provided ideal_story_structure and ideal_sample_story to guide your ideal_story_rewrite feedback.

For EVERY story that fails the formula or shows red flags, you MUST provide:
1. Deep psychological interpretation of what it reveals.
2. A complete IDEAL story rewrite based on the ideal_story_structure for that image.
`;

        const result = streamObject({
            model: google('gemini-flash-latest'),
            system: systemInstruction,
            prompt: `Candidate's TAT Stories with associated image context to evaluate:\n${JSON.stringify(evaluationContext, null, 2)}`,
            schema: tatEvaluationSchema,
            temperature: 0.4,
        });

        return result.toTextStreamResponse();
    } catch (error: any) {
        console.error("[EVALUATE_TAT_ERROR]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
