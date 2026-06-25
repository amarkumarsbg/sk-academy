import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getAdminDashboardPath,
  getAdminLoginPath,
  getAdminSiteUrl,
  isAdminAreaPath,
  isAdminHostname,
  isPublicAdminPath,
  resolveAdminPathname,
  shouldMapAdminHostname,
  toAdminPublicPath,
  toInternalAdminPath,
} from "@/lib/admin-host";
import { isComingSoonEnabled, isPublicPathAllowedDuringComingSoon } from "@/lib/coming-soon";

const AUTH_COOKIE = "sk_auth";

function getHostname(request: NextRequest) {
  return request.headers.get("host")?.split(":")[0] ?? "";
}

export function middleware(request: NextRequest) {
  const hostname = getHostname(request);
  const { pathname } = request.nextUrl;
  const isAdminHost = isAdminHostname(hostname);
  const adminSiteUrl = getAdminSiteUrl();
  const resolvedPathname = resolveAdminPathname(pathname, isAdminHost);

  if (!isAdminHost && pathname.startsWith("/admin")) {
    if (adminSiteUrl) {
      const redirectUrl = new URL(toAdminPublicPath(pathname), adminSiteUrl);
      redirectUrl.search = request.nextUrl.search;
      return NextResponse.redirect(redirectUrl);
    }

    if (isComingSoonEnabled()) {
      return NextResponse.redirect(new URL("/coming-soon", request.url));
    }
  }

  if (isAdminHost && shouldMapAdminHostname(pathname)) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = toInternalAdminPath(pathname);
    return NextResponse.rewrite(rewriteUrl);
  }

  if (
    !isAdminHost &&
    isComingSoonEnabled() &&
    !isPublicPathAllowedDuringComingSoon(pathname)
  ) {
    return NextResponse.redirect(new URL("/coming-soon", request.url));
  }

  const hasAuth = Boolean(request.cookies.get(AUTH_COOKIE)?.value);
  const inAdminArea = isAdminAreaPath(pathname, isAdminHost);
  const isPublicAdminPage = isPublicAdminPath(pathname, isAdminHost);

  if (inAdminArea && !isPublicAdminPage && !hasAuth) {
    const loginUrl = new URL(getAdminLoginPath(isAdminHost), request.url);
    loginUrl.searchParams.set(
      "next",
      isAdminHost ? toAdminPublicPath(resolvedPathname) : resolvedPathname
    );
    return NextResponse.redirect(loginUrl);
  }

  const loginPath = getAdminLoginPath(isAdminHost);
  if (pathname === loginPath && hasAuth) {
    return NextResponse.redirect(new URL(getAdminDashboardPath(isAdminHost), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
