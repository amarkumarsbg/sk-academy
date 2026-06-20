import { Schema, model } from "mongoose";

export interface IAdmissionApplication {
  id: string;
  applicant: string;
  grade: string;
  date: string;
  status: string;
  email?: string;
  phone?: string;
  parentName: string;
  previousSchool: string;
}

const admissionApplicationSchema = new Schema<IAdmissionApplication>(
  {
    id: { type: String, required: true, unique: true },
    applicant: { type: String, required: true },
    grade: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, default: "Pending" },
    email: { type: String },
    phone: { type: String },
    parentName: { type: String, default: "" },
    previousSchool: { type: String, default: "" },
  },
  { timestamps: true }
);

export const AdmissionApplication = model<IAdmissionApplication>(
  "AdmissionApplication",
  admissionApplicationSchema
);
