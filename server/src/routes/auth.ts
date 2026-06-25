import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { User } from "../models/User.js";
import { PasswordResetToken } from "../models/PasswordResetToken.js";
import {
  authRequired,
  clearAuthCookie,
  requireRole,
  setAuthCookie,
  signToken,
} from "../middleware/auth.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendPasswordResetEmail } from "../services/email.js";
import { writeAuditLog } from "../services/auditLog.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const forgotSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
  role: z.enum(["admin", "staff"]).default("staff"),
});

export const authRouter = Router();

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new AppError("Invalid email or password", 401);

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError("Invalid email or password", 401);

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    setAuthCookie(res, token);
    res.json({
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    });
  })
);

authRouter.post(
  "/logout",
  asyncHandler(async (_req, res) => {
    clearAuthCookie(res);
    res.json({ success: true });
  })
);

authRouter.get(
  "/me",
  authRequired,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.userId).select("-passwordHash");
    if (!user) throw new AppError("User not found", 404);
    res.json({
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    });
  })
);

authRouter.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const { email } = forgotSchema.parse(req.body);
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      await PasswordResetToken.deleteMany({ email: user.email });
      await PasswordResetToken.create({
        email: user.email,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });
      const resetUrl = env.adminResetPasswordPath(token);
      await sendPasswordResetEmail(user.email, resetUrl);
    }

    res.json({ success: true, message: "If that email exists, a reset link was sent." });
  })
);

authRouter.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const { token, password } = resetSchema.parse(req.body);
    const record = await PasswordResetToken.findOne({ token });
    if (!record || record.expiresAt < new Date()) {
      throw new AppError("Invalid or expired reset link", 400);
    }

    const user = await User.findOne({ email: record.email });
    if (!user) throw new AppError("User not found", 404);

    user.passwordHash = await bcrypt.hash(password, 12);
    await user.save();
    await PasswordResetToken.deleteMany({ email: record.email });

    res.json({ success: true });
  })
);

export const usersRouter = Router();

usersRouter.use(authRequired, requireRole("admin"));

usersRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 }).lean();
    res.json(users);
  })
);

usersRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = createUserSchema.parse(req.body);
    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) throw new AppError("Email already in use", 409);

    const user = await User.create({
      email: data.email.toLowerCase(),
      name: data.name,
      role: data.role,
      passwordHash: await bcrypt.hash(data.password, 12),
    });

    await writeAuditLog({
      action: "create",
      userId: req.user!.userId,
      userName: req.user!.email,
      resource: "user",
      summary: `Created staff user ${user.email}`,
    });

    res.status(201).json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  })
);

usersRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    if (req.params.id === req.user!.userId) {
      throw new AppError("You cannot delete your own account", 400);
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new AppError("User not found", 404);

    await writeAuditLog({
      action: "delete",
      userId: req.user!.userId,
      userName: req.user!.email,
      resource: "user",
      summary: `Deleted user ${user.email}`,
    });

    res.json({ success: true });
  })
);
