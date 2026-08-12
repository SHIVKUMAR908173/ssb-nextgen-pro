import { Router, Request, Response } from "express";
import { authService, SignUpInput, SignInInput } from "../auth/index.js";

export const authRouter = Router();

authRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const body = req.body as SignUpInput;
    if (!body.email || !body.password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const session = await authService.signUp(body);
    res.status(200).json(session);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    const status = msg.includes("already exists") ? 409 : 400;
    res.status(status).json({ error: msg });
  }
});

authRouter.post("/signin", async (req: Request, res: Response) => {
  try {
    const body = req.body as SignInInput;
    if (!body.email || !body.password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const session = await authService.signIn(body);
    res.status(200).json(session);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    // Don't leak whether user exists or password was wrong
    res.status(401).json({ error: msg });
  }
});
