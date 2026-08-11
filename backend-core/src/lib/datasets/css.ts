import { z } from "zod";

export type CSSQuestion = {
  id: string;
  /**
   * 1..70
   */
  index: number;

  /**
   * Battery domain (9 cognitive dimensions).
   */
  domain:
    | "map_memory"
    | "working_memory"
    | "selective_attention"
    | "auditory_discrimination"
    | "spatial_orientation"
    | "problem_solving"
    | "form_perception"
    | "perceptual_speed"
    | "reasoning";

  /**
   * Prompt shown to candidate.
   */
  prompt: string;

  /**
   * Deterministic options (MVP uses MCQ; real system may vary).
   */
  options: string[];

  correctOptionIndex: number; // 0-based
  timeLimitSeconds: number; // per-item under high pressure
};

export type CSSQuestionSet = {
  datasetId: "css_question_set";
  version: "0.1.0";
  batterySize: 70;
  questions: CSSQuestion[];
};

export const CSSQuestionSchema: z.ZodType<CSSQuestion> = z.object({
  id: z.string().min(1),
  index: z.number().int().min(1).max(70),
  domain: z.union([
    z.literal("map_memory"),
    z.literal("working_memory"),
    z.literal("selective_attention"),
    z.literal("auditory_discrimination"),
    z.literal("spatial_orientation"),
    z.literal("problem_solving"),
    z.literal("form_perception"),
    z.literal("perceptual_speed"),
    z.literal("reasoning")
  ]),
  prompt: z.string().min(1),
  options: z.array(z.string().min(1)).min(2).max(6),
  correctOptionIndex: z.number().int().min(0),
  timeLimitSeconds: z.number().finite().positive()
});

export const CSSQuestionSetSchema: z.ZodType<CSSQuestionSet> = z.object({
  datasetId: z.literal("css_question_set"),
  version: z.literal("0.1.0"),
  batterySize: z.literal(70),
  questions: z.array(CSSQuestionSchema).length(70)
});

function makeQuestion(params: { domain: CSSQuestion["domain"]; index: number }): CSSQuestion {
  const { domain, index } = params;

  const id = `css-q-${index.toString().padStart(2, "0")}`;

  // Time pressure: vary slightly but keep within plausible tight range.
  const timeLimitSeconds =
    domain === "perceptual_speed"
      ? 5 + (index % 3) // 5..7s
      : domain === "form_perception"
        ? 6 + (index % 3) // 6..8s
        : 8 + (index % 4); // 8..11s

  let prompt = "";
  let options: string[] = [];
  let correctOptionIndex = 0;

  const tpl = index % 3;

  switch (domain) {
    case "spatial_orientation":
      if (tpl === 0) {
        prompt = `[Spatial Orientation #${index}] Rotate a standard 3D cube 90 degrees clockwise around the Y-axis. Where does the original 'Top' face point now?`;
        options = ["East", "West", "North", "South"];
        correctOptionIndex = 0;
      } else if (tpl === 1) {
        prompt = `[Spatial Orientation #${index}] A fighter jet is heading North-East. It receives a command to execute a 90-degree right turn. What is its new heading?`;
        options = ["South-East", "North-West", "South-West", "East"];
        correctOptionIndex = 0;
      } else {
        prompt = `[Spatial Orientation #${index}] Stand facing South-West, turn 180 degrees, then make a 90-degree turn to your left. Which direction are you facing?`;
        options = ["South-East", "North-West", "North-East", "South-West"];
        correctOptionIndex = 0;
      }
      break;

    case "working_memory":
      if (tpl === 0) {
        prompt = `[Working Memory #${index}] Look at the code sequence: 7-F-9-K-2-B. What is the sum of the numerical digits in this sequence?`;
        options = ["16", "18", "15", "17"];
        correctOptionIndex = 1;
      } else if (tpl === 1) {
        prompt = `[Working Memory #${index}] Rearrange the letters 'R-A-M-T' to form a meaningful military combat vehicle. What is its first letter?`;
        options = ["T", "A", "M", "R"];
        correctOptionIndex = 0; // T (Tank)
      } else {
        prompt = `[Working Memory #${index}] Remember the following tactical asset order: [BUNKER, RADAR, ROCKET, TANK]. Which asset occupied the third position?`;
        options = ["ROCKET", "RADAR", "BUNKER", "TANK"];
        correctOptionIndex = 0;
      }
      break;

    case "problem_solving":
      if (tpl === 0) {
        prompt = `[Problem Solving #${index}] A military convoy travels at 60 km/h for 2.5 hours, then increases its speed to 80 km/h for 1.5 hours. What is the total distance covered?`;
        options = ["270 km", "250 km", "260 km", "280 km"];
        correctOptionIndex = 0; // 150 + 120 = 270
      } else if (tpl === 1) {
        prompt = `[Problem Solving #${index}] If 4 radio communication towers can scan a radius of 200 km in 10 minutes, how long will it take 8 identical towers working in parallel to scan the exact same area?`;
        options = ["5 minutes", "10 minutes", "15 minutes", "2.5 minutes"];
        correctOptionIndex = 0;
      } else {
        prompt = `[Problem Solving #${index}] A tactical outpost has enough rations to feed 12 soldiers for 15 days. If 3 soldiers are redeployed elsewhere, how many days will the rations last for the remaining squad?`;
        options = ["20 days", "18 days", "16 days", "22 days"];
        correctOptionIndex = 0; // (12 * 15) / 9 = 20
      }
      break;

    case "reasoning":
      if (tpl === 0) {
        prompt = `[Reasoning #${index}] Identify the logical continuation of this numerical sequence: 4, 9, 19, 39, 79, ...`;
        options = ["159", "149", "169", "158"];
        correctOptionIndex = 0; // x2 + 1
      } else if (tpl === 1) {
        prompt = `[Reasoning #${index}] If the word 'SOLDIER' is encoded as 'TOLDJES', how would the word 'BATTLE' be logically encoded in this scheme?`;
        options = ["CATTME", "CATTLES", "BATTLES", "CATTLF"];
        correctOptionIndex = 3; // +1 on first and last, rest same: B->C, E->F => CATTLF
      } else {
        prompt = `[Reasoning #${index}] Identify the next item in the visual progression matrix: [Circle, Semi-circle, Quarter-circle, ...]`;
        options = ["Eighth-circle", "Square", "Triangle", "Oval"];
        correctOptionIndex = 0;
      }
      break;

    case "perceptual_speed":
      if (tpl === 0) {
        prompt = `[Perceptual Speed #${index}] Which option matches the target code exactly: 'C00RD1NATE' (look closely at zeros and ones)?`;
        options = ["COORDINATE", "C00RD1NATE", "C00RDINATE", "COORD1NATE"];
        correctOptionIndex = 1;
      } else if (tpl === 1) {
        prompt = `[Perceptual Speed #${index}] Quickly identify the duplicate number sequence that matches the target '78945612' exactly:`;
        options = ["78945622", "78945612", "78945602", "78946612"];
        correctOptionIndex = 1;
      } else {
        prompt = `[Perceptual Speed #${index}] Identify the odd word out that does not belong to the same rank structure:`;
        options = ["Lieutenant", "Captain", "Major", "Admiral"];
        correctOptionIndex = 3; // Admiral is Navy, others are Army/Air Force ranks
      }
      break;

    case "selective_attention":
      if (tpl === 0) {
        prompt = `[Selective Attention #${index}] Quickly count the number of times the letter 'E' appears in the phrase: 'DEFENSIVE POSITION SECURED'`;
        options = ["5", "4", "6", "3"];
        correctOptionIndex = 0; // D[E]f[E]nsiv[E] Position S[E]cur[E]d => 5 E's
      } else if (tpl === 1) {
        prompt = `[Selective Attention #${index}] How many times does the target symbol '*' appear in the following sequence: '***#**##*#*#***'?`;
        options = ["9", "8", "10", "7"];
        correctOptionIndex = 0; // 3 + 2 + 1 + 3 = 9 stars
      } else {
        prompt = `[Selective Attention #${index}] Quickly count the number of times the letter 'N' appears in the term: 'RECONNAISSANCE PATROL'`;
        options = ["4", "3", "5", "2"];
        correctOptionIndex = 1; // reco[n][n]aissa[n]ce => 3 N's
      }
      break;

    case "form_perception":
      if (tpl === 0) {
        prompt = `[Form Perception #${index}] Which geometric visual fragment completes the symmetric outline of a military five-point star badge?`;
        options = ["Five-point chevron", "Four-point polygon", "Hexagonal mesh", "Circular ring"];
        correctOptionIndex = 0;
      } else if (tpl === 1) {
        prompt = `[Form Perception #${index}] Identify the odd map symbol out based on shape symmetry:`;
        options = ["A curved river contour", "A straight metalled road", "A perfectly circular radar dome", "A square ammo bunker icon"];
        correctOptionIndex = 0; // river is asymmetric
      } else {
        prompt = `[Form Perception #${index}] A symmetric pentagonal shield icon is cut in half vertically. How many vertices does one half have?`;
        options = ["4 vertices", "5 vertices", "3 vertices", "6 vertices"];
        correctOptionIndex = 0; // 5 -> split vertical down center creates 4 vertices
      }
      break;

    case "map_memory":
      if (tpl === 0) {
        prompt = `[Map Memory #${index}] A radar site is located at coordinate (3, 4) and an airstrip is at coordinate (6, 8). What is the straight-line grid distance between them?`;
        options = ["5 units", "7 units", "6 units", "8 units"];
        correctOptionIndex = 0; // sqrt((6-3)^2 + (8-4)^2) = 5
      } else if (tpl === 1) {
        prompt = `[Map Memory #${index}] In your tactical briefing, the base camp was located at North-East. Where is it relative to your current location?`;
        options = ["North-East", "South-West", "North-West", "South-East"];
        correctOptionIndex = 0;
      } else {
        prompt = `[Map Memory #${index}] A map icon represents a bridge. Which symbol stands for a water body underneath?`;
        options = ["Wavy blue lines", "Symmetric grid lines", "Dotted brown path", "Solid black outline"];
        correctOptionIndex = 0;
      }
      break;

    case "auditory_discrimination":
    default:
      if (tpl === 0) {
        prompt = `[Auditory Discrimination #${index}] A sonar frequency pitch increases by exactly one octave from 440 Hz (Standard A). What is its new frequency?`;
        options = ["880 Hz", "660 Hz", "550 Hz", "1100 Hz"];
        correctOptionIndex = 0; // 2x frequency
      } else if (tpl === 1) {
        prompt = `[Auditory Discrimination #${index}] Identify the correct sequence of sound bursts (dots and dashes) representing SOS in Morse code:`;
        options = ["... --- ...", "--- ... ---", "... ... ...", "--- --- ---"];
        correctOptionIndex = 0;
      } else {
        prompt = `[Auditory Discrimination #${index}] Sonar acoustic signals propagate through water. Which signal registers the fastest propagation speed?`;
        options = ["Both propagate at identical speed", "High-frequency sonar ping", "Low-frequency propeller rumble", "Sound does not propagate in water"];
        correctOptionIndex = 0; // Speed of sound in water is constant regardless of frequency
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

/**
 * CSS stub generator (70 items) with deterministic round-robin distribution across 9 domains.
 * Replace stems + correctness keys with the official 2026 CSS battery once available.
 */
export function buildCSSQuestionSetStub(): CSSQuestionSet {
  const domains: CSSQuestion["domain"][] = [
    "map_memory",
    "working_memory",
    "selective_attention",
    "auditory_discrimination",
    "spatial_orientation",
    "problem_solving",
    "form_perception",
    "perceptual_speed",
    "reasoning"
  ];

  const questions: CSSQuestion[] = [];
  for (let i = 1; i <= 70; i += 1) {
    const domain = domains[(i - 1) % domains.length];
    questions.push(makeQuestion({ domain, index: i }));
  }

  const out: CSSQuestionSet = {
    datasetId: "css_question_set",
    version: "0.1.0",
    batterySize: 70,
    questions
  };

  const check = CSSQuestionSetSchema.safeParse(out);
  if (!check.success) {
    throw new Error(`CSS question set stub failed schema validation: ${JSON.stringify(check.error.flatten())}`);
  }

  return out;
}
