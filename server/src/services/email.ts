import nodemailer from "nodemailer";
import { Resend } from "resend";
import { env } from "../config/env.js";

let transporter: nodemailer.Transporter | null = null;
let resend: Resend | null = null;

function getTransporter() {
  if (!env.smtpEnabled) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      pool: true,
      maxConnections: 3,
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

export async function warmUpEmailTransport() {
  const transport = getTransporter();
  if (!transport) return;
  try {
    await transport.verify();
    console.log("[email] SMTP connection ready");
  } catch (err) {
    console.warn("[email] SMTP warm-up failed:", err instanceof Error ? err.message : err);
  }
}

async function sendViaResend(options: {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}) {
  const resendClient = getResend();
  if (!resendClient) return false;

  const { error } = await resendClient.emails.send({
    from: options.from,
    to: [options.to],
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  if (error) {
    console.warn(`[email] Resend failed (${error.message})`);
    return false;
  }

  console.log(`[email sent] to ${options.to} via Resend — ${options.subject}`);
  return true;
}

async function sendViaSmtp(options: {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}) {
  const transport = getTransporter();
  if (!transport) return false;

  await transport.sendMail({
    from: options.from,
    to: options.to,
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
  console.log(`[email sent] to ${options.to} via SMTP — ${options.subject}`);
  return true;
}

export async function sendEmail(options: {
  to?: string;
  from?: string;
  replyTo?: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const to = options.to ?? env.notifyEmail;
  const from = options.from ?? env.mailFrom;
  const html = options.html ?? options.text.replace(/\n/g, "<br>");

  if (!env.emailEnabled) {
    console.log(`[email skipped] ${options.subject} (no email provider configured)`);
    return;
  }

  const payload = {
    from,
    to,
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
    html,
  };

  if (env.emailProvider === "smtp") {
    if (await sendViaSmtp(payload)) return;
    if (await sendViaResend({ ...payload, from: options.from ?? env.resendFrom })) return;
  } else {
    if (await sendViaResend({ ...payload, from: options.from ?? env.resendFrom })) return;
    if (await sendViaSmtp(payload)) return;
  }

  console.log(`[email skipped] ${options.subject} (all providers failed)`);
}

function formatReplyTo(name: string, email: string) {
  const safeName = name.replace(/"/g, "'");
  return `"${safeName}" <${email}>`;
}

function buildFormNotificationBody(data: {
  intro: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  extraLines?: string[];
}) {
  const lines = [
    data.intro,
    "",
    `From: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : "",
    ...(data.extraLines ?? []),
    data.message !== undefined ? "" : null,
    data.message !== undefined ? "Message:" : null,
    data.message,
    "",
    "—",
    `Hit Reply in your mail app to respond directly to ${data.name} at ${data.email}.`,
    `Admin inbox: ${env.adminPortalUrl}${env.adminInboxPath()}`,
  ].filter((line): line is string => line !== null && line !== "");

  return lines.join("\n");
}

function queueFormEmail(task: () => Promise<void>) {
  void task().catch((err) => {
    console.error("[email failed] form notification:", err);
  });
}

export function notifyNewContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  queueFormEmail(() =>
    sendEmail({
      to: env.notifyEmail,
      from: env.mailFrom,
      replyTo: formatReplyTo(data.name, data.email),
      subject: `Website contact: ${data.name}`,
      text: buildFormNotificationBody({
        intro: "Someone submitted the contact form on skacademy.net",
        ...data,
      }),
    })
  );
}

export function notifyNewAdmissionInquiry(data: {
  name: string;
  phone: string;
  email: string;
  grade: string;
}) {
  queueFormEmail(() =>
    sendEmail({
      to: env.notifyEmail,
      from: env.mailFrom,
      replyTo: formatReplyTo(data.name, data.email),
      subject: `Website admission inquiry: ${data.name}`,
      text: buildFormNotificationBody({
        intro: "Someone submitted an admission inquiry on skacademy.net",
        name: data.name,
        email: data.email,
        phone: data.phone,
        extraLines: [`Grade: ${data.grade}`],
      }),
    })
  );
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
