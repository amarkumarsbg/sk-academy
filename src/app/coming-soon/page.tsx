import type { Metadata } from "next";
import { ContentImage } from "@/components/public/content-image";
import { formatLaunchDate, getLaunchDate, isComingSoonEnabled } from "@/lib/coming-soon";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Coming Soon",
  description: `${siteConfig.name} website coming soon.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function ComingSoonPage() {
  return (
    <div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(11,45,91,0.12),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(212,160,23,0.14),_transparent_50%)]"
      />
      <div className="relative z-10 flex max-w-xl flex-col items-center gap-8">
        <ContentImage
          src={siteConfig.logo}
          alt={siteConfig.name}
          width={120}
          height={120}
          className="h-24 w-24 rounded-2xl object-contain shadow-sm"
          priority
        />

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary/70">
            {siteConfig.name}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">Coming Soon</h1>
          {isComingSoonEnabled() && (
            <p className="text-lg text-muted-foreground">
              Launching {formatLaunchDate(getLaunchDate())}
            </p>
          )}
        </div>

        {!isComingSoonEnabled() && (
          <p className="text-xs text-muted-foreground">
            Preview mode — set <code className="rounded bg-muted px-1.5 py-0.5">COMING_SOON=true</code>{" "}
            in production to enable this page for visitors.
          </p>
        )}
      </div>
    </div>
  );
}
