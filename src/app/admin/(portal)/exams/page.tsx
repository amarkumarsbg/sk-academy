import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { examSchedule } from "@/data/mock";
import { Plus } from "lucide-react";

export default function ExamsPage() {
  return (
    <>
      <AdminHeader title="Examinations" />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mb-4 flex justify-end">
          <Button size="sm" disabled>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Exam
          </Button>
        </div>
        <AdminDataTable
          columns={[
            { key: "id", label: "Exam ID" },
            { key: "name", label: "Exam Name" },
            { key: "class", label: "Class" },
            { key: "startDate", label: "Start Date" },
            { key: "endDate", label: "End Date" },
            {
              key: "status",
              label: "Status",
              render: (row) => <Badge variant="outline">{row.status as string}</Badge>,
            },
          ]}
          data={examSchedule}
        />
      </div>
    </>
  );
}
