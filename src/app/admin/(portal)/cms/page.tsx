"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ExternalLink, Pencil } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { getCmsSectionSavedAt } from "@/components/admin/cms-toast";
import { formatDateTimeLong } from "@/lib/format-relative-time";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";

const cmsSections = [
  { title: "Site Settings", description: "School info, contact, social links, announcement bar", href: "/admin/settings", preview: "/", storageKey: "cms-settings" },
  { title: "Homepage", description: "Hero slides, stats, features, CTA sections", href: "/admin/cms/homepage", preview: "/", storageKey: "cms-homepage" },
  { title: "Highlights", description: "Campus life carousel cards", href: "/admin/cms/highlights", preview: "/", storageKey: "cms-highlights" },
  { title: "News & Notices", description: "News articles and published notices", href: "/admin/cms/news", preview: "/news", storageKey: "cms-news" },
  { title: "Events", description: "School events calendar", href: "/admin/cms/events", preview: "/events", storageKey: "cms-events" },
  { title: "Gallery", description: "Photo albums on gallery page", href: "/admin/cms/gallery", preview: "/gallery", storageKey: "cms-gallery" },
  { title: "About Page", description: "Story, mission, values, leadership", href: "/admin/cms/about", preview: "/about", storageKey: "cms-about" },
  { title: "Academics Page", description: "Levels, subjects, features", href: "/admin/cms/academics", preview: "/academics", storageKey: "cms-academics" },
  { title: "Admissions Page", description: "Process steps, documents, dates", href: "/admin/cms/admissions", preview: "/admissions", storageKey: "cms-admissions" },
  { title: "Contact Page", description: "Hero text and office hours", href: "/admin/cms/contact", preview: "/contact", storageKey: "cms-contact" },
];

export default function CmsPage() {
  const [savedAt, setSavedAt] = useState<Record<string, Date | null>>({});

  useEffect(() => {
    setSavedAt(
      Object.fromEntries(cmsSections.map((section) => [section.storageKey, getCmsSectionSavedAt(section.storageKey)]))
    );
  }, []);

  return (
    <>
      <AdminHeader title="Website CMS" />
      <div className="p-4 pb-8 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
          <Link href="/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
            Preview website ↗
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cmsSections.map((section) => {
            const lastSaved = savedAt[section.storageKey];
            return (
              <Card key={section.href}>
                <CardHeader>
                  <CardTitle className="text-base">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                  {lastSaved && (
                    <p className="text-xs text-muted-foreground">
                      Last updated: {formatDateTimeLong(lastSaved)}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <ButtonLink href={section.href} size="sm">
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                  </ButtonLink>
                  <ButtonLink href={section.preview} size="sm" variant="outline" target="_blank">
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Preview
                  </ButtonLink>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
