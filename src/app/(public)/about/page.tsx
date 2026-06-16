import type { Metadata } from "next";
import { AboutPageContent } from "@/components/public/pages/about-page-content";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return <AboutPageContent />;
}
