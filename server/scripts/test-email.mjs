import "dotenv/config";
import { Resend } from "resend";
import nodemailer from "nodemailer";

const to = process.env.NOTIFY_EMAIL || "info@skacademy.net";

async function testResend() {
  if (!process.env.RESEND_API_KEY) return { provider: "resend", skipped: true };
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = (process.env.RESEND_FROM || "SK Academy <onboarding@resend.dev>").replace(/^"|"$/g, "");
  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject: "[SK Academy] Email test",
    text: "If you received this, Resend is working.",
  });
  return { provider: "resend", data, error: error ? { message: error.message } : null };
}

async function testSmtp() {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return { provider: "smtp", skipped: true, reason: "Set SMTP_PASS in server/.env" };
  }
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 465),
    secure: Number(SMTP_PORT || 465) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  await transport.sendMail({
    from: (SMTP_FROM || SMTP_USER).replace(/^"|"$/g, ""),
    to,
    subject: "[SK Academy] Email test",
    text: "If you received this, SMTP is working.",
  });
  return { provider: "smtp", ok: true, to };
}

console.log(`Sending test email to: ${to}\n`);

const resendResult = await testResend();
console.log("Resend:", JSON.stringify(resendResult, null, 2));

if (resendResult.error || resendResult.skipped) {
  try {
    const smtpResult = await testSmtp();
    console.log("SMTP:", JSON.stringify(smtpResult, null, 2));
    if (smtpResult.ok) {
      console.log("\nCheck your inbox at", to);
    }
  } catch (err) {
    console.log("SMTP:", JSON.stringify({ error: err.message }, null, 2));
  }
} else {
  console.log("\nCheck your inbox at", to);
}
