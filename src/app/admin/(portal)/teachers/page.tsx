import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { Button } from "@/components/ui/button";
import { teachers } from "@/data/mock";
import { Plus } from "lucide-react";

export default function TeachersPage() {
  return (
    <>
      <AdminHeader title="Teachers" />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{teachers.length} teachers (demo data)</p>
          <Button size="sm" disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add Teacher
          </Button>
        </div>
        <AdminDataTable
          columns={[
            { key: "id", label: "ID" },
            { key: "name", label: "Name" },
            { key: "subject", label: "Subject" },
            { key: "classes", label: "Classes" },
            { key: "experience", label: "Experience" },
          ]}
          data={teachers}
        />
      </div>
    </>
  );
}
