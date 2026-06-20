import { AdminPageLoading } from "@/components/admin/admin-loading";

export default function AdminPortalLoading() {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center p-6">
      <AdminPageLoading label="Loading page..." />
    </div>
  );
}
