import type { Metadata } from "next";
import { HomePageContent } from "@/components/public/pages/home-page-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(
  "Home",
  "SK Academy — CBSE school in Kahalgaon, Bhagalpur. Quality education, modern facilities, and holistic development."
);

export default function HomePage() {
  return <HomePageContent />;
}
