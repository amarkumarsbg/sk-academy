"use client";

import { ResourceCrudPage, statusBadge } from "@/components/admin/resource-crud-page";

const ADMISSION_STATUSES = ["Pending", "Approved", "Rejected"];

export default function AdminAdmissionsPage() {
  return (
    <ResourceCrudPage
      title="Admissions"
      resource="admissions"
      idPrefix="ADM"
      addLabel="Add Application"
      searchPlaceholder="Search applicant..."
      searchKeys={["applicant", "id", "parentName", "phone", "email"]}
      filters={[
        {
          key: "status",
          label: "Status",
          options: ADMISSION_STATUSES,
        },
      ]}
      emptyStateMessage="No admission applications found."
      emptyItem={{
        id: "",
        applicant: "",
        grade: "",
        date: new Date().toISOString().slice(0, 10),
        status: "Pending",
        email: "",
        phone: "",
        parentName: "",
        previousSchool: "",
      }}
      fields={[
        { key: "applicant", label: "Applicant Name" },
        { key: "grade", label: "Grade" },
        { key: "date", label: "Applied On", type: "date" },
        { key: "status", label: "Status", type: "select", options: ADMISSION_STATUSES },
        { key: "parentName", label: "Parent Name" },
        { key: "phone", label: "Phone", placeholder: "+91 98765 43210" },
        { key: "email", label: "Email", placeholder: "parent@email.com" },
        { key: "previousSchool", label: "Previous School" },
      ]}
      columns={[
        { key: "id", label: "Application ID" },
        { key: "applicant", label: "Applicant", primary: true },
        { key: "grade", label: "Grade" },
        { key: "parentName", label: "Parent" },
        { key: "phone", label: "Phone" },
        { key: "previousSchool", label: "Previous School" },
        { key: "date", label: "Applied On" },
        {
          key: "status",
          label: "Status",
          render: (row) => statusBadge(row.status),
        },
      ]}
    />
  );
}
