import { AdminHeader, AdminMobileNav, AdminSidebar } from "@/components/admin/admin-shell";
import { AdminPortalProviders } from "@/components/admin/admin-portal-providers";
import { AdminScrollUnlock } from "@/components/admin/admin-scroll-unlock";

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminPortalProviders>
      <AdminScrollUnlock />
      {/* Mobile: min-height only so the page can grow and scroll naturally.
          Desktop: fixed viewport height with internal scroll. */}
      <div
        data-admin-portal
        className="flex min-h-dvh w-full bg-muted/30 md:h-dvh md:max-h-dvh md:overflow-hidden"
      >
        <AdminSidebar />
        <div className="flex w-full min-w-0 flex-1 flex-col md:min-h-0 md:overflow-hidden">
          <AdminMobileNav />
          <div className="w-full touch-pan-y md:min-h-0 md:flex-1 md:overflow-y-auto md:overscroll-y-contain">
            {children}
          </div>
        </div>
      </div>
    </AdminPortalProviders>
  );
}

export { AdminHeader };
