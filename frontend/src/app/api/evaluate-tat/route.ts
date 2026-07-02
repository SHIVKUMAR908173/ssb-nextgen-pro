import { NextRequest, NextResponse } from 'next/server';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

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
    story_number: z.number(),
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

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { stories } = body;

        if (!stories || !Array.isArray(stories) || stories.length === 0) {
            return NextResponse.json({ error: 'No TAT stories provided.' }, { status: 400 });
        }

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

PRINCIPLE 4 — OLQ MAPPING FROM TAT:
Map: Courage (does hero face danger?), Initiative (does hero start the action?), Social Adaptability (does hero involve and lead others?), Sense of Responsibility (does hero think beyond self?), Determination (does hero persist despite setbacks?).

For EVERY story that fails the formula or shows red flags, you MUST provide:
1. Deep psychological interpretation of what it reveals.
2. A complete IDEAL story rewrite for the same described picture.
`;

        const result = streamObject({
            model: google('gemini-flash-latest'),
            system: systemInstruction,
            prompt: `Candidate's TAT Stories to evaluate:\n${JSON.stringify(stories, null, 2)}`,
            schema: tatEvaluationSchema,
            temperature: 0.4,
        });

        return result.toTextStreamResponse();
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
