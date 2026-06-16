import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { admissionApplications } from "@/data/mock";

function statusVariant(status: string) {
  if (status === "Approved") return "default";
  if (status === "Under Review") return "secondary";
  return "outline";
}

export default function AdminAdmissionsPage() {
  return (
    <>
      <AdminHeader title="Admissions" />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <AdminDataTable
          columns={[
            { key: "id", label: "Application ID" },
            { key: "applicant", label: "Applicant" },
            { key: "grade", label: "Grade" },
            { key: "date", label: "Applied On" },
            {
              key: "status",
              label: "Status",
              render: (row) => (
                <Badge variant={statusVariant(row.status as string)}>
                  {row.status as string}
                </Badge>
              ),
            },
          ]}
          data={admissionApplications}
        />
      </div>
    </>
  );
}
