import type { Metadata } from "next";
import { EventsPageContent } from "@/components/public/pages/events-page-content";
export const metadata: Metadata = { title: "Events" };
export default function EventsPage() {
  return <EventsPageContent />;
}
