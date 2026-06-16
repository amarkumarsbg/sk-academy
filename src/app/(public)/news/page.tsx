import type { Metadata } from "next";
import { NewsPageContent } from "@/components/public/pages/news-page-content";
export const metadata: Metadata = { title: "News & Notices" };
export default function NewsPage() {
  return <NewsPageContent />;
}
