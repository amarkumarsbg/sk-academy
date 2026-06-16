import type { Metadata } from "next";
import { AcademicsPageContent } from "@/components/public/pages/academics-page-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(
  "Academics",
  "Explore SK Academy's CBSE curriculum from primary to senior secondary with smart classrooms and expert faculty."
);

export default function AcademicsPage() {
  return <AcademicsPageContent />;
}
