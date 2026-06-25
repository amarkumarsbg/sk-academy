import { defaultSiteContent } from "@/data/default-content";
import { fetchSiteContent } from "@/lib/api";
import { mergeStoredSiteContent } from "@/lib/merge-site-content";

function getBaseUrl() {
  return (
    process.env.CLIENT_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ).replace(/\/$/, "");
}

export async function OrganizationJsonLd() {
  let content = defaultSiteContent;

  try {
    content = mergeStoredSiteContent(await fetchSiteContent());
  } catch {
    // use defaults during build/offline
  }

  const { settings } = content;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "School",
    name: settings.name,
    description: settings.description,
    url: getBaseUrl(),
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: settings.location,
      addressCountry: "IN",
    },
    foundingDate: String(settings.establishedYear),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
