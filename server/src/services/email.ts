import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!env.emailEnabled) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: { user: env.smtpUser, pass: env.smtpPass },
    });
  }
  return transporter;
}

export async function sendEmail(options: {
  to?: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const transport = getTransporter();
  if (!transport) {
    console.log(`[email skipped] ${options.subject}`);
    return;
  }

  await transport.sendMail({
    from: env.smtpFrom,
    to: options.to ?? env.notifyEmail,
    subject: options.subject,
    text: options.text,
    html: options.html ?? options.text.replace(/\n/g, "<br>"),
  });
}

export async function notifyNewContactMessage(data: {
  name: string;
  email: string;
  message: string;
}) {
  await sendEmail({
    subject: `[SK Academy] New contact message from ${data.name}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}\n\nView in admin inbox: ${env.clientUrl}/admin/inbox`,
  });
}

export async function notifyNewAdmissionInquiry(data: {
  name: string;
  phone: string;
  email: string;
  grade: string;
}) {
  await sendEmail({
    subject: `[SK Academy] New admission inquiry — ${data.name}`,
    text: `Student/Parent: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nGrade: ${data.grade}\n\nView in admin inbox: ${env.clientUrl}/admin/inbox`,
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await sendEmail({
    to: email,
    subject: "[SK Academy] Reset your admin password",
    text: `You requested a password reset.\n\nOpen this link to set a new password (valid for 1 hour):\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
  });
}
