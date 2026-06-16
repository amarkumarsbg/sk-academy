/** Kahalgaon / Bhagalpur area shown in the site footer map. */
export const SCHOOL_MAP_PLACE = "Kahalgaon, Bhagalpur, Bihar, India";

export const SCHOOL_MAP_CENTER: [number, number] = [25.19, 87.24];

export const schoolMapLinkUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SCHOOL_MAP_PLACE)}`;

/** Kept for CMS compatibility — footer uses the interactive map component instead. */
export const schoolMapEmbedUrl = "/images/assembly-hall.png";

export function normalizeMapEmbedUrl(url: string | undefined) {
  if (
    !url ||
    url.includes("google.com/maps") ||
    url.includes("maps.google.com") ||
    url.includes("openstreetmap.org") ||
    url.includes("staticmap.openstreetmap.de")
  ) {
    return schoolMapEmbedUrl;
  }

  return url;
}
