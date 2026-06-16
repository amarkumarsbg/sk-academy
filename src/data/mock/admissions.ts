import type { ImportantDate } from "@/types/site-content";

export const admissionsSteps = [
  { step: 1, title: "Inquiry", description: "Submit online inquiry or visit the admission office." },
  { step: 2, title: "Application", description: "Complete the application form with required documents." },
  { step: 3, title: "Assessment", description: "Entrance interaction/assessment for eligible grades." },
  { step: 4, title: "Confirmation", description: "Fee payment and enrollment confirmation." },
];

export const admissionsEligibilityItems = [
  "Age-appropriate grade as per CBSE norms",
  "Birth certificate (original + copy)",
  "Previous school transfer certificate",
  "Passport-size photographs (4 nos.)",
  "Aadhaar card of student and parent",
  "Previous class report card / mark sheet",
];

export const admissionsImportantDates: ImportantDate[] = [
  { label: "Application Opens", date: "January 1, 2026" },
  { label: "Last Date to Apply", date: "March 31, 2026" },
  { label: "Entrance Interaction", date: "April 15–30, 2026" },
  { label: "Session Begins", date: "April 1, 2026" },
];

export const OFFICE_HOURS = [
  "Monday – Friday: 7:30 AM – 2:30 PM",
  "Saturday: 8:00 AM – 12:00 PM (Office & Admissions)",
  "Sunday & Holidays: Closed",
] as const;
