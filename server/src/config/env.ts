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
  clientUrl: (process.env.CLIENT_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  adminUrl: (process.env.ADMIN_URL ?? "").replace(/\/$/, ""),
  uploadDir: process.env.UPLOAD_DIR ?? "uploads",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@skacademy.edu",
  adminPassword: process.env.ADMIN_PASSWORD ?? "admin1234",
  isProduction: process.env.NODE_ENV === "production",
  notifyEmail: process.env.NOTIFY_EMAIL ?? "info@skacademy.net",
  mailFrom:
    process.env.MAIL_FROM ??
    process.env.SMTP_FROM ??
    '"SK Academy Website" <noreply@skacademy.net>',
  emailProvider: process.env.EMAIL_PROVIDER ?? (process.env.SMTP_HOST ? "smtp" : "resend"),
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  resendFrom:
    process.env.RESEND_FROM ??
    process.env.MAIL_FROM ??
    '"SK Academy Website" <noreply@skacademy.net>',
  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: Number(process.env.SMTP_PORT ?? 587),
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPass: process.env.SMTP_PASS ?? "",
  smtpFrom: process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@skacademy.edu",
  turnstileSecret: process.env.TURNSTILE_SECRET_KEY?.trim() ?? "",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME?.trim() ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY?.trim() ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET?.trim() ?? "",
  get resendEnabled() {
    return Boolean(this.resendApiKey);
  },
  get smtpEnabled() {
    return Boolean(this.smtpHost && this.smtpUser && this.smtpPass);
  },
  get emailEnabled() {
    return this.resendEnabled || this.smtpEnabled;
  },
  get turnstileEnabled() {
    return Boolean(this.turnstileSecret);
  },
  get cloudinaryEnabled() {
    return Boolean(this.cloudinaryCloudName && this.cloudinaryApiKey && this.cloudinaryApiSecret);
  },
  get allowedOrigins() {
    return [...new Set([this.clientUrl, this.adminUrl].filter(Boolean))];
  },
  get adminPortalUrl() {
    return this.adminUrl || this.clientUrl;
  },
  adminInboxPath() {
    return this.adminUrl ? "/inbox" : "/admin/inbox";
  },
  adminResetPasswordPath(token: string) {
    const path = this.adminUrl
      ? `/reset-password?token=${token}`
      : `/admin/reset-password?token=${token}`;
    return `${this.adminPortalUrl}${path}`;
  },
};

const WEAK_SECRETS = new Set(["change-me", "secret", "jwt-secret", "admin1234"]);

export function validateProductionEnv() {
  if (!env.isProduction) return;

  const issues: string[] = [];

  if (env.jwtSecret.length < 32 || WEAK_SECRETS.has(env.jwtSecret.toLowerCase())) {
    issues.push("JWT_SECRET must be at least 32 characters and not a common default.");
  }

  if (!process.env.ADMIN_PASSWORD || WEAK_SECRETS.has(env.adminPassword)) {
    console.warn(
      "ADMIN_PASSWORD is missing or weak — set a strong value on Render before running seed. Existing admin logins are unaffected."
    );
  }

  if (!env.adminUrl) {
    console.warn("ADMIN_URL is not set — admin CORS may be limited to CLIENT_URL only.");
  }

  if (!env.emailEnabled) {
    issues.push("Email is not configured — set SMTP_* or RESEND_API_KEY for form notifications.");
  }

  if (issues.length > 0) {
    console.error("Production environment issues:\n" + issues.map((i) => `  - ${i}`).join("\n"));
    throw new Error("Fix production environment variables before starting the server.");
  }
}
