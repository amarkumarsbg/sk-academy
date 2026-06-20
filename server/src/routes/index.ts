import { Router } from "express";
import { authRouter, usersRouter } from "./auth.js";
import { siteContentRouter } from "./siteContent.js";
import { formsRouter } from "./forms.js";
import { uploadRouter } from "./upload.js";
import { auditRouter } from "./audit.js";
import { createCrudRouter } from "./crudFactory.js";
import { Student } from "../models/Student.js";
import { Teacher } from "../models/Teacher.js";
import { AdmissionApplication } from "../models/AdmissionApplication.js";
import { Attendance } from "../models/Attendance.js";
import { FeeRecord } from "../models/FeeRecord.js";
import { Exam } from "../models/Exam.js";
import { Result } from "../models/Result.js";
import { authRequired } from "../middleware/auth.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/site-content", siteContentRouter);
apiRouter.use("/upload", uploadRouter);
apiRouter.use("/audit-log", auditRouter);
apiRouter.use("/", formsRouter);

apiRouter.use("/students", authRequired, createCrudRouter(Student));
apiRouter.use("/teachers", authRequired, createCrudRouter(Teacher));
apiRouter.use("/admissions", authRequired, createCrudRouter(AdmissionApplication));
apiRouter.use("/attendance", authRequired, createCrudRouter(Attendance));
apiRouter.use("/fees", authRequired, createCrudRouter(FeeRecord));
apiRouter.use("/exams", authRequired, createCrudRouter(Exam));
apiRouter.use("/results", authRequired, createCrudRouter(Result));
