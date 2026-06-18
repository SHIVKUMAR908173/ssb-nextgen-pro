import { InterviewQuestionProvider } from "./interviewStateMachine.js";
import { RapidFireQuestion, InterviewStage } from "./types.js";

function q(id: string, question: string): RapidFireQuestion {
  return { id, question };
}

type StageBank = Record<Exclude<InterviewStage, "introduction" | "conclusion">, RapidFireQuestion[]>;

const STAGE_BANK: StageBank = {
  "ciq_1_education": [
    q("ciq-edu-1", "10th-grade to graduation: what were your marks like overall, and what drove the improvement?"),
    q("ciq-edu-2", "Which subject was toughest—exactly what strategy helped you turn it around?"),
    q("ciq-edu-3", "Name one teacher you learned a lot from; how did their teaching method change your approach?"),
    q("ciq-edu-4", "Tell me about one sports/extra-curricular commitment in school and what discipline it built."),
    q("ciq-edu-5", "If you had to redo one academic year, what would you change in your routine? (Be specific.)")
  ],
  "ciq_2_family_routine": [
    q("ciq-fam-1", "Describe your home environment—how do family expectations shape your routine?"),
    q("ciq-fam-2", "What do your parents do, and what values did you pick up from them? Give one example."),
    q("ciq-fam-3", "How do you manage responsibilities at home (daily/weekly)?"),
    q("ciq-fam-4", "How is pocket money usually spent, and what does that teach you about planning?"),
    q("ciq-fam-5", "Your relationship with neighbors/community—what role do you personally play? (One real incident.)")
  ],
  "ciq_3_hobbies_interests": [
    q("ciq-hob-1", "Which hobby gave you the most personal growth, and what responsibility did it teach you?"),
    q("ciq-hob-2", "Describe a time you helped organize something for others through your hobby."),
    q("ciq-hob-3", "Do you have an extracurricular role where you lead or coordinate? What was your exact contribution?"),
    q("ciq-hob-4", "What do you do when motivation drops—what is your system to restart?"),
    q("ciq-hob-5", "How do your hobbies reflect your temperament under pressure?")
  ],
  "ciq_4_general_awareness": [
    q("ciq-ga-1", "Pick one recent current-affairs topic you followed—why did you choose it and what did you learn?"),
    q("ciq-ga-2", "What is one key national value you admire, and how does it show in your life?"),
    q("ciq-ga-3", "Explain a technical concept you recently revised in simple terms (no jargon)."),
    q("ciq-ga-4", "When you encounter misinformation, how do you verify? Give your process."),
    q("ciq-ga-5", "What do you want to improve in your general knowledge within 30 days?")
  ],
  "ciq_5_self_assessment": [
    q("ciq-sa-1", "Rate your performance in the earlier assessments (Psychology/GTO) — what were your strongest moments?"),
    q("ciq-sa-2", "Where did you underperform—what was the reason (skill, mindset, or process) and what changed afterward?"),
    q("ciq-sa-3", "Tell me your top 5 strengths (as behaviors, not traits)."),
    q("ciq-sa-4", "Tell me your top 5 weaknesses (again, behaviors). How are you actively correcting them?"),
    q("ciq-sa-5", "What is one measurable improvement you will achieve in the next 30 days?")
  ],
  "ciq_6_defence_motivation": [
    q("ciq-def-1", "Why do you want to join the Armed Forces? Give a personal incident, not a textbook answer."),
    q("ciq-def-2", "Do you understand the discipline and hierarchy? Which value do you personally respect most and why?"),
    q("ciq-def-3", "In a unit, conflicts will happen. How do you handle disagreement respectfully but firmly?"),
    q("ciq-def-4", "If you were rejected this time, what would be your Plan B for self-improvement and service?"),
    q("ciq-def-5", "What does courage mean to you in day-to-day actions? One example.")
  ]
};

function stableFilterAndShuffle(params: { seed: number; alreadyAskedIds: Set<string>; bank: RapidFireQuestion[]; bundleSize: number }) {
  const { seed, alreadyAskedIds, bank, bundleSize } = params;
  const filtered = bank.filter((qq) => !alreadyAskedIds.has(qq.id));

  // Deterministic ordering: stable hash by id+seed, then slice.
  const ordered = filtered
    .map((qq) => ({
      qq,
      key: hashFor(qq.id, seed)
    }))
    .sort((a, b) => a.key - b.key)
    .map((x) => x.qq);

  return ordered.slice(0, bundleSize);
}

function hashFor(id: string, seed: number): number {
  let h = 2166136261 ^ seed;
  for (let i = 0; i < id.length; i += 1) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function createStaticQuestionProvider(): InterviewQuestionProvider {
  return {
    getIntroductionQuestions(): RapidFireQuestion[] {
      return [
        q("intro-1", "Stand up straight mentally—introduce yourself briefly and give one personal achievement you are proud of."),
        q("intro-2", "Why are you here for this interview? Give one concrete reason from your life."),
        q("intro-3", "What has been your biggest challenge so far, and how did you respond under pressure?")
      ];
    },

    getEducationQuestions(): RapidFireQuestion[] {
      // Back-compat: map to CIQ stage 1 education set (for older callers).
      return STAGE_BANK["ciq_1_education"].slice(0, 3);
    },

    getRapidFireBundleQuestions(seed: number, bundleSize: number, alreadyAskedIds: Set<string>): RapidFireQuestion[] {
      // Back-compat: bundle from education stage only.
      return stableFilterAndShuffle({
        seed,
        alreadyAskedIds,
        bank: STAGE_BANK["ciq_1_education"],
        bundleSize
      });
    },

    getFollowupQuestions(seed: number): RapidFireQuestion[] {
      return [
        q("fu-1", `Select ONE OLQ you believe you show strongly. Defend it with a short example (${seed % 2 === 0 ? "short and direct" : "clear sequence"}).`),
        q("fu-2", "When did you take responsibility for an outcome that was not fully your fault? Explain your action."),
        q("fu-3", "If selected, what will you do in the first 30 days to improve yourself and the team?")
      ];
    },

    // New stage-aware provider methods
    getCiqQuestionsStage(stage: Exclude<InterviewStage, "introduction" | "conclusion">, seed: number, alreadyAskedIds: Set<string>, bundleSize: number) {
      return stableFilterAndShuffle({
        seed,
        alreadyAskedIds,
        bank: STAGE_BANK[stage],
        bundleSize
      });
    }
  };
}
