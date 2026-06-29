import { defaultSiteContent } from "@/data/default-content";
import { normalizeMapEmbedUrl } from "@/lib/school-map";
import type { SiteContent } from "@/types/site-content";

const OFFICIAL_LOGO = "/logo.png?v=2";

function collectMediaUrls(content: SiteContent) {
  return [
    content.settings.logo,
    content.footer.backgroundImage,
    ...content.heroSlides.map((slide) => slide.image),
    ...content.highlights.map((item) => item.image),
    ...content.news.map((item) => item.image),
    ...content.gallery.flatMap((album) => [album.cover, ...(album.photos ?? [])]),
  ];
}

function usesStockPhotos(content: SiteContent) {
  return collectMediaUrls(content).some((url) => url.includes("unsplash.com"));
}

function usesBrokenMedia(content: SiteContent) {
  return collectMediaUrls(content).some((url) => {
    if (!url) return true;
    if (url.startsWith("data:")) return false;
    if (url.startsWith("/images/") || url.startsWith("/logo.png")) return false;
    if (url.startsWith("http")) return true;
    return true;
  });
}

function applySchoolPhotos(content: SiteContent): SiteContent {
  return {
    ...content,
    settings: {
      ...content.settings,
      logo: OFFICIAL_LOGO,
    },
    heroSlides: defaultSiteContent.heroSlides,
    highlights: defaultSiteContent.highlights,
    news: defaultSiteContent.news,
    gallery: defaultSiteContent.gallery,
    footer: defaultSiteContent.footer,
  };
}

export function mergeStoredSiteContent(stored: Partial<SiteContent>): SiteContent {
  const merged: SiteContent = {
    ...defaultSiteContent,
    ...stored,
    settings: {
      ...defaultSiteContent.settings,
      ...stored.settings,
      logo: OFFICIAL_LOGO,
      social: { ...defaultSiteContent.settings.social, ...stored.settings?.social },
      seo: { ...defaultSiteContent.settings.seo, ...stored.settings?.seo },
      theme: { ...defaultSiteContent.settings.theme, ...stored.settings?.theme },
    },
    announcement: { ...defaultSiteContent.announcement, ...stored.announcement },
    highlightsSection: { ...defaultSiteContent.highlightsSection, ...stored.highlightsSection },
    homepage: { ...defaultSiteContent.homepage, ...stored.homepage },
    about: { ...defaultSiteContent.about, ...stored.about },
    academics: { ...defaultSiteContent.academics, ...stored.academics },
    admissions: { ...defaultSiteContent.admissions, ...stored.admissions },
    contact: { ...defaultSiteContent.contact, ...stored.contact },
    footer: {
      ...defaultSiteContent.footer,
      ...stored.footer,
      mapEmbedUrl: normalizeMapEmbedUrl(stored.footer?.mapEmbedUrl),
      schoolTimings: stored.contact?.officeHours ?? defaultSiteContent.contact.officeHours,
    },
    pageHeroes: { ...defaultSiteContent.pageHeroes, ...stored.pageHeroes },
    heroSlides: stored.heroSlides ?? defaultSiteContent.heroSlides,
    highlights: stored.highlights ?? defaultSiteContent.highlights,
    stats: stored.stats ?? defaultSiteContent.stats,
    news: (stored.news ?? defaultSiteContent.news).map((item) => {
      const fallback = defaultSiteContent.news.find((entry) => entry.id === item.id);
      return {
        ...item,
        body: item.body?.trim() ? item.body : fallback?.body,
      };
    }),
    events: stored.events ?? defaultSiteContent.events,
    notices: stored.notices ?? defaultSiteContent.notices,
    gallery: stored.gallery ?? defaultSiteContent.gallery,
  };

  if (usesStockPhotos(merged) || usesBrokenMedia(merged)) {
    return applySchoolPhotos(merged);
  }

  return merged;
}
