import mongoose, { Schema, model } from "mongoose";

export interface IStudent {
  id: string;
  name: string;
  class: string;
  rollNo: string;
  status: string;
  parent: string;
  parentPhone?: string;
  parentEmail?: string;
  photo?: string;
}

const studentSchema = new Schema<IStudent>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    class: { type: String, required: true },
    rollNo: { type: String, required: true },
    status: { type: String, default: "Active", enum: ["Active", "Inactive", "Graduated"] },
    parent: { type: String, default: "" },
    parentPhone: { type: String, default: "" },
    parentEmail: { type: String, default: "" },
    photo: { type: String, default: "" },
  },
  { timestamps: true }
);

studentSchema.index({ status: 1 });

function generateNextStudentId(existingIds: string[]): string {
  const numbers = existingIds
    .map((id) => {
      const match = id.match(/^STU(\d{1,4})$/i);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((n): n is number => n !== null && n < 10000);
  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  return `STU${String(next).padStart(3, "0")}`;
}

studentSchema.pre("save", async function () {
  if (this.isNew && (!this.id || !/^STU\d{1,4}$/i.test(this.id))) {
    const docs = await mongoose.model<IStudent>("Student").find().select("id").lean();
    this.id = generateNextStudentId(docs.map((d) => d.id));
  }
});

export const Student = model<IStudent>("Student", studentSchema);
