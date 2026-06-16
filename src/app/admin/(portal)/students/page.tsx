import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { students } from "@/data/mock";
import { Plus } from "lucide-react";

export default function StudentsPage() {
  return (
    <>
      <AdminHeader title="Students" />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{students.length} students (demo data)</p>
          <Button size="sm" disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
        <AdminDataTable
          columns={[
            { key: "id", label: "ID" },
            { key: "name", label: "Name" },
            { key: "class", label: "Class" },
            { key: "rollNo", label: "Roll No" },
            { key: "parent", label: "Parent" },
            {
              key: "status",
              label: "Status",
              render: (row) => <Badge variant="secondary">{row.status as string}</Badge>,
            },
          ]}
          data={students}
        />
      </div>
    </>
  );
}
