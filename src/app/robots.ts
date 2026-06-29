import type { MetadataRoute } from "next";
import { isComingSoonEnabled } from "@/lib/coming-soon";
import { getSiteUrl } from "@/lib/media-url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  if (isComingSoonEnabled()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
