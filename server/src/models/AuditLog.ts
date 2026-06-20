import { Schema, model } from "mongoose";

export interface IAuditLog {
  action: string;
  userId: string;
  userName: string;
  resource: string;
  summary: string;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    resource: { type: String, required: true },
    summary: { type: String, required: true },
  },
  { timestamps: true }
);

export const AuditLog = model<IAuditLog>("AuditLog", auditLogSchema);
