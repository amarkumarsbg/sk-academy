import { Schema, model } from "mongoose";

export interface ITeacher {
  id: string;
  name: string;
  subject: string;
  classes: string;
  experience: string;
  phone: string;
  email: string;
  qualification: string;
  joiningDate: string;
}

const teacherSchema = new Schema<ITeacher>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
    classes: { type: String, required: true },
    experience: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    qualification: { type: String, default: "" },
    joiningDate: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Teacher = model<ITeacher>("Teacher", teacherSchema);
