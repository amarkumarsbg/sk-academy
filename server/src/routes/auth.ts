import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User.js";
import { authRequired, clearAuthCookie, setAuthCookie, signToken } from "../middleware/auth.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
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
