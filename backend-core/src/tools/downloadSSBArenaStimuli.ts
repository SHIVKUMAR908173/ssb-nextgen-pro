import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync, writeFileSync } from "node:fs";
import { join, dirname, extname, basename } from "node:path";
import { request as httpsRequest } from "node:https";
import { request as httpRequest } from "node:http";

type StimulusKind = "tat" | "ppdt";

type DownloadPlanItem = {
  kind: StimulusKind;
  setNumber: number; // tat1..tat16 or ppdt1..ppdt16 (site has more "coming soon" pages)
  indexInSet: number; // picture index inside the set page (tat1.html has tatpics/tat1.jpg, etc.)
};

type Manifest = {
  datasetId: "ssbarena_tat_assets_manifest" | "ssbarena_ppdt_assets_manifest";
  source: "ssbarena.github.io";
  version: "0.1.0";
  items: Array<{
    id: string; // e.g. tat-0001 or ppdt-0001 (sequential in download order)
    imagePath: string; // relative path under assets/
    sourceUrl: string; // where it came from
    setNumber?: number;
    indexInSet?: number;
  }>;
};

const defaultPlan: DownloadPlanItem[] = [
  // TAT: tatpics/tat1.jpg ... tatpics/tat4.jpg are used on tat1.html; then continues per page.
  // Site shows "TAT 1..TAT 28" plus some coming soon. We'll download TAT 1..TAT 28 for now.
  // Each set page uses 12 pictures + 1 blank slide placeholder. The images for "blank slide" may not exist as a real file.
  // We'll attempt indexes 1..12, and skip the blank.
  ...Array.from({ length: 28 }, (_, i) => i + 1).flatMap((setNumber) =>
    Array.from({ length: 12 }, (_, j) => j + 1).map((indexInSet) => ({
      kind: "tat" as const,
      setNumber,
      indexInSet
    }))
  ),

  // PPDT: ppdtpics/ppdt1.jpg ... on ppdt1.html. We'll download PPDT 1..PPDT 28 similarly.
  ...Array.from({ length: 28 }, (_, i) => i + 1).flatMap((setNumber) =>
    Array.from({ length: 12 }, (_, j) => j + 1).map((indexInSet) => ({
      kind: "ppdt" as const,
      setNumber,
      indexInSet
    }))
  )
];

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

function joinUrlPath(base: string, path: string) {
  const trimmedBase = base.replace(/\/+$/, "");
  const trimmedPath = path.replace(/^\/+/, "");
  return `${trimmedBase}/${trimmedPath}`;
}

function httpGetToFile(url: string, destAbsPath: string): Promise<void> {
  const maxRedirects = 5;

  return new Promise((resolve, reject) => {
    const visited = new Set<string>();

    function attempt(currentUrl: string, redirectsLeft: number) {
      const urlObj = new URL(currentUrl);
      const requestFn = urlObj.protocol === "http:" ? httpRequest : httpsRequest;

      const req = requestFn(
        {
          protocol: urlObj.protocol,
          hostname: urlObj.hostname,
          port: urlObj.port,
          path: `${urlObj.pathname}${urlObj.search}`,
          headers: {
            "User-Agent": "ssb-stimulus-downloader/0.1"
          }
        },
        (resp) => {
          const statusCode = resp.statusCode ?? 0;

          // Follow redirects
          if (statusCode >= 300 && statusCode < 400 && resp.headers.location) {
            if (redirectsLeft <= 0) {
              reject(new Error(`Too many redirects while downloading: ${currentUrl}`));
              return;
            }
            const nextUrl = new URL(resp.headers.location, currentUrl).toString();
            if (visited.has(nextUrl)) {
              reject(new Error(`Redirect loop detected while downloading: ${nextUrl}`));
              return;
            }
            visited.add(nextUrl);
            resp.resume(); // discard any data
            attempt(nextUrl, redirectsLeft - 1);
            return;
          }

          if (!statusCode || statusCode < 200 || statusCode >= 300) {
            reject(new Error(`Download failed: ${statusCode} ${currentUrl}`));
            return;
          }

          ensureDir(dirname(destAbsPath));
          const chunks: Buffer[] = [];

          resp.on("data", (d) => chunks.push(Buffer.isBuffer(d) ? d : Buffer.from(d)));
          resp.on("end", () => {
            const buf = Buffer.concat(chunks);
            writeFileSync(destAbsPath, buf);
            resolve();
          });
        }
      );

      req.on("error", reject);
      req.end();
    }

    attempt(url, maxRedirects);
  });
}

function inferImageFilename(kind: StimulusKind, indexInSet: number) {
  // From the fetched pages:
  // - tatpics/tat1.jpg, tatpics/tat2.jpg, ...
  // - ppdtpics/ppdt1.jpg, ppdtpics/ppdt2.jpg, ...
  return `${kind === "tat" ? "tat" : "ppdt"}${indexInSet}.jpg`;
}

function makeImageUrl(kind: StimulusKind, indexInSet: number) {
  const fileName = inferImageFilename(kind, indexInSet);

  // IMPORTANT: use forward slashes; path.join() is OS-specific and breaks URLs on Windows.
  const rel = kind === "tat" ? `tatpics/${fileName}` : `ppdtpics/${fileName}`;

  return joinUrlPath(
    "https://github.com/ssbarena/ssbarena.github.io/raw/refs/heads/master",
    rel
  );
}

function makeDestinationPath(kind: StimulusKind, id: string, ext: string) {
  const assetsRelDir = join("assets", kind === "tat" ? "tat" : "ppdt");
  const fileName = `${id}.${ext.replace(".", "")}`;
  return { assetsRelDir, fileName };
}

function readArgInt(name: string): number | undefined {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return undefined;
  const v = process.argv[idx + 1];
  if (!v) return undefined;
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return Math.floor(n);
}

export async function main() {
  const repoRoot = process.cwd();

  // Where to write:
  // - downloaded images to assets/{tat|ppdt}/
  // - manifests into dist-output/
  const outDir = join(repoRoot, "dist-output");
  const baseOutAssetsDir = join(repoRoot, "assets");
  ensureDir(outDir);
  ensureDir(baseOutAssetsDir);

  const limit = readArgInt("--limit");
  const plan = limit ? defaultPlan.slice(0, limit) : defaultPlan;

  let tatCounter = 0;
  let ppdtCounter = 0;

  const tatManifest: Manifest = {
    datasetId: "ssbarena_tat_assets_manifest",
    source: "ssbarena.github.io",
    version: "0.1.0",
    items: []
  };

  const ppdtManifest: Manifest = {
    datasetId: "ssbarena_ppdt_assets_manifest",
    source: "ssbarena.github.io",
    version: "0.1.0",
    items: []
  };

  for (let i = 0; i < plan.length; i += 1) {
    const item = plan[i];
    const kind = item.kind;

    const imgUrl = makeImageUrl(kind, item.indexInSet);

    if (kind === "tat") {
      tatCounter += 1;
      const id = `tat-${String(tatCounter).padStart(4, "0")}`;
      const ext = ".jpg";
      const { assetsRelDir, fileName } = makeDestinationPath("tat", id, ext);

      const destAbs = join(repoRoot, assetsRelDir, fileName);
      const exists = isFile(destAbs);

      if (!exists) {
        // eslint-disable-next-line no-console
        console.log(`DL [${i + 1}/${plan.length}] ${imgUrl} -> ${destAbs}`);
        try {
          await httpGetToFile(imgUrl, destAbs);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(`WARN: could not download (${imgUrl}): ${e instanceof Error ? e.message : String(e)}`);
          continue;
        }
      } else {
        // eslint-disable-next-line no-console
        console.log(`SKIP (exists): ${destAbs}`);
      }

      tatManifest.items.push({
        id,
        imagePath: join("assets", "tat", fileName).replace(/\\/g, "/"),
        sourceUrl: imgUrl,
        setNumber: item.setNumber,
        indexInSet: item.indexInSet
      });
    } else {
      ppdtCounter += 1;
      const id = `ppdt-${String(ppdtCounter).padStart(4, "0")}`;
      const ext = ".jpg";
      const { assetsRelDir, fileName } = makeDestinationPath("ppdt", id, ext);

      const destAbs = join(repoRoot, assetsRelDir, fileName);
      const exists = isFile(destAbs);

      if (!exists) {
        // eslint-disable-next-line no-console
        console.log(`DL [${i + 1}/${plan.length}] ${imgUrl} -> ${destAbs}`);
        try {
          await httpGetToFile(imgUrl, destAbs);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(`WARN: could not download (${imgUrl}): ${e instanceof Error ? e.message : String(e)}`);
          continue;
        }
      } else {
        // eslint-disable-next-line no-console
        console.log(`SKIP (exists): ${destAbs}`);
      }

      ppdtManifest.items.push({
        id,
        imagePath: join("assets", "ppdt", fileName).replace(/\\/g, "/"),
        sourceUrl: imgUrl,
        setNumber: item.setNumber,
        indexInSet: item.indexInSet
      });
    }
  }

  const tatOutPath = join(outDir, "ssbarena_tat_assets_manifest.json");
  const ppdtOutPath = join(outDir, "ssbarena_ppdt_assets_manifest.json");

  writeFileSync(tatOutPath, JSON.stringify(tatManifest, null, 2), "utf-8");
  writeFileSync(ppdtOutPath, JSON.stringify(ppdtManifest, null, 2), "utf-8");

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        tatOutPath,
        ppdtOutPath,
        tatCount: tatManifest.items.length,
        ppdtCount: ppdtManifest.items.length
      },
      null,
      2
    )
  );
}

/**
 * CLI entrypoint.
 * We intentionally always run `main()` because this file is compiled to `dist/`
 * and the exact `import.meta.url` check can be brittle across build/run paths.
 */
main();
