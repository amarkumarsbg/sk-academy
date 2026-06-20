export const STUDENT_STATUSES = ["Active", "Inactive", "Graduated"] as const;

export type StudentStatus = (typeof STUDENT_STATUSES)[number];

export const STUDENT_CLASSES = [
  "Nursery",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
] as const;

/** Generate next ID in STU001, STU002, … format (ignores legacy timestamp IDs). */
export function generateNextStudentId(existingIds: string[]): string {
  const numbers = existingIds
    .map((id) => {
      const match = id.match(/^STU(\d{1,4})$/i);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((n): n is number => n !== null && n < 10000);

  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  return `STU${String(next).padStart(3, "0")}`;
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
