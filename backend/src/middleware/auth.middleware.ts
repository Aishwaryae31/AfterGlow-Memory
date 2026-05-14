import type { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../lib/jwt.js";

export type AuthedRequest = Request & {
  auth: { userId: string; email: string };
};

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const bearer =
    typeof header === "string" && header.startsWith("Bearer ")
      ? header.slice("Bearer ".length)
      : null;

  if (!bearer) {
    res.status(401).json({ message: "Missing access token." });
    return;
  }

  try {
    const payload = verifyAccessToken(bearer);
    (req as AuthedRequest).auth = { userId: payload.sub, email: payload.email };
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired access token." });
  }
}
