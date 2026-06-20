import { Schema, model } from "mongoose";

export interface IExam {
  id: string;
  name: string;
  class: string;
  startDate: string;
  endDate: string;
  status: string;
}

const examSchema = new Schema<IExam>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    class: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status: { type: String, default: "Scheduled" },
  },
  { timestamps: true }
);

export const Exam = model<IExam>("Exam", examSchema);
