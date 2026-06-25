import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isComingSoonEnabled, isPublicPathAllowedDuringComingSoon } from "@/lib/coming-soon";

const AUTH_COOKIE = "sk_auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isComingSoonEnabled() && !isPublicPathAllowedDuringComingSoon(pathname)) {
    return NextResponse.redirect(new URL("/coming-soon", request.url));
  }

  const hasAuth = Boolean(request.cookies.get(AUTH_COOKIE)?.value);
  const isAdminRoute = pathname.startsWith("/admin");
  const isPublicAdminPage =
    pathname === "/admin/login" ||
    pathname === "/admin/forgot-password" ||
    pathname.startsWith("/admin/reset-password");

  if (isAdminRoute && !isPublicAdminPage && !hasAuth) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/admin/login" && hasAuth) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
