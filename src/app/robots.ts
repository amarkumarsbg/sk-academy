import type { MetadataRoute } from "next";
import { isComingSoonEnabled } from "@/lib/coming-soon";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (
    process.env.CLIENT_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ).replace(/\/$/, "");

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
