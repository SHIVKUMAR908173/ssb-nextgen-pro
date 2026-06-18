import { evaluateMedicalPreScreen } from "../dist/medical/standards.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function run() {
  // Baseline: should be eligible (height, vision within standard, CP-II acceptable for flying/technical)
  const eligible = evaluateMedicalPreScreen({
    candidate: {
      sex: "male",
      region: "plains",
      heightCm: 180,
      hasSkinDisease: false,
      dentalHealthyPoints: 20,
      hasHistoryOfMentalBreakdown: false,
      hadAbdominalOrHerniaSurgeryWithinPastYear: false,
      mandatoryTests: {
        restingECGDone: true,
        abdominalUltrasoundDone: true,
        completeHaemogramDone: true
      },
      vision: { myopiaDioptres: -2.5, entryType: "standard" },
      colorPerception: { cpLevel: "cp-ii", roleCategory: "flying_technical" }
    }
  });

  assert(eligible.verdict === "eligible", `Expected eligible, got ${eligible.verdict}`);

  // Boundary myopia: standard allows down to -2.5, but rejects -2.6
  const rejectedStandard = evaluateMedicalPreScreen({
    candidate: {
      sex: "male",
      region: "plains",
      heightCm: 180,
      hasSkinDisease: false,
      dentalHealthyPoints: 20,
      hasHistoryOfMentalBreakdown: false,
      hadAbdominalOrHerniaSurgeryWithinPastYear: false,
      mandatoryTests: {
        restingECGDone: true,
        abdominalUltrasoundDone: true,
        completeHaemogramDone: true
      },
      vision: { myopiaDioptres: -2.6, entryType: "standard" },
      colorPerception: { cpLevel: "cp-ii", roleCategory: "flying_technical" }
    }
  });

  assert(rejectedStandard.verdict === "rejected", "Expected rejected for standard myopia -2.6");

  // TGC allows down to -3.5
  const tgcOk = evaluateMedicalPreScreen({
    candidate: {
      sex: "male",
      region: "plains",
      heightCm: 180,
      hasSkinDisease: false,
      dentalHealthyPoints: 20,
      hasHistoryOfMentalBreakdown: false,
      hadAbdominalOrHerniaSurgeryWithinPastYear: false,
      mandatoryTests: {
        restingECGDone: true,
        abdominalUltrasoundDone: true,
        completeHaemogramDone: true
      },
      vision: { myopiaDioptres: -3.5, entryType: "tgc" },
      colorPerception: { cpLevel: "cp-ii", roleCategory: "flying_technical" }
    }
  });

  assert(tgcOk.verdict === "eligible", `Expected eligible for TGC myopia -3.5, got ${tgcOk.verdict}`);

  const tgcBad = evaluateMedicalPreScreen({
    candidate: {
      sex: "male",
      region: "plains",
      heightCm: 180,
      hasSkinDisease: false,
      dentalHealthyPoints: 20,
      hasHistoryOfMentalBreakdown: false,
      hadAbdominalOrHerniaSurgeryWithinPastYear: false,
      mandatoryTests: {
        restingECGDone: true,
        abdominalUltrasoundDone: true,
        completeHaemogramDone: true
      },
      vision: { myopiaDioptres: -3.6, entryType: "tgc" },
      colorPerception: { cpLevel: "cp-ii", roleCategory: "flying_technical" }
    }
  });

  assert(tgcBad.verdict === "rejected", "Expected rejected for TGC myopia -3.6");

  // CP-II required for flying_technical, so CP-III should reject
  const cpBad = evaluateMedicalPreScreen({
    candidate: {
      sex: "male",
      region: "plains",
      heightCm: 180,
      hasSkinDisease: false,
      dentalHealthyPoints: 20,
      hasHistoryOfMentalBreakdown: false,
      hadAbdominalOrHerniaSurgeryWithinPastYear: false,
      mandatoryTests: {
        restingECGDone: true,
        abdominalUltrasoundDone: true,
        completeHaemogramDone: true
      },
      vision: { myopiaDioptres: -1.0, entryType: "standard" },
      colorPerception: { cpLevel: "cp-iii", roleCategory: "flying_technical" }
    }
  });

  assert(cpBad.verdict === "rejected", "Expected rejected for flying_technical with CP-III");

  return { ok: true };
}

run();
console.log("medical_smoke_test: ok");
