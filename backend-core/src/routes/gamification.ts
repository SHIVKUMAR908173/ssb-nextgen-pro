import { Router, Request, Response } from "express";
import { createGamificationService } from "../platform/gamification.js";

export const gamificationRouter = Router();
export const gamificationService = createGamificationService();

gamificationRouter.get("/profile", async (req: Request, res: Response) => {
  try {
    const u = new URL(req.url, "http://localhost");
    const userId = u.searchParams.get("userId") || "test-user-1";
    const profile = gamificationService.getUser({ userId });
    res.status(200).json(profile);
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Unknown error" });
  }
});

gamificationRouter.post("/event", async (req: Request, res: Response) => {
  try {
    const { userId, type, taskKey } = req.body;
    const uid = userId || "test-user-1";
    if (!type) {
      res.status(400).json({ error: "Missing 'type'" });
      return;
    }
    let profile;
    if (type === "daily_login") {
      profile = gamificationService.applyDailyLogin({ userId: uid });
    } else if (type === "task_complete") {
      const xpDelta = 30; // Securely calculated on server
      profile = gamificationService.applyTaskCompletion({ userId: uid, taskKey, xpDelta });
    } else {
       res.status(400).json({ error: "Invalid type" });
       return;
    }
    res.status(200).json(profile);
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Unknown error" });
  }
});
