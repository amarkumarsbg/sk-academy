import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(
  "Terms of Use",
  "Terms and conditions for using the SK Academy website."
);

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-3xl font-bold">Terms of Use</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: June 2026</p>

      <div className="prose prose-sm mt-8 max-w-none text-muted-foreground">
        <p>
          By using the SK Academy website, you agree to these terms. If you do not agree, please do not use this site.
        </p>
        <h2>Use of website</h2>
        <p>
          Content on this website is provided for general information about our school. We strive to keep information
          accurate but do not guarantee completeness at all times.
        </p>
        <h2>Form submissions</h2>
        <p>
          Information submitted through contact or admission forms must be accurate. Misuse of forms may result in
          rejection of inquiries.
        </p>
        <h2>Intellectual property</h2>
        <p>
          Text, images, logos, and other materials on this site belong to SK Academy unless otherwise stated. Do not
          reproduce content without permission.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent through our{" "}
          <Link href="/contact" className="text-primary hover:underline">
            contact page
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
