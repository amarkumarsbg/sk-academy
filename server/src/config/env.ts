import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri: required("MONGODB_URI"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",
  uploadDir: process.env.UPLOAD_DIR ?? "uploads",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@skacademy.edu",
  adminPassword: process.env.ADMIN_PASSWORD ?? "admin1234",
  isProduction: process.env.NODE_ENV === "production",
};
