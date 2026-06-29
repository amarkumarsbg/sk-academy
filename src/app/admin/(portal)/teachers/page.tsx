"use client";

import { ResourceCrudPage } from "@/components/admin/resource-crud-page";

const TEACHER_SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Hindi",
  "Computer Science",
  "Social Science",
  "Physical Education",
];

export default function TeachersPage() {
  return (
    <ResourceCrudPage
      title="Teachers"
      resource="teachers"
      idPrefix="TCH"
      addLabel="Add Teacher"
      searchPlaceholder="Search teacher..."
      searchKeys={["name", "id", "subject", "email", "phone"]}
      filters={[
        {
          key: "subject",
          label: "Subject",
          options: TEACHER_SUBJECTS,
        },
      ]}
      emptyStateMessage="No teachers found."
      emptyItem={{
        id: "",
        name: "",
        subject: "",
        classes: "",
        experience: "",
        phone: "",
        email: "",
        qualification: "",
        joiningDate: "",
      }}
      fields={[
        { key: "name", label: "Name" },
        { key: "subject", label: "Subject", type: "select", options: TEACHER_SUBJECTS },
        { key: "classes", label: "Classes", placeholder: "e.g. IX-X" },
        { key: "phone", label: "Phone", placeholder: "+91 98765 43210" },
        { key: "email", label: "Email", placeholder: "teacher@skacademy.edu" },
        { key: "qualification", label: "Qualification", placeholder: "M.Sc. Mathematics" },
        { key: "joiningDate", label: "Joining Date", type: "date" },
        { key: "experience", label: "Experience", placeholder: "10 yrs" },
      ]}
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Name", primary: true },
        { key: "subject", label: "Subject" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "qualification", label: "Qualification" },
        { key: "joiningDate", label: "Joined" },
      ]}
    />
  );
}
