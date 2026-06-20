"use client";

import { ResourceCrudPage, statusBadge } from "@/components/admin/resource-crud-page";

const EXAM_STATUSES = ["Scheduled", "Ongoing", "Completed", "Upcoming"];

export default function ExamsPage() {
  return (
    <ResourceCrudPage
      title="Exams"
      resource="exams"
      idPrefix="EX"
      addLabel="Add Exam"
      searchPlaceholder="Search exam..."
      searchKeys={["name", "id", "class"]}
      emptyStateMessage="No exams found."
      emptyItem={{
        id: "",
        name: "",
        class: "",
        startDate: "",
        endDate: "",
        status: "Scheduled",
      }}
      fields={[
        { key: "name", label: "Name" },
        { key: "class", label: "Class" },
        { key: "startDate", label: "Start Date", type: "date" },
        { key: "endDate", label: "End Date", type: "date" },
        { key: "status", label: "Status", type: "select", options: EXAM_STATUSES },
      ]}
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "class", label: "Class" },
        { key: "startDate", label: "Start" },
        { key: "endDate", label: "End" },
        {
          key: "status",
          label: "Status",
          render: (row) => statusBadge(row.status),
        },
      ]}
    />
  );
}
