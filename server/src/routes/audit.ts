import { Router } from "express";
import { AuditLog } from "../models/AuditLog.js";
import { authRequired, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const auditRouter = Router();

auditRouter.get(
  "/",
  authRequired,
  requireRole("admin"),
  asyncHandler(async (_req, res) => {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100).lean();
    res.json(logs);
  })
);
