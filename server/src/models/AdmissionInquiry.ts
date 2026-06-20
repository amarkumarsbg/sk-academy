import { Schema, model } from "mongoose";

export interface IAdmissionInquiry {
  name: string;
  phone: string;
  email: string;
  grade: string;
  status: "new" | "read" | "resolved";
  notes?: string;
}

const admissionInquirySchema = new Schema<IAdmissionInquiry>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    grade: { type: String, required: true },
    status: { type: String, enum: ["new", "read", "resolved"], default: "new" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const AdmissionInquiry = model<IAdmissionInquiry>(
  "AdmissionInquiry",
  admissionInquirySchema
);
