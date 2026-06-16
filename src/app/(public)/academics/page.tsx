import type { Metadata } from "next";
import { AcademicsPageContent } from "@/components/public/pages/academics-page-content";
export const metadata: Metadata = { title: "Academics" };
export default function AcademicsPage() {
  return <AcademicsPageContent />;
}
