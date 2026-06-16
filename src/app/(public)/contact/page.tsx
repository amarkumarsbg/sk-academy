import type { Metadata } from "next";
import { ContactPageContent } from "@/components/public/pages/contact-page-content";
export const metadata: Metadata = { title: "Contact Us" };
export default function ContactPage() {
  return <ContactPageContent />;
}
