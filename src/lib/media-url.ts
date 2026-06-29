export function getSiteUrl() {
  const fromEnv = process.env.CLIENT_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function isTrustedCdnUrl(url: string) {
  try {
    const host = new URL(url).hostname;
    return (
      host === "res.cloudinary.com" ||
      host.endsWith(".cloudinary.com") ||
      host === "images.unsplash.com"
    );
  } catch {
    return false;
  }
}

export function isValidMediaUrl(url: string) {
  if (!url) return false;
  if (url.startsWith("data:")) return true;
  if (url.startsWith("/images/") || url.startsWith("/logo.png") || url.startsWith("/uploads/")) {
    return true;
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return isTrustedCdnUrl(url);
  }
  return false;
}
