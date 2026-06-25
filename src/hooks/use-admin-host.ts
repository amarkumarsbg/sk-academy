"use client";

import { usePathname } from "next/navigation";
import { adminHref, getAdminSiteUrl, getPublicSiteUrl, toInternalAdminPath } from "@/lib/admin-host";

export function useIsAdminHost() {
  if (typeof window === "undefined") {
    return false;
  }

  const adminSiteUrl = getAdminSiteUrl();
  if (!adminSiteUrl) {
    return false;
  }

  try {
    return window.location.hostname === new URL(adminSiteUrl).hostname;
  } catch {
    return false;
  }
}

export function useAdminHref(path: string) {
  return adminHref(path, useIsAdminHost());
}

export function useAdminNavItem(itemHref: string) {
  const pathname = usePathname();
  const isAdminHost = useIsAdminHost();
  const href = adminHref(itemHref, isAdminHost);
  const internalPath = toInternalAdminPath(href);
  const isDashboard = itemHref === "/admin";

  const isActive = isDashboard
    ? pathname === href || pathname === "/admin"
    : pathname === href || pathname.startsWith(`${href}/`) || pathname.startsWith(`${itemHref}/`);

  return { href, isActive, internalPath };
}

export function usePublicSiteUrl() {
  const configured = getPublicSiteUrl();
  return configured || "/";
}

export function useAdminLoginPath() {
  return useIsAdminHost() ? "/login" : "/admin/login";
}
