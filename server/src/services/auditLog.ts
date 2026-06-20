import { AuditLog } from "../models/AuditLog.js";

export async function writeAuditLog(entry: {
  action: string;
  userId: string;
  userName: string;
  resource: string;
  summary: string;
}) {
  await AuditLog.create(entry).catch((err) => {
    console.error("Failed to write audit log:", err);
  });
}
