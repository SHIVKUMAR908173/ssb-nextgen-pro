import { Router, Request, Response } from "express";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, normalize } from "node:path";

export const systemRouter = Router();

// HEALTH
systemRouter.get("/health", async (req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

// ASSETS (MVP)
systemRouter.get(/^\/assets\/(.*)/, async (req: Request, res: Response) => {
  const rel = req.url.replace(/^\/assets\//, "");
  const safeRel = normalize(rel).replace(/^(\.\.(\/|\\|$))+/, "");
  const assetsRoot = join(process.cwd(), "assets");
  const abs = join(assetsRoot, safeRel);

  if (!existsSync(abs)) {
    res.status(404).send("Not found");
    return;
  }
  try {
    const data = await readFile(abs);
    res.setHeader("Content-Type", "image/jpeg"); // naive, assumes all are jpg
    res.send(data);
  } catch {
    res.status(500).send("Error reading file");
  }
});
