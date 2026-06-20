import { Schema, model } from "mongoose";

export interface IContactMessage {
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "resolved";
  notes?: string;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read", "resolved"], default: "new" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ContactMessage = model<IContactMessage>("ContactMessage", contactMessageSchema);
