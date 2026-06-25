import type { MetadataRoute } from "next";
import { fetchSiteContent } from "@/lib/api";
import { isComingSoonEnabled } from "@/lib/coming-soon";
import { mergeStoredSiteContent } from "@/lib/merge-site-content";

const staticRoutes = [
  "",
  "/about",
  "/academics",
  "/admissions",
  "/contact",
  "/events",
  "/news",
  "/gallery",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isComingSoonEnabled()) {
    return [];
  }

  const baseUrl = (
    process.env.CLIENT_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ).replace(/\/$/, "");

  let content;
  try {
    content = mergeStoredSiteContent(await fetchSiteContent());
  } catch {
    content = null;
  }

  const routes: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  if (content) {
    for (const item of content.news.filter((n) => (n.status ?? "Published") === "Published")) {
      routes.push({ url: `${baseUrl}/news/${item.id}`, lastModified: new Date(item.date), changeFrequency: "monthly", priority: 0.6 });
    }
    for (const event of content.events) {
      routes.push({ url: `${baseUrl}/events/${event.id}`, lastModified: new Date(event.date), changeFrequency: "monthly", priority: 0.6 });
    }
    for (const album of content.gallery) {
      routes.push({ url: `${baseUrl}/gallery/${album.id}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 });
    }
  }

  return routes;
}
