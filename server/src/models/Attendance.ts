import { Schema, model } from "mongoose";

export interface IAttendance {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  status: "Present" | "Absent" | "Late";
}

const attendanceSchema = new Schema<IAttendance>(
  {
    id: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    class: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ["Present", "Absent", "Late"], required: true },
  },
  { timestamps: true }
);

attendanceSchema.index({ date: 1, class: 1, studentId: 1 }, { unique: true });

export const Attendance = model<IAttendance>("Attendance", attendanceSchema);
