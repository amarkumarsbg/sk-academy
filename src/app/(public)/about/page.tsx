import type { Metadata } from "next";
import { AboutPageContent } from "@/components/public/pages/about-page-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(
  "About Us",
  "Learn about SK Academy's mission, values, leadership, and legacy of excellence in Kahalgaon, Bhagalpur."
);

export default function AboutPage() {
  return <AboutPageContent />;
}
