export function isComingSoonEnabled() {
  return process.env.COMING_SOON === "true";
}

export function getLaunchDate() {
  const raw = process.env.COMING_SOON_LAUNCH_DATE ?? "2026-07-01";
  return new Date(`${raw}T00:00:00`);
}

export function formatLaunchDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function isPublicPathAllowedDuringComingSoon(pathname: string, adminSubdomainEnabled = false) {
  return (
    pathname === "/coming-soon" ||
    (!adminSubdomainEnabled && pathname.startsWith("/admin")) ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/_next")
  );
}
