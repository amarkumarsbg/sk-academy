import { Schema, model } from "mongoose";

export interface IContactMessage {
  name: string;
  email: string;
  message: string;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const ContactMessage = model<IContactMessage>("ContactMessage", contactMessageSchema);
