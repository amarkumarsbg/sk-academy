import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteContentProvider } from "@/context/site-content-provider";
import { defaultSiteContent } from "@/data/default-content";
import { fetchSiteContent } from "@/lib/api";
import { mergeStoredSiteContent } from "@/lib/merge-site-content";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png", type: "image/png" }],
  },
};

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
