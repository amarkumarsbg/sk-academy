import { AdminHeader, AdminMobileNav, AdminSidebar } from "@/components/admin/admin-shell";
import { AdminPortalProviders } from "@/components/admin/admin-portal-providers";

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminPortalProviders>
      <div className="flex h-dvh overflow-hidden bg-muted/30">
        <AdminSidebar />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <AdminMobileNav />
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
        </div>
      </div>
    </AdminPortalProviders>
  );
}

export { AdminHeader };
