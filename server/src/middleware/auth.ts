import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export type UserRole = "admin" | "staff";

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

const COOKIE_NAME = "sk_auth";

function getSharedCookieDomain() {
  if (!env.isProduction) return undefined;

  try {
    const clientHost = new URL(env.clientUrl).hostname;
    const adminHost = env.adminUrl ? new URL(env.adminUrl).hostname : clientHost;
    const clientRoot = clientHost.split(".").slice(-2).join(".");
    const adminRoot = adminHost.split(".").slice(-2).join(".");

    if (clientRoot && clientRoot === adminRoot && clientHost !== adminHost) {
      return `.${clientRoot}`;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export function getAuthCookieName() {
  return COOKIE_NAME;
}

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function setAuthCookie(res: Response, token: string) {
  const domain = getSharedCookieDomain();

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
    ...(domain ? { domain } : {}),
  });
}

export function clearAuthCookie(res: Response) {
  const domain = getSharedCookieDomain();

  res.clearCookie(COOKIE_NAME, {
    path: "/",
    secure: env.isProduction,
    sameSite: "lax",
    ...(domain ? { domain } : {}),
  });
}

export function authRequired(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return next(new AppError("Authentication required", 401));
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret) as AuthPayload;
    next();
  } catch {
    next(new AppError("Invalid or expired session", 401));
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Insufficient permissions", 403));
    }
    next();
  };
}
