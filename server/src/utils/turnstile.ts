import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export async function verifyTurnstile(token: string | undefined, ip?: string) {
  if (!env.turnstileEnabled) return;

  if (!token) {
    throw new AppError("Please complete the security check.", 400);
  }

  const body = new URLSearchParams({
    secret: env.turnstileSecret,
    response: token,
  });
  if (ip) body.set("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = (await res.json()) as { success?: boolean };
  if (!data.success) {
    throw new AppError("Security check failed. Please try again.", 400);
  }
}
