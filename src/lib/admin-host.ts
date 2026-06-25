const ADMIN_ROUTE_PREFIX = "/admin";

function normalizeUrl(value: string) {
  return value.replace(/\/$/, "");
}

export function getAdminSiteUrl() {
  return normalizeUrl(process.env.ADMIN_URL ?? process.env.NEXT_PUBLIC_ADMIN_URL ?? "");
}

export function getPublicSiteUrl() {
  return normalizeUrl(
    process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXT_PUBLIC_CLIENT_URL ??
      process.env.CLIENT_URL ??
      ""
  );
}

export function getAdminHostname() {
  const adminUrl = getAdminSiteUrl();
  if (!adminUrl) return "";

  try {
    return new URL(adminUrl).hostname;
  } catch {
    return "";
  }
}

export function isAdminHostname(hostname: string) {
  const adminHost = getAdminHostname();
  if (adminHost && hostname === adminHost) {
    return true;
  }

  const publicSiteUrl = getPublicSiteUrl();
  if (!publicSiteUrl) {
    return false;
  }

  try {
    const publicHost = new URL(publicSiteUrl).hostname.replace(/^www\./, "");
    return hostname === `admin.${publicHost}`;
  } catch {
    return false;
  }
}

export function toInternalAdminPath(pathname: string) {
  if (pathname.startsWith(ADMIN_ROUTE_PREFIX)) {
    return pathname;
  }

  if (pathname === "/") {
    return ADMIN_ROUTE_PREFIX;
  }

  return `${ADMIN_ROUTE_PREFIX}${pathname}`;
}

export function toAdminPublicPath(pathname: string) {
  if (!pathname.startsWith(ADMIN_ROUTE_PREFIX)) {
    return pathname;
  }

  const rest = pathname.slice(ADMIN_ROUTE_PREFIX.length);
  return rest || "/";
}

export function shouldMapAdminHostname(pathname: string) {
  return (
    !pathname.startsWith(ADMIN_ROUTE_PREFIX) &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/uploads") &&
    !pathname.startsWith("/_next")
  );
}

export function getAdminLoginPath(isAdminHost: boolean) {
  return isAdminHost ? "/login" : `${ADMIN_ROUTE_PREFIX}/login`;
}

export function getAdminDashboardPath(isAdminHost: boolean) {
  return isAdminHost ? "/" : ADMIN_ROUTE_PREFIX;
}

export function isPublicAdminPath(pathname: string, isAdminHost: boolean) {
  if (isAdminHost) {
    return (
      pathname === "/login" ||
      pathname === "/forgot-password" ||
      pathname.startsWith("/reset-password")
    );
  }

  return (
    pathname === `${ADMIN_ROUTE_PREFIX}/login` ||
    pathname === `${ADMIN_ROUTE_PREFIX}/forgot-password` ||
    pathname.startsWith(`${ADMIN_ROUTE_PREFIX}/reset-password`)
  );
}

export function resolveAdminPathname(pathname: string, isAdminHost: boolean) {
  if (isAdminHost && shouldMapAdminHostname(pathname)) {
    return toInternalAdminPath(pathname);
  }

  return pathname;
}

export function isAdminAreaPath(pathname: string, isAdminHost: boolean) {
  const resolved = resolveAdminPathname(pathname, isAdminHost);
  return resolved.startsWith(ADMIN_ROUTE_PREFIX);
}

export function adminHref(path: string, isAdminHost = false) {
  const internalPath = path.startsWith(ADMIN_ROUTE_PREFIX)
    ? path
    : toInternalAdminPath(path.startsWith("/") ? path : `/${path}`);

  return isAdminHost ? toAdminPublicPath(internalPath) : internalPath;
}

export function getAdminPortalUrl(path = "/login") {
  const adminSiteUrl = getAdminSiteUrl();
  if (!adminSiteUrl) {
    return `${ADMIN_ROUTE_PREFIX}${path === "/" ? "" : path.replace(/^\//, "/")}`;
  }

  const publicPath = path.startsWith(ADMIN_ROUTE_PREFIX)
    ? toAdminPublicPath(path)
    : path.startsWith("/")
      ? path
      : `/${path}`;

  return `${adminSiteUrl}${publicPath}`;
}
