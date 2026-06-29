import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

function formatZodError(err: ZodError) {
  const first = err.errors[0];
  if (!first) return "Invalid request.";
  const field = first.path.join(".");
  if (field === "email") return "Please enter a valid email address.";
  if (field === "phone") return "Please enter a valid phone number.";
  if (field === "message") return "Message should be at least 10 characters.";
  if (field === "name") return "Please enter your name.";
  return first.message;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ error: formatZodError(err) });
    return;
  }

  if (err instanceof Error && err.name === "ValidationError") {
    res.status(400).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}
