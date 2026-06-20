import { AdminPageLoading } from "@/components/admin/admin-loading";

export default function AdminLoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <AdminPageLoading label="Loading..." />
    </div>
  );
}
