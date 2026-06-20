import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(
  "Privacy Policy",
  "Privacy policy for SK Academy website visitors and form submissions."
);

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: June 2026</p>

      <div className="prose prose-sm mt-8 max-w-none text-muted-foreground">
        <p>
          SK Academy respects your privacy. This policy explains how we collect, use, and protect information when you
          visit our website or submit forms.
        </p>
        <h2>Information we collect</h2>
        <ul>
          <li>Contact form: name, email, and message content</li>
          <li>Admission inquiry: parent/student name, phone, email, and grade</li>
          <li>Basic technical data such as browser type and pages visited</li>
        </ul>
        <h2>How we use information</h2>
        <p>
          We use submitted information to respond to inquiries, process admission interest, and improve our services.
          We do not sell personal data to third parties.
        </p>
        <h2>Data storage</h2>
        <p>
          Form submissions are stored securely in our school management system and accessed only by authorized staff.
        </p>
        <h2>Contact</h2>
        <p>
          For privacy questions, contact us via the{" "}
          <Link href="/contact" className="text-primary hover:underline">
            contact page
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
