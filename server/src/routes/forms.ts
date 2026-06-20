import { Router } from "express";
import { z } from "zod";
import { ContactMessage } from "../models/ContactMessage.js";
import { AdmissionInquiry } from "../models/AdmissionInquiry.js";
import { authRequired } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
});

const inquirySchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(10),
  email: z.string().email(),
  grade: z.string().min(1),
});

export const formsRouter = Router();

formsRouter.post(
  "/contact",
  asyncHandler(async (req, res) => {
    const data = contactSchema.parse(req.body);
    const message = await ContactMessage.create(data);
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

formsRouter.post(
  "/admission-inquiries",
  asyncHandler(async (req, res) => {
    const data = inquirySchema.parse(req.body);
    const inquiry = await AdmissionInquiry.create(data);
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
