import { Router } from "express";
import { SiteContent } from "../models/SiteContent.js";
import { authRequired } from "../middleware/auth.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const siteContentRouter = Router();

siteContentRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const doc = await SiteContent.findOne({ key: "default" }).lean();
    if (!doc) throw new AppError("Site content not found. Run seed script.", 404);
    res.json(doc.content);
  })
);

siteContentRouter.put(
  "/",
  authRequired,
  asyncHandler(async (req, res) => {
    const doc = await SiteContent.findOneAndUpdate(
      { key: "default" },
      { content: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(doc.content);
  })
);
