import { Router } from "express";
import { z } from "zod";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { ContactMessage } from "../models/ContactMessage.js";
import { AdmissionInquiry } from "../models/AdmissionInquiry.js";
import { authRequired } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { verifyTurnstile } from "../utils/turnstile.js";
import { notifyNewAdmissionInquiry, notifyNewContactMessage } from "../services/email.js";
import { writeAuditLog } from "../services/auditLog.js";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  message: z.string().min(10),
  captchaToken: z.string().optional(),
});

const inquirySchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(10),
  email: z.string().email(),
  grade: z.string().min(1),
  captchaToken: z.string().optional(),
});

const statusSchema = z.object({
  status: z.enum(["new", "read", "resolved"]),
  notes: z.string().optional(),
});

export const formsRouter = Router();

formsRouter.post(
  "/contact",
  asyncHandler(async (req, res) => {
    const data = contactSchema.parse(req.body);
    await verifyTurnstile(data.captchaToken, req.ip);
    const message = await ContactMessage.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    });
    await notifyNewContactMessage({ name: data.name, email: data.email, phone: data.phone, message: data.message });
    res.status(201).json({ id: message._id, success: true });
  })
);

formsRouter.get(
  "/contact",
  authRequired,
  asyncHandler(async (_req, res) => {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    res.json(messages);
  })
);

formsRouter.patch(
  "/contact/:id",
  authRequired,
  asyncHandler(async (req, res) => {
    const data = statusSchema.parse(req.body);
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: data.status, ...(data.notes !== undefined ? { notes: data.notes } : {}) },
      { new: true }
    );
    if (!message) throw new AppError("Message not found", 404);
    await writeAuditLog({
      action: "update",
      userId: req.user!.userId,
      userName: req.user!.email,
      resource: "contact",
      summary: `Updated contact message ${req.params.id} to ${data.status}`,
    });
    res.json(message);
  })
);

formsRouter.post(
  "/admission-inquiries",
  asyncHandler(async (req, res) => {
    const data = inquirySchema.parse(req.body);
    await verifyTurnstile(data.captchaToken, req.ip);
    const inquiry = await AdmissionInquiry.create({
      name: data.name,
      phone: data.phone,
      email: data.email,
      grade: data.grade,
    });
    await notifyNewAdmissionInquiry({
      name: data.name,
      phone: data.phone,
      email: data.email,
      grade: data.grade,
    });
    res.status(201).json({ id: inquiry._id, success: true });
  })
);

formsRouter.get(
  "/admission-inquiries",
  authRequired,
  asyncHandler(async (_req, res) => {
    const inquiries = await AdmissionInquiry.find().sort({ createdAt: -1 }).lean();
    res.json(inquiries);
  })
);

formsRouter.patch(
  "/admission-inquiries/:id",
  authRequired,
  asyncHandler(async (req, res) => {
    const data = statusSchema.parse(req.body);
    const inquiry = await AdmissionInquiry.findByIdAndUpdate(
      req.params.id,
      { status: data.status, ...(data.notes !== undefined ? { notes: data.notes } : {}) },
      { new: true }
    );
    if (!inquiry) throw new AppError("Inquiry not found", 404);
    await writeAuditLog({
      action: "update",
      userId: req.user!.userId,
      userName: req.user!.email,
      resource: "admission-inquiry",
      summary: `Updated inquiry ${req.params.id} to ${data.status}`,
    });
    res.json(inquiry);
  })
);

formsRouter.get(
  "/inbox/counts",
  authRequired,
  asyncHandler(async (_req, res) => {
    const [contactNew, inquiryNew] = await Promise.all([
      ContactMessage.countDocuments({ status: "new" }),
      AdmissionInquiry.countDocuments({ status: "new" }),
    ]);
    res.json({ contactNew, inquiryNew, total: contactNew + inquiryNew });
  })
);
