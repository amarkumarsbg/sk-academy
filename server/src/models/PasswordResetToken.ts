import { Schema, model } from "mongoose";

export interface IPasswordResetToken {
  email: string;
  token: string;
  expiresAt: Date;
}

const passwordResetTokenSchema = new Schema<IPasswordResetToken>({
  email: { type: String, required: true, lowercase: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export const PasswordResetToken = model<IPasswordResetToken>(
  "PasswordResetToken",
  passwordResetTokenSchema
);
