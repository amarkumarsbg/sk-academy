import type { Metadata } from "next";
import { EventsPageContent } from "@/components/public/pages/events-page-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(
  "Events",
  "Stay updated on SK Academy events — meetings, cultural programs, exams, workshops, and sports."
);

export default function EventsPage() {
  return <EventsPageContent />;
}
