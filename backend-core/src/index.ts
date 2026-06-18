import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { buildTATAssetManifestStub, buildTATDatasetStub } from "./lib/datasets/tat.js";
import { buildWATDatasetStub } from "./lib/datasets/wat.js";
import { buildSRTDatasetStub } from "./lib/datasets/srt.js";
import { buildSDTDatasetStub } from "./lib/datasets/sdt.js";
import { buildInterviewDatasetStub } from "./lib/datasets/interview.js";
import { buildOLQRubricStub } from "./lib/datasets/olq.js";
import { buildPPDTAssetManifestStub, buildPPDTDatasetStub } from "./lib/datasets/ppdt.js";
import { buildDefencePrepResourcesDatasetStub } from "./lib/datasets/defencePrepResources.js";

import { runDeterministicMockInterviewSession } from "./ai/runSession.js";
import { CandidateInput, InterviewRunConfig } from "./ai/types.js";

const OutputRootSchema = z.object({
  meta: z.object({
    datasetId: z.string(),
    version: z.string(),
    generatedAtIso: z.string().datetime(),
    sourceNotes: z.array(z.string())
  }),
  datasets: z.object({
    tat: z.array(z.unknown()),
    ppdt: z.array(z.unknown()),
    tatAssetManifest: z.array(z.unknown()),
    ppdtAssetManifest: z.array(z.unknown()),
    wat: z.array(z.unknown()),
    srt: z.array(z.unknown()),
    sdt: z.array(z.unknown()),
    interview: z.array(z.unknown()),
    olqRubric: z.array(z.unknown()),
    defencePrepResources: z.array(z.unknown())
  })
});

type OutputRoot = z.infer<typeof OutputRootSchema>;

function ensureDir(path: string) {
  mkdirSync(path, { recursive: true });
}

function main() {
  const mode = process.argv[2] ?? "datasets"; // "datasets" | "ai-mock-pi"
  if (mode === "ai-mock-pi") {
    const config: InterviewRunConfig = {
      sessionId: "session-mock-001",
      rapidFireBundleSize: 4,
      maxTurns: 6,
      seed: 42
    };

    const candidate: CandidateInput = {
      answersByQuestionId: {
        "intro-1": "I enjoy teamwork and I achieved a top percentile rank by staying consistent.",
        "intro-2": "I chose this field because it matched my curiosity and long-term goals.",
        "intro-3": "The biggest challenge was exam stress; I learned time management and stayed calm.",

        "edu-1": "My performance improved steadily after changing my revision strategy.",
        "edu-2": "Math was tough; I practiced daily and worked through fundamentals.",
        "edu-3": "I kept working through slow results by tracking progress weekly.",

        "ciq-1": "My strengths were consistency; what held me back was occasional overthinking.",
        "ciq-2": "My favorite subject was science because it connected concepts to real life.",
        "ciq-3": "A difficult teacher gave feedback late; I corrected early using additional notes.",
        "ciq-4": "I led a small group by assigning tasks and ensuring deadlines were met.",
        "ciq-5": "I followed punctuality rules even when it was inconvenient.",
        "ciq-6": "I owned a failure when I missed a plan; after that I reviewed and improved.",
        "ciq-7": "I handle pressure by making a quick priority list and executing in sequence.",
        "ciq-8": "When my plan fails, I re-evaluate assumptions and adjust without blaming.",
        "ciq-9": "I admired discipline in peers and applied it to my routine.",

        "fu-1": "I strongly show responsibility; an example is owning outcomes during group tasks.",
        "fu-2": "I took responsibility for a delayed submission by coordinating backups and reporting early.",
        "fu-3": "In 30 days I will improve discipline and mentor my peers to work systematically."
      }
    };

    const out = runDeterministicMockInterviewSession({ config, candidate });
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(out.evaluation, null, 2));
    return;
  }

  const outputRoot: OutputRoot = {
    meta: {
      datasetId: "ssb-platform-datasets",
      version: "0.1.0",
      generatedAtIso: new Date().toISOString(),
      sourceNotes: [
        "This project ships dataset transformation/export stubs (no external downloads).",
        "Wire your own ingestion code to replace stubs with real source data."
      ]
    },
    datasets: {
      tat: buildTATDatasetStub(),
      ppdt: buildPPDTDatasetStub(),
      tatAssetManifest: [buildTATAssetManifestStub()],
      ppdtAssetManifest: [buildPPDTAssetManifestStub()],
      wat: buildWATDatasetStub(),
      srt: buildSRTDatasetStub(),
      sdt: buildSDTDatasetStub(),
      interview: buildInterviewDatasetStub(),
      olqRubric: buildOLQRubricStub(),
      defencePrepResources: [buildDefencePrepResourcesDatasetStub()]
    }
  };

  const schemaCheck = OutputRootSchema.safeParse(outputRoot);
  if (!schemaCheck.success) {
    // keep errors readable
    // eslint-disable-next-line no-console
    console.error(JSON.stringify(schemaCheck.error.flatten(), null, 2));
    process.exit(1);
  }

  const outDir = join(process.cwd(), "dist-output");
  ensureDir(outDir);

  const outPath = join(outDir, "ssb-datasets.json");
  writeFileSync(outPath, JSON.stringify(outputRoot, null, 2), "utf-8");

  // eslint-disable-next-line no-console
  console.log(`Wrote dataset JSON: ${outPath}`);
}

main();
