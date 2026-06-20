import { Schema, model } from "mongoose";
import type { UserRole } from "../middleware/auth.js";

export interface IUser {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["admin", "staff"], default: "staff" },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
