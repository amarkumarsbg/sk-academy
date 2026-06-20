"use client";

import { ResourceCrudPage, statusBadge } from "@/components/admin/resource-crud-page";

const FEE_STATUSES = ["Paid", "Pending", "Partial"];
const PAYMENT_MODES = ["Cash", "UPI", "Bank Transfer", "Cheque", "Card"];

export default function FeesPage() {
  return (
    <ResourceCrudPage
      title="Fee Management"
      resource="fees"
      idPrefix="FEE"
      addLabel="Add Fee Record"
      searchPlaceholder="Search by invoice, student..."
      searchKeys={["id", "student", "class", "transactionId"]}
      filters={[
        {
          key: "status",
          label: "Status",
          options: FEE_STATUSES,
        },
      ]}
      emptyStateMessage="No fee records found."
      emptyItem={{
        id: "",
        student: "",
        class: "",
        amount: 0,
        paid: 0,
        due: 0,
        status: "Pending",
        paymentDate: "",
        paymentMode: "",
        transactionId: "",
      }}
      fields={[
        { key: "student", label: "Student" },
        { key: "class", label: "Class" },
        { key: "amount", label: "Amount", type: "number" },
        { key: "paid", label: "Paid", type: "number" },
        { key: "due", label: "Due", type: "number" },
        { key: "status", label: "Status", type: "select", options: FEE_STATUSES },
        { key: "paymentDate", label: "Payment Date", type: "date" },
        { key: "paymentMode", label: "Payment Mode", type: "select", options: PAYMENT_MODES },
        { key: "transactionId", label: "Transaction ID", placeholder: "UPI/NEFT reference" },
      ]}
      columns={[
        { key: "id", label: "Invoice ID" },
        { key: "student", label: "Student" },
        { key: "class", label: "Class" },
        {
          key: "amount",
          label: "Amount",
          render: (row) => `₹${row.amount.toLocaleString("en-IN")}`,
        },
        {
          key: "paid",
          label: "Paid",
          render: (row) => `₹${row.paid.toLocaleString("en-IN")}`,
        },
        {
          key: "due",
          label: "Due",
          render: (row) => `₹${row.due.toLocaleString("en-IN")}`,
        },
        {
          key: "status",
          label: "Status",
          render: (row) => statusBadge(row.status),
        },
        { key: "paymentDate", label: "Payment Date" },
        { key: "paymentMode", label: "Mode" },
        { key: "transactionId", label: "Txn ID" },
      ]}
    />
  );
}
