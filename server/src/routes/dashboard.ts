import { Router } from "express";
import { Student } from "../models/Student.js";
import { Teacher } from "../models/Teacher.js";
import { AdmissionApplication } from "../models/AdmissionApplication.js";
import { ContactMessage } from "../models/ContactMessage.js";
import { SiteContent } from "../models/SiteContent.js";
import { authRequired } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const dashboardRouter = Router();

dashboardRouter.get(
  "/",
  authRequired,
  asyncHandler(async (_req, res) => {
    const today = new Date().toISOString().slice(0, 10);

    const [
      studentStats,
      teacherCount,
      pendingAdmissions,
      contactNew,
      contactTotal,
      contactMessages,
      siteContentDoc,
    ] = await Promise.all([
      Student.aggregate<{ total: number; active: number }>([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] } },
          },
        },
      ]),
      Teacher.countDocuments(),
      AdmissionApplication.find({ status: "Pending" })
        .select("id applicant grade date status")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      ContactMessage.countDocuments({ status: "new" }),
      ContactMessage.countDocuments(),
      ContactMessage.find()
        .select("name email phone message status createdAt")
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
      SiteContent.findOne({ key: "default" }).select("content.events").lean(),
    ]);

    const stats = studentStats[0] ?? { total: 0, active: 0 };
    const events = siteContentDoc?.content?.events ?? [];
    const upcomingEvents = [...events]
      .filter((event) => event.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3)
      .map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date,
        type: event.type,
      }));

    res.json({
      stats: {
        students: stats.total,
        activeStudents: stats.active,
        teachers: teacherCount,
        contactNew,
        contactTotal,
        pendingAdmissions: pendingAdmissions.length,
      },
      pendingAdmissions,
      upcomingEvents,
      contactMessages,
    });
  })
);
