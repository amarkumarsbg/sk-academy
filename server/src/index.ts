import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { connectDb } from "./config/db.js";
import { env, validateProductionEnv } from "./config/env.js";
import { warmUpEmailTransport } from "./services/email.js";
import { apiRouter } from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

async function main() {
  validateProductionEnv();
  await connectDb();
  void warmUpEmailTransport();

  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || env.allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(cookieParser());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.use("/uploads", express.static(path.resolve(env.uploadDir)));
  app.use("/api", apiRouter);

  app.get("/health", (_req, res) => {
    const dbReady = mongoose.connection.readyState === 1;
    if (!dbReady) {
      res.status(503).json({ status: "degraded", db: "disconnected" });
      return;
    }
    res.json({ status: "ok" });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(env.port, "0.0.0.0", () => {
    console.log(`API server running on port ${env.port}`);
    console.log(
      env.cloudinaryEnabled
        ? `Image storage: Cloudinary (${env.cloudinaryCloudName})`
        : "Image storage: local uploads folder"
    );
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
