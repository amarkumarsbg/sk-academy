import { Schema, model } from "mongoose";

export interface IResultSubject {
  subject: string;
  maxMarks: number;
  marks: number;
}

export interface IResult {
  id: string;
  examId: string;
  examName: string;
  studentId: string;
  studentName: string;
  class: string;
  subjects: IResultSubject[];
}

const resultSchema = new Schema<IResult>(
  {
    id: { type: String, required: true, unique: true },
    examId: { type: String, required: true },
    examName: { type: String, required: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    class: { type: String, required: true },
    subjects: [
      {
        subject: { type: String, required: true },
        maxMarks: { type: Number, required: true },
        marks: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Result = model<IResult>("Result", resultSchema);
