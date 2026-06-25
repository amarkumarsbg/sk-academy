import nodemailer from "nodemailer";
import { Resend } from "resend";
import { env } from "../config/env.js";

let transporter: nodemailer.Transporter | null = null;
let resend: Resend | null = null;

function getTransporter() {
  if (!env.smtpEnabled) return null;
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

function getResend() {
  if (!env.resendEnabled) return null;
  if (!resend) {
    resend = new Resend(env.resendApiKey);
  }
  return resend;
}

export async function sendEmail(options: {
  to?: string;
  subject: string;
  text: string;
  html?: string;
}) {
  if (!env.emailEnabled) {
    console.log(`[email skipped] ${options.subject}`);
    return;
  }

  const to = options.to ?? env.notifyEmail;
  const html = options.html ?? options.text.replace(/\n/g, "<br>");

  const resendClient = getResend();
  if (resendClient) {
    const { error } = await resendClient.emails.send({
      from: env.resendFrom,
      to: [to],
      subject: options.subject,
      text: options.text,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  const transport = getTransporter();
  if (!transport) {
    console.log(`[email skipped] ${options.subject}`);
    return;
  }

  await transport.sendMail({
    from: env.smtpFrom,
    to,
    subject: options.subject,
    text: options.text,
    html,
  });
}

export async function notifyNewContactMessage(data: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    await sendEmail({
      subject: `[SK Academy] New contact message from ${data.name}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}\n\nView in admin inbox: ${env.adminPortalUrl}${env.adminInboxPath()}`,
    });
  } catch (err) {
    console.error("[email failed] contact notification:", err);
  }
}

export async function notifyNewAdmissionInquiry(data: {
  name: string;
  phone: string;
  email: string;
  grade: string;
}) {
  try {
    await sendEmail({
      subject: `[SK Academy] New admission inquiry — ${data.name}`,
      text: `Student/Parent: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nGrade: ${data.grade}\n\nView in admin inbox: ${env.adminPortalUrl}${env.adminInboxPath()}`,
    });
  } catch (err) {
    console.error("[email failed] admission notification:", err);
  }
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  try {
    await sendEmail({
      to: email,
      subject: "[SK Academy] Reset your admin password",
      text: `You requested a password reset.\n\nOpen this link to set a new password (valid for 1 hour):\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
    });
  } catch (err) {
    console.error("[email failed] password reset:", err);
  }
}
