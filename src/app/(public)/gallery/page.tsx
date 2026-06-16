import type { Metadata } from "next";
import { GalleryPageContent } from "@/components/public/pages/gallery-page-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(
  "Gallery",
  "Browse photos from SK Academy — events, campus life, annual functions, and student achievements."
);

export default function GalleryPage() {
  return <GalleryPageContent />;
}
