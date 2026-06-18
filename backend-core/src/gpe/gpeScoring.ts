import type { GPESessionState } from "./types.js";
import type { InterviewEvaluation } from "../ai/types.js";

function clamp1to10(n: number) {
  return Math.max(1, Math.min(10, n));
}

function normalizeText(t: string) {
  return t.toLowerCase().replace(/\s+/g, " ").trim();
}

function includesAny(haystack: string, needles: string[]) {
  return needles.some((n) => haystack.includes(n));
}

type PriorityHit = {
  priority: 1 | 2 | 3 | 4;
  covered: boolean;
  orderRank?: number;
};

function priorityKeywords(priority: 1 | 2 | 3 | 4) {
  switch (priority) {
    case 1:
      return ["bleeding", "critically injured", "injured", "hospital", "medical", "triage", "save", "life", "immediate"];
    case 2:
      return ["catastrophe", "mass", "stampede", "bomb", "train", "fishplate", "hazard", "congestion", "major"];
    case 3:
      return ["robbery", "kidnapping", "theft", "criminal", "suspects", "agitation", "kidnap", "rob", "police"];
    case 4:
      return ["original task", "minor task", "fest", "college", "reach", "on time", "log", "communication", "organizers"];
    default:
      return [];
  }
}

function extractPriorityHits(planText: string, scenario: GPESessionState["scenario"]) {
  const normalized = normalizeText(planText);

  const priorities: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];

  const hits: PriorityHit[] = priorities.map((p) => {
    const keywords = priorityKeywords(p);
    const incidentLabels = scenario.incidents
      .filter((i) => i.priority === p)
      .map((i) => normalizeText(i.label));

    const covered = includesAny(normalized, keywords) || incidentLabels.some((lbl) => lbl.length >= 3 && normalized.includes(lbl));

    return { priority: p, covered };
  });

  const withOrder = hits.map((hit) => {
    if (!hit.covered) return hit;

    const idxs: number[] = [];
    const p = hit.priority;
    const keywords = priorityKeywords(p);

    for (const kw of keywords) {
      const idx = normalized.indexOf(kw.toLowerCase());
      if (idx >= 0) idxs.push(idx);
    }

    for (const inc of scenario.incidents.filter((i) => i.priority === p)) {
      const lbl = normalizeText(inc.label);
      const idx = normalized.indexOf(lbl);
      if (idx >= 0) idxs.push(idx);
    }

    const first = idxs.length ? Math.min(...idxs) : undefined;
    return { ...hit, orderRank: first === undefined ? undefined : first };
  });

  const orderedCovereds = withOrder
    .filter((h) => typeof h.orderRank === "number")
    .sort((a, b) => (a.orderRank as number) - (b.orderRank as number));

  const indexByPriority = new Map<PriorityHit["priority"], number>();
  orderedCovereds.forEach((h, idx) => indexByPriority.set(h.priority, idx));

  return withOrder.map((h) => {
    const rank = indexByPriority.get(h.priority);
    return rank === undefined ? h : { ...h, orderRank: rank };
  });
}

function scoreLogicalPrioritization(params: {
  hits: PriorityHit[];
  scenario: GPESessionState["scenario"];
}) {
  const { hits } = params;

  const coveredCount = hits.filter((h) => h.covered).length; // 0..4

  const orderRanks = hits
    .filter((h) => h.covered && typeof h.orderRank === "number")
    .map((h) => ({ priority: h.priority, rank: h.orderRank as number }));

  let orderMatchScore = 0;
  const allCovered = coveredCount === 4;
  if (orderRanks.length >= 2) {
    const idealRanks = [1, 2, 3, 4].map((p) => orderRanks.find((x) => x.priority === p));
    const ranksPresent = idealRanks.filter((x) => x !== undefined).map((x) => (x as { rank: number }).rank);

    const isIncreasing = ranksPresent.every((r, i, arr) => i === 0 || r >= arr[i - 1]);
    orderMatchScore = isIncreasing ? 1 : 0;

    if (allCovered && isIncreasing && orderRanks.length === 4) orderMatchScore = 2;
  }

  const coverageScore = coveredCount === 0 ? 1 : Math.round((coveredCount / 4) * 10);
  const orderBonus = orderMatchScore === 2 ? 3 : orderMatchScore === 1 ? 2 : 0;

  return clamp1to10(coverageScore + orderBonus);
}

type DistanceTimeClaim = {
  km: number;
  minutes: number;
  impliedKmH: number;
  exceedsKmHBy: number; // 0 if not exceeded
};

function extractDistanceTimeClaims(planText: string) {
  // MVP regex:
  // - distance: 1..10000 (allow decimals too)
  // - unit variants: km, kilometer(s)
  // - time: minutes or minute(s) OR minutes with "min"
  //
  // Examples matched:
  // "10 km in 5 minutes"
  // "5 kilometers in 30 min"
  const normalized = normalizeText(planText);

  // Capture groups: km, minutes
  const re = /(\d+(?:\.\d+)?)\s*(?:km|kilometers?|kms?)\s*(?:in|within)\s*(\d+(?:\.\d+)?)\s*(?:minutes?|mins?|min)/g;

  const claims: Array<DistanceTimeClaim & { _rawKm: number; _rawMinutes: number }> = [];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const match = re.exec(normalized);
    if (!match) break;

    const km = Number(match[1]);
    const minutes = Number(match[2]);
    if (!Number.isFinite(km) || !Number.isFinite(minutes) || km <= 0 || minutes <= 0) continue;

    const impliedKmH = (km / minutes) * 60;
    claims.push({
      km,
      minutes,
      impliedKmH,
      exceedsKmHBy: 0,
      _rawKm: km,
      _rawMinutes: minutes
    });
  }

  return claims;
}

function scoreFeasibilityFromClaims(params: { scenario: GPESessionState["scenario"]; planText: string }) {
  const { scenario, planText } = params;

  const claimsRaw = extractDistanceTimeClaims(planText);

  if (!claimsRaw.length) {
    // If no numeric claims, keep a neutral-ish score.
    return {
      score: 6,
      violations: [] as Array<{ km: number; minutes: number; impliedKmH: number; maxPlausibleKmH: number; message: string }>
    };
  }

  const maxPlausibleKmH = Math.max(scenario.speedConstants.walkKmH, scenario.speedConstants.jeepRoadKmH, scenario.speedConstants.boatFastKmH);

  const violations: Array<{ km: number; minutes: number; impliedKmH: number; maxPlausibleKmH: number; message: string }> = [];

  // Penalize each violating claim.
  // If implied speed is slightly above max, small penalty; far above => larger penalty.
  // Example: 2x above max should crush score.
  let penalty = 0;

  for (const c of claimsRaw) {
    const exceedsBy = Math.max(0, c.impliedKmH - maxPlausibleKmH);
    if (exceedsBy > 0) {
      violations.push({
        km: c.km,
        minutes: c.minutes,
        impliedKmH: c.impliedKmH,
        maxPlausibleKmH,
        message: `Claim implies ${c.impliedKmH.toFixed(1)} km/h but max plausible is ${maxPlausibleKmH} km/h`
      });

      const ratio = c.impliedKmH / maxPlausibleKmH; // >1
      // penalty grows roughly linearly with (ratio-1), but capped.
      penalty += Math.min(8, (ratio - 1) * 3);
    }
  }

  // Convert penalty to 1..10 score.
  const rawScore = 10 - penalty;

  return {
    score: clamp1to10(Math.round(rawScore)),
    violations
  };
}

export function evaluateGPESessionMock(params: {
  seed: number;
  session: GPESessionState;
}): InterviewEvaluation {
  const { seed, session } = params;

  const planText = session.capturedPlanText ?? "";
  const normalizedPlan = normalizeText(planText);

  const priorityHits = extractPriorityHits(planText, session.scenario);
  const logicalPrioritization = scoreLogicalPrioritization({ hits: priorityHits, scenario: session.scenario });

  const { score: timeDistanceFeasibility, violations } = scoreFeasibilityFromClaims({
    scenario: session.scenario,
    planText: normalizedPlan
  });

  const hasAnyCoverage = priorityHits.some((h) => h.covered);

  // Keep other factors deterministic but now grounded by feasibility.
  const socialAdjustment = clamp1to10(3 + (hasAnyCoverage ? 2 : 0) + ((seed % 3) - 1));
  const socialEffectiveness = clamp1to10(timeDistanceFeasibility + (hasAnyCoverage ? 1 : 0));
  const dynamicQualities = clamp1to10(4 + ((seed % 5) - 2));

  const olqScores = Array.from({ length: 15 }).map((_, i) => {
    // Bias toward logical prioritization + feasibility so output feels connected.
    const base = (logicalPrioritization + timeDistanceFeasibility) / 2; // 1..10
    const wobble = ((i + seed) % 3) - 1; // -1..+1
    const raw = Math.round((base / 10) * 8 + wobble);
    const score = clamp1to10(raw);

    return {
      olqId: `OLQ_${i + 1}`,
      olqName: `GPE Trait ${i + 1}`,
      score: score as InterviewEvaluation["olqScores"][number]["score"],
      justification: `Derived from GPE priority coverage + feasibility checks for scenario=${session.scenario.scenarioId}.`
    };
  });

  const recommendation: InterviewEvaluation["recommendation"] =
    logicalPrioritization >= 8 && timeDistanceFeasibility >= 6 ? "SSB_RECOMMEND" : logicalPrioritization >= 6 ? "MAYBE" : "NOT_RECOMMEND";

  const feasibilityMsg =
    violations.length === 0
      ? "No numeric distance/time feasibility claims detected."
      : `Found ${violations.length} implausible distance/time claim(s).`;

  return {
    recommendation,
    factorAggregation: {
      planningOrganizing: logicalPrioritization,
      socialAdjustment,
      socialEffectiveness,
      dynamicQualities
    },
    olqScores,
    overallJustification:
      `GPE scoring (MVP) completed. ` +
      `LogicalPrioritization=${logicalPrioritization}/10. ` +
      `TimeDistanceFeasibility=${timeDistanceFeasibility}/10. ` +
      `${feasibilityMsg} ` +
      `Priority hits: ${priorityHits.map((h) => `${h.priority}:${h.covered ? "Y" : "N"}`).join(", ")}. ` +
      `Recommendation=${recommendation}.`
  };
}
