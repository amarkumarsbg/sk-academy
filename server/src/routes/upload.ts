import fs from "fs";
import path from "path";
import { Router } from "express";
import multer from "multer";
import { authRequired } from "../middleware/auth.js";
import { env } from "../config/env.js";
import { uploadToCloudinary } from "../services/cloudinary.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const uploadPath = path.resolve(env.uploadDir);
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const memoryStorage = multer.memoryStorage();

const imageUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

const documentUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Only PDF or image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

async function persistFile(file: Express.Multer.File, folder: string, resourceType: "image" | "raw" = "image") {
  if (env.cloudinaryEnabled) {
    try {
      return await uploadToCloudinary(file.buffer, { folder, resourceType });
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      if (env.isProduction) {
        const detail = err instanceof Error ? err.message : "unknown error";
        throw new AppError(
          `Cloudinary upload failed (${detail}). Verify CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on the server.`,
          502
        );
      }
      console.warn("Using local uploads folder instead (development fallback).");
    }
  }

  const ext = path.extname(file.originalname) || (resourceType === "raw" ? ".pdf" : ".jpg");
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const dest = path.join(uploadPath, name);
  fs.writeFileSync(dest, file.buffer);
  return `/uploads/${name}`;
}

export const uploadRouter = Router();

uploadRouter.post(
  "/",
  authRequired,
  imageUpload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new AppError("No file uploaded", 400);
    try {
      const url = await persistFile(req.file, "images", "image");
      res.status(201).json({ url });
    } catch (err) {
      console.error("Image upload failed:", err);
      throw new AppError(
        err instanceof Error ? err.message : "Image upload failed. Check server storage settings.",
        500
      );
    }
  })
);

uploadRouter.post(
  "/document",
  authRequired,
  documentUpload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new AppError("No file uploaded", 400);
    const resourceType = req.file.mimetype === "application/pdf" ? "raw" : "image";
    const url = await persistFile(req.file, "documents", resourceType);
    res.status(201).json({ url });
  })
);
