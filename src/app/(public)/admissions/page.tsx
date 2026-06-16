import type { Metadata } from "next";
import { AdmissionsPageContent } from "@/components/public/pages/admissions-page-content";
export const metadata: Metadata = { title: "Admissions" };
export default function AdmissionsPage() {
  return <AdmissionsPageContent />;
}
