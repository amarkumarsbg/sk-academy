import type { Metadata } from "next";
import { GalleryPageContent } from "@/components/public/pages/gallery-page-content";
export const metadata: Metadata = { title: "Gallery" };
export default function GalleryPage() {
  return <GalleryPageContent />;
}
