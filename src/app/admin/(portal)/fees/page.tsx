import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { feeRecords } from "@/data/mock";

function feeStatusVariant(status: string) {
  if (status === "Paid") return "default";
  if (status === "Partial") return "secondary";
  return "destructive";
}

export default function FeesPage() {
  return (
    <>
      <AdminHeader title="Fee Management" />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total Collected", value: "₹12.8L" },
            { label: "Pending Amount", value: "₹8.4L" },
            { label: "Students with Dues", value: "156" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>
        <AdminDataTable
          columns={[
            { key: "id", label: "Invoice ID" },
            { key: "student", label: "Student" },
            { key: "class", label: "Class" },
            {
              key: "amount",
              label: "Amount",
              render: (row) => `₹${(row.amount as number).toLocaleString("en-IN")}`,
            },
            {
              key: "paid",
              label: "Paid",
              render: (row) => `₹${(row.paid as number).toLocaleString("en-IN")}`,
            },
            {
              key: "due",
              label: "Due",
              render: (row) => `₹${(row.due as number).toLocaleString("en-IN")}`,
            },
            {
              key: "status",
              label: "Status",
              render: (row) => (
                <Badge variant={feeStatusVariant(row.status as string)}>
                  {row.status as string}
                </Badge>
              ),
            },
          ]}
          data={feeRecords}
        />
      </div>
    </>
  );
}
