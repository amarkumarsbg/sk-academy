"use client";

import { useSiteContent } from "@/context/site-content-provider";

export function OrganizationJsonLd() {
  const { content } = useSiteContent();
  const { settings } = content;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "School",
    name: settings.name,
    description: settings.description,
    url: typeof window !== "undefined" ? window.location.origin : "",
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
