import { existsSync, mkdirSync, readdirSync, copyFileSync, statSync, writeFileSync } from "node:fs";
import { join, extname, basename } from "node:path";

type Manifest = {
  datasetId: "ppdt_assets_manifest" | "tat_assets_manifest";
  version: "0.1.0";
  items: Array<{
    id: string;
    imagePath: string;
    imageSet?: string;
  }>;
};

const imageExts = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

function ensureDir(path: string) {
  mkdirSync(path, { recursive: true });
}

function isFile(p: string) {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
}

function listImages(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const entries = readdirSync(dir);
  const paths = entries
    .map((f) => join(dir, f))
    .filter((p) => isFile(p))
    .filter((p) => imageExts.has(extname(p).toLowerCase()));
  // Sort for deterministic IDs
  paths.sort((a, b) => a.localeCompare(b));
  return paths;
}

function inferIdFromFilename(filename: string, prefix: "ppdt" | "tat", fallbackIndex: number): string {
  // Accept:
  //  - ppdt-0001.jpg -> ppdt-0001
  //  - tat_01.png -> tat-0001
  //  - 0001.jpg (fallback) -> tat-0001
  const name = basename(filename, extname(filename));
  const normalized = name.replace(/_/g, "-").toLowerCase();

  const m = normalized.match(new RegExp(`^${prefix}-(\\d+)$`));
  if (m) return `${prefix}-${m[1]}`;

  const m2 = normalized.match(new RegExp("^(\\d+)$"));
  if (m2) return `${prefix}-${m2[1]}`;

  // Last resort: sequential
  const n = String(fallbackIndex).padStart(4, "0");
  return `${prefix}-${n}`;
}

function buildManifest(params: {
  datasetId: Manifest["datasetId"];
  prefix: "ppdt" | "tat";
  inputDir: string;
  assetsDir: string;
  sourceTag?: string;
}): Manifest {
  const { datasetId, prefix, inputDir, assetsDir, sourceTag } = params;

  const images = listImages(inputDir);
  const outDir = assetsDir;
  ensureDir(outDir);

  const items: Manifest["items"] = [];

  for (let i = 0; i < images.length; i += 1) {
    const imgPath = images[i];
    const fileName = basename(imgPath);
    const ext = extname(fileName).toLowerCase();
    const id = inferIdFromFilename(fileName, prefix, i + 1);

    // Normalize stored filenames to: <prefix>-NNNN.<ext>
    const storedFileName = `${id}.${ext.replace(".", "")}`; // fix: ext already includes dot
    // Above line is wrong (double dots). We'll compute properly below.
  }

  // Re-run with correct naming (keep logic clear).
  for (let i = 0; i < images.length; i += 1) {
    const imgPath = images[i];
    const fileName = basename(imgPath);
    const ext = extname(fileName).toLowerCase();
    const id = inferIdFromFilename(fileName, prefix, i + 1);

    const storedFileName = `${id}${ext}`;
    const destAbs = join(outDir, storedFileName);
    const destRel = join("assets", prefix, storedFileName).replace(/\\/g, "/");

    // Copy file (overwrite if re-run)
    copyFileSync(imgPath, destAbs);

    items.push({
      id,
      imagePath: destRel,
      imageSet: sourceTag
    });
  }

  return {
    datasetId,
    version: "0.1.0",
    items
  };
}

export function main() {
  const repoRoot = process.cwd();

  const inputRoot = join(repoRoot, "input");
  const assetsRoot = join(repoRoot, "assets");
  const outDir = join(repoRoot, "dist-output");
  ensureDir(outDir);

  const ppdtInput = join(inputRoot, "ppdt");
  const tatInput = join(inputRoot, "tat");

  const ppdtAssetsDir = join(assetsRoot, "ppdt");
  const tatAssetsDir = join(assetsRoot, "tat");

  const ppdtManifest = buildManifest({
    datasetId: "ppdt_assets_manifest",
    prefix: "ppdt",
    inputDir: ppdtInput,
    assetsDir: ppdtAssetsDir,
    sourceTag: "local-input-folder"
  });

  const tatManifest = buildManifest({
    datasetId: "tat_assets_manifest",
    prefix: "tat",
    inputDir: tatInput,
    assetsDir: tatAssetsDir,
    sourceTag: "local-input-folder"
  });

  const ppdtOutPath = join(outDir, "ppdt_assets_manifest.json");
  const tatOutPath = join(outDir, "tat_assets_manifest.json");

  writeFileSync(ppdtOutPath, JSON.stringify(ppdtManifest, null, 2), "utf-8");
  writeFileSync(tatOutPath, JSON.stringify(tatManifest, null, 2), "utf-8");

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ ppdt: ppdtOutPath, tat: tatOutPath }, null, 2));
}

main();
