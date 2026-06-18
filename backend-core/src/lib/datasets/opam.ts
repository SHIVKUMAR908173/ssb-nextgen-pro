import { z } from "zod";

export type OPAMDomain = "self_report_conduct" | "discipline" | "motivation" | "team_spirit";

/**
 * OPAM: self-report situations.
 * MVP: deterministic MCQ-style self-report with one correct option index for mock scoring.
 */
export type OPAMQuestion = {
  id: string;

  /**
   * 1..120
   */
  index: number;

  /**
   * Battery domain (approximation for UX + scoring buckets).
   */
  domain: OPAMDomain;

  /**
   * Prompt shown to candidate.
   */
  prompt: string;

  options: string[];

  /**
   * 0-based index
   */
  correctOptionIndex: number;

  /**
   * Per-item time pressure seconds (for UX; scoring is deterministic MVP).
   */
  timeLimitSeconds: number;
};

export type OPAMQuestionSet = {
  datasetId: "opam_question_set";
  version: "0.1.0";
  batterySize: 120;
  questions: OPAMQuestion[];
};

export const OPAMQuestionSchema: z.ZodType<OPAMQuestion> = z.object({
  id: z.string().min(1),
  index: z.number().int().min(1).max(120),
  domain: z.union([
    z.literal("self_report_conduct"),
    z.literal("discipline"),
    z.literal("motivation"),
    z.literal("team_spirit")
  ]),
  prompt: z.string().min(1),
  options: z.array(z.string().min(1)).min(2).max(6),
  correctOptionIndex: z.number().int().min(0),
  timeLimitSeconds: z.number().finite().positive()
});

export const OPAMQuestionSetSchema: z.ZodType<OPAMQuestionSet> = z.object({
  datasetId: z.literal("opam_question_set"),
  version: z.literal("0.1.0"),
  batterySize: z.literal(120),
  questions: z.array(OPAMQuestionSchema).length(120)
});

/**
 * Deterministic stub generator:
 * - 120 items distributed round-robin across OPAM domains
 * - deterministic correctness mapping
 * - plausible tight time limits for mock UX
 */
function makeQuestion(params: { domain: OPAMDomain; index: number }): OPAMQuestion {
  const { domain, index } = params;

  const id = `opam-q-${index.toString().padStart(3, "0")}`;
  const timeLimitSeconds = 8 + (index % 5); // 8..12s for high-pressure personality assessment

  let prompt = "";
  let options: string[] = [];
  let correctOptionIndex = 0; // Most desirable option under standard military psychology (OLQs)

  const tpl = index % 4;

  switch (domain) {
    case "self_report_conduct":
      if (tpl === 0) {
        prompt = `[Conduct #${index}] You notice a peer struggling with their tactical assignment during a high-stakes team training simulation. What is your response?`;
        options = [
          "Offer active assistance immediately after completing your own assigned task.",
          "Quietly report their struggle to the supervisor to ensure general training safety.",
          "Let them solve it themselves so they can build personal resilience.",
          "Request a task reassignment to work with faster, more efficient peers."
        ];
        correctOptionIndex = 0;
      } else if (tpl === 1) {
        prompt = `[Conduct #${index}] You accidentally damage a sensitive training communication module. No one else is present to witness it. What do you do?`;
        options = [
          "Immediately report the damage to the quartermaster and take full responsibility.",
          "Attempt to repair it quickly and quietly to avoid team embarrassment.",
          "Leave it as is and let the next cadet who uses it report the malfunction.",
          "Deny any involvement if questioned by instructors during the subsequent debrief."
        ];
        correctOptionIndex = 0;
      } else if (tpl === 2) {
        prompt = `[Conduct #${index}] A designated team leader makes a tactical planning decision that you strongly believe will cause the group mission to fail. How do you behave?`;
        options = [
          "Provide constructive feedback privately and offer a viable alternative strategy.",
          "Agree immediately without question to preserve organizational hierarchy and unity.",
          "Challenge the leader's planning openly in front of the entire squad.",
          "Perform your designated task silently but prepare your own fallback plan."
        ];
        correctOptionIndex = 0;
      } else {
        prompt = `[Conduct #${index}] During an arduous endurance march, a teammate drops their critical water canteen down a steep slope. You would:`;
        options = [
          "Share your own water canteen with them willingly for the remainder of the march.",
          "Advise them to double back and recover their canteen despite the pace.",
          "Continue marching to ensure you maintain your own personal targets.",
          "Inform the safety officer at the next checkpoint that your peer lacks water."
        ];
        correctOptionIndex = 0;
      }
      break;

    case "discipline":
      if (tpl === 0) {
        prompt = `[Discipline #${index}] The commanding officer issues an urgent training mobilization order that conflicts directly with your pre-planned personal leave. You would:`;
        options = [
          "Execute the mobilization order immediately and cancel your personal plans.",
          "Submit a formal request to delay your mobilization to accommodate your schedule.",
          "Ignore the order if it is not legally binding under the current peacetime status.",
          "Request a peer to take your place on the roster so you can proceed with your leave."
        ];
        correctOptionIndex = 0;
      } else if (tpl === 1) {
        prompt = `[Discipline #${index}] You arrive at a critical morning tactical briefing 5 minutes late due to an unavoidable, sudden transport delay. You would:`;
        options = [
          "Report your delay directly to the supervisor, offer a brief explanation, and accept the penalty.",
          "Slip into the back of the briefing room quietly to avoid disrupting the session.",
          "Formulate a highly convincing excuse to protect your record from bad markings.",
          "Discuss the poor transport system loudly with peers to shift the blame."
        ];
        correctOptionIndex = 0;
      } else if (tpl === 2) {
        prompt = `[Discipline #${index}] While standing guard duty during a quiet, uneventful night shift, you experience extreme drowsiness. How do you handle it?`;
        options = [
          "Perform light physical exercises and splash cold water on your face to remain alert.",
          "Rest your eyes for brief 2-minute intervals while leaning against the post.",
          "Request the guard commander for an immediate, early relief from your shift.",
          "Take a quick nap in the corner of the bunker since security risks are minimal."
        ];
        correctOptionIndex = 0;
      } else {
        prompt = `[Discipline #${index}] You are assigned a highly tedious and repetitive task checking equipment serial numbers in the base magazine. You would:`;
        options = [
          "Methodically inspect every single serial number to ensure absolute accuracy.",
          "Accelerate the checks by skipping random sections to save time for field drills.",
          "Delegate the task entirely to a junior cadet while you supervise.",
          "Report that the checks are complete without performing the actual counts."
        ];
        correctOptionIndex = 0;
      }
      break;

    case "motivation":
      if (tpl === 0) {
        prompt = `[Motivation #${index}] Your team fails to clear the mock obstacle course within the designated target time. What is your immediate reaction?`;
        options = [
          "Feel motivated to analyze the team's bottlenecks and organize extra practice runs.",
          "Accept that the course standards are unreasonably high for this stage.",
          "Express frustration openly to the slower members of your squad.",
          "Remain indifferent since mock scores do not affect the final selection."
        ];
        correctOptionIndex = 0;
      } else if (tpl === 1) {
        prompt = `[Motivation #${index}] You are assigned a highly specialized role in a command task that is completely outside your comfort zone. You would:`;
        options = [
          "Embrace the challenge enthusiastically as a critical opportunity to learn.",
          "Request a role change with a peer to ensure the team secures a better score.",
          "Perform the bare minimum requirements of the role to get through safely.",
          "Complain to the assessor about the lack of fair rotation for specialized tasks."
        ];
        correctOptionIndex = 0;
      } else if (tpl === 2) {
        prompt = `[Motivation #${index}] You are preparing for the final physical efficiency test, but your regular training partner cancels at the last minute. You:`;
        options = [
          "Train alone with the exact same high intensity, focus, and dedication.",
          "Postpone your training session and wait for them to return.",
          "Reduce your training load since you lack a partner to pace yourself against.",
          "Use the training hour to rest and read theoretical books instead."
        ];
        correctOptionIndex = 0;
      } else {
        prompt = `[Motivation #${index}] You receive constructive, yet highly critical feedback from a senior officer regarding your decision-making. You:`;
        options = [
          "Carefully dissect the criticism and formulate a structured improvement plan.",
          "Feel defensive and assume the officer is personally biased against you.",
          "Acknowledge it politely but continue using your own trusted methods.",
          "Worry excessively that this feedback has permanently ruined your selection odds."
        ];
        correctOptionIndex = 0;
      }
      break;

    case "team_spirit":
    default:
      if (tpl === 0) {
        prompt = `[Team Spirit #${index}] A heated personal conflict arises between two team members during a critical group planning exercise. You:`;
        options = [
          "Intervene calmly, mediate their differences, and refocus the group on the objective.",
          "Let them resolve their conflict independently as it does not affect your task.",
          "Support the team member whose opinion appears more popular in the group.",
          "Report their hostile behavior to the assessors to showcase your clean conduct."
        ];
        correctOptionIndex = 0;
      } else if (tpl === 1) {
        prompt = `[Team Spirit #${index}] Your squad wins a competitive tactical simulation, but a peer takes full public credit for a plan that you originally designed. You:`;
        options = [
          "Celebrate the group's collective victory and congratulate your peer.",
          "Confront the peer privately in an aggressive manner to demand an apology.",
          "Report the authorship of the plan to the training director to set it straight.",
          "Refuse to contribute any strategic ideas in future squad simulations."
        ];
        correctOptionIndex = 0;
      } else if (tpl === 2) {
        prompt = `[Team Spirit #${index}] A squad member is struggling to maintain the required pace during a heavy weighted group march. You would:`;
        options = [
          "Willingly help carry some of their gear to ensure the squad arrives intact.",
          "Urge them loudly to speed up so they do not lower the squad's average speed.",
          "Keep marching at your own optimal pace to set an excellent standard.",
          "Advise them to report sick and drop out of the march to avoid holding others back."
        ];
        correctOptionIndex = 0;
      } else {
        prompt = `[Team Spirit #${index}] The squad is stuck trying to solve a complex logical puzzle, and the testing deadline is rapidly approaching. You would:`;
        options = [
          "Encourage active, collaborative brainstorming and maintain squad morale.",
          "Take absolute control of the puzzle and order everyone to follow your steps.",
          "Give up on the puzzle since it seems mathematically unsolvable under pressure.",
          "Let the loudest and most confident squad member handle the puzzle alone."
        ];
        correctOptionIndex = 0;
      }
      break;
  }

  return {
    id,
    index,
    domain,
    prompt,
    options,
    correctOptionIndex,
    timeLimitSeconds
  };
}

export function buildOPAMQuestionSetStub(): OPAMQuestionSet {
  const domains: OPAMDomain[] = ["self_report_conduct", "discipline", "motivation", "team_spirit"];

  const questions: OPAMQuestion[] = [];
  for (let i = 1; i <= 120; i += 1) {
    const domain = domains[(i - 1) % domains.length];
    questions.push(makeQuestion({ domain, index: i }));
  }

  const out: OPAMQuestionSet = {
    datasetId: "opam_question_set",
    version: "0.1.0",
    batterySize: 120,
    questions
  };

  const check = OPAMQuestionSetSchema.safeParse(out);
  if (!check.success) {
    throw new Error(`OPAM question set stub failed schema validation: ${JSON.stringify(check.error.flatten())}`);
  }

  return out;
}
