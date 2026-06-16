import type { Metadata } from "next";
import { AdmissionsPageContent } from "@/components/public/pages/admissions-page-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(
  "Admissions",
  "Apply to SK Academy for 2026–27. View admission process, eligibility, important dates, and submit an inquiry."
);

export default function AdmissionsPage() {
  return <AdmissionsPageContent />;
}
