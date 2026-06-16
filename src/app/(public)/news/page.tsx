import type { Metadata } from "next";
import { NewsPageContent } from "@/components/public/pages/news-page-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(
  "News & Notices",
  "Latest news, notices, achievements, and announcements from SK Academy, Kahalgaon."
);

export default function NewsPage() {
  return <NewsPageContent />;
}
