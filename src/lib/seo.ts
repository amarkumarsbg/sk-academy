import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { getSiteUrl } from "@/lib/media-url";

export function createPageMetadata(title: string, description: string): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    openGraph: {
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
