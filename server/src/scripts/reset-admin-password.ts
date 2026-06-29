import bcrypt from "bcryptjs";
import { connectDb } from "../config/db.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

async function resetAdminPassword() {
  await connectDb();

  const email = env.adminEmail.toLowerCase();
  const user = await User.findOne({ email });

  if (!user) {
    console.error(`No admin user found for ${email}. Run npm run seed first.`);
    process.exit(1);
  }

  user.passwordHash = await bcrypt.hash(env.adminPassword, 12);
  await user.save();

  console.log(`Admin password updated for ${email}`);
  process.exit(0);
}

resetAdminPassword().catch((err) => {
  console.error(err);
  process.exit(1);
});
