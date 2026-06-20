import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteContentProvider } from "@/context/site-content-provider";
import { defaultSiteContent } from "@/data/default-content";
import { fetchSiteContent } from "@/lib/api";
import { mergeStoredSiteContent } from "@/lib/merge-site-content";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  let content = defaultSiteContent;
  try {
    content = mergeStoredSiteContent(await fetchSiteContent());
  } catch {
    // use defaults during build/offline
  }

  const { settings } = content;
  const title = settings.seo?.metaTitle || settings.name;
  const description = settings.seo?.metaDescription || settings.description;

  return {
    title: {
      default: title,
      template: `%s | ${settings.name}`,
    },
    description,
    keywords: settings.seo?.metaKeywords,
    openGraph: {
      title,
      description,
      siteName: settings.name,
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    icons: {
      icon: [{ url: settings.logo || "/logo.png", type: "image/png" }],
      shortcut: [{ url: settings.logo || "/logo.png", type: "image/png" }],
      apple: [{ url: settings.logo || "/logo.png", type: "image/png" }],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialContent = defaultSiteContent;

  try {
    initialContent = mergeStoredSiteContent(await fetchSiteContent());
  } catch {
    // API unavailable during build or before seed — use bundled defaults
  }

  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <SiteContentProvider initialContent={initialContent}>
          <TooltipProvider>{children}</TooltipProvider>
        </SiteContentProvider>
      </body>
    </html>
  );
}
