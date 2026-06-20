import { Schema, model } from "mongoose";

export interface IFeeRecord {
  id: string;
  student: string;
  class: string;
  amount: number;
  paid: number;
  due: number;
  status: string;
  paymentDate: string;
  paymentMode: string;
  transactionId: string;
}

const feeRecordSchema = new Schema<IFeeRecord>(
  {
    id: { type: String, required: true, unique: true },
    student: { type: String, required: true },
    class: { type: String, required: true },
    amount: { type: Number, required: true },
    paid: { type: Number, default: 0 },
    due: { type: Number, default: 0 },
    status: { type: String, default: "Pending" },
    paymentDate: { type: String, default: "" },
    paymentMode: { type: String, default: "" },
    transactionId: { type: String, default: "" },
  },
  { timestamps: true }
);

export const FeeRecord = model<IFeeRecord>("FeeRecord", feeRecordSchema);
