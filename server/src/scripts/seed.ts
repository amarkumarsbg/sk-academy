import bcrypt from "bcryptjs";
import { connectDb } from "../config/db.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { SiteContent } from "../models/SiteContent.js";
import { Student } from "../models/Student.js";
import { Teacher } from "../models/Teacher.js";
import { AdmissionApplication } from "../models/AdmissionApplication.js";
import { FeeRecord } from "../models/FeeRecord.js";
import { Exam } from "../models/Exam.js";
import { Result } from "../models/Result.js";
import {
  students,
  teachers,
  admissionApplications,
  feeRecords,
  exams,
  results,
} from "../data/seedData.js";
import { defaultSiteContent } from "../data/siteContentSeed.js";

async function seed() {
  await connectDb();

  const existingAdmin = await User.findOne({ email: env.adminEmail.toLowerCase() });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(env.adminPassword, 12);
    await User.create({
      email: env.adminEmail.toLowerCase(),
      passwordHash,
      name: "Admin",
      role: "admin",
    });
    console.log(`Created admin user: ${env.adminEmail}`);
  } else {
    console.log("Admin user already exists");
  }

  const existingContent = await SiteContent.findOne({ key: "default" });
  const forceSeed = process.env.FORCE_SEED_CONTENT === "true";

  if (existingContent && !forceSeed) {
    console.log("Site content already exists — skipping (set FORCE_SEED_CONTENT=true to overwrite).");
  } else {
    await SiteContent.findOneAndUpdate(
      { key: "default" },
      { content: defaultSiteContent },
      { upsert: true }
    );
    console.log(
      existingContent
        ? "Site content overwritten from seed (FORCE_SEED_CONTENT=true)."
        : "Seeded site content"
    );
  }

  for (const item of students) {
    await Student.findOneAndUpdate({ id: item.id }, item, { upsert: true });
  }
  console.log(`Seeded ${students.length} students`);

  for (const item of teachers) {
    await Teacher.findOneAndUpdate({ id: item.id }, item, { upsert: true });
  }
  console.log(`Seeded ${teachers.length} teachers`);

  for (const item of admissionApplications) {
    await AdmissionApplication.findOneAndUpdate({ id: item.id }, item, { upsert: true });
  }
  console.log(`Seeded ${admissionApplications.length} admission applications`);

  for (const item of feeRecords) {
    await FeeRecord.findOneAndUpdate({ id: item.id }, item, { upsert: true });
  }
  console.log(`Seeded ${feeRecords.length} fee records`);

  for (const item of exams) {
    await Exam.findOneAndUpdate({ id: item.id }, item, { upsert: true });
  }
  console.log(`Seeded ${exams.length} exams`);

  for (const item of results) {
    await Result.findOneAndUpdate({ id: item.id }, item, { upsert: true });
  }
  console.log(`Seeded ${results.length} results`);

  console.log("Seed complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
