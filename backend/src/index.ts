import "dotenv/config";
import cors from "cors";
import express from "express";

import { connectDatabase } from "./config/database.js";
import { errorHandler } from "./middleware/async-handler.js";
import { apiRouter } from "./routes/index.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

const allowedOrigins =
  process.env.CORS_ORIGIN?.split(",").map((o) => o.trim()).filter(Boolean) ??
  ["http://localhost:3000"];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "afterglow-api" });
});

app.use("/api", apiRouter);
app.use(errorHandler);

async function bootstrap() {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`Afterglow API listening on http://localhost:${port}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
