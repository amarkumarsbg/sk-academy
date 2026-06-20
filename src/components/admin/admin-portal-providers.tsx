"use client";

import { CmsToastProvider } from "@/components/admin/cms-toast";

export function AdminPortalProviders({ children }: { children: React.ReactNode }) {
  return <CmsToastProvider>{children}</CmsToastProvider>;
}
