import type { Metadata } from "next";
import { ContactPageContent } from "@/components/public/pages/contact-page-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(
  "Contact Us",
  "Get in touch with SK Academy for admissions, inquiries, and general information. Kahalgaon, Bhagalpur."
);

export default function ContactPage() {
  return <ContactPageContent />;
}
