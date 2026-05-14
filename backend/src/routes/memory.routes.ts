import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import multer from "multer";

import * as memory from "../controllers/memory.controller.js";
import type { AuthedRequest } from "../middleware/auth.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 60 * 1024 * 1024 },
});

function asyncAuthHandler(
  fn: (req: AuthedRequest, res: Response) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    void fn(req as AuthedRequest, res).catch(next);
  };
}

export const memoryRouter = Router();

memoryRouter.use(requireAuth);

memoryRouter.get("/stats", asyncAuthHandler(memory.getStats));
memoryRouter.get("/on-this-day", asyncAuthHandler(memory.getOnThisDay));
memoryRouter.get("/insights", asyncAuthHandler(memory.getInsights));
memoryRouter.get("/streak", asyncAuthHandler(memory.getStreak));
memoryRouter.post("/text", asyncAuthHandler(memory.createTextMemory));
memoryRouter.post(
  "/",
  upload.single("file"),
  asyncAuthHandler(memory.createMemory),
);
memoryRouter.get("/", asyncAuthHandler(memory.listMemories));
memoryRouter.patch("/:id", asyncAuthHandler(memory.updateMemory));
memoryRouter.delete("/:id", asyncAuthHandler(memory.deleteMemory));
