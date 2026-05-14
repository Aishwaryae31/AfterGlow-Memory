import { Router } from "express";

import { authRouter } from "./auth.routes.js";
import { memoryRouter } from "./memory.routes.js";

export const apiRouter = Router();

apiRouter.get("/version", (_req, res) => {
  res.json({ name: "afterglow-api", version: "0.1.0" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/memories", memoryRouter);
