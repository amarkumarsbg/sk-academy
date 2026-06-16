import { AdminHeader, AdminMobileNav, AdminSidebar } from "@/components/admin/admin-shell";

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh overflow-hidden bg-muted/30">
      <AdminSidebar />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AdminMobileNav />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export { AdminHeader };
