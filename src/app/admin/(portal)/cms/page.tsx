"use client";

import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { EditorNote } from "@/components/admin/content-editor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";

const cmsSections = [
  { title: "Site Settings", description: "School info, contact, social links, announcement bar", href: "/admin/settings", preview: "/" },
  { title: "Homepage", description: "Hero slides, stats, features, CTA sections", href: "/admin/cms/homepage", preview: "/" },
  { title: "Highlights", description: "Campus life carousel cards", href: "/admin/cms/highlights", preview: "/" },
  { title: "News & Notices", description: "News articles and published notices", href: "/admin/cms/news", preview: "/news" },
  { title: "Events", description: "School events calendar", href: "/admin/cms/events", preview: "/events" },
  { title: "Gallery", description: "Photo albums on gallery page", href: "/admin/cms/gallery", preview: "/gallery" },
  { title: "About Page", description: "Story, mission, values, leadership", href: "/admin/cms/about", preview: "/about" },
  { title: "Academics Page", description: "Levels, subjects, features", href: "/admin/cms/academics", preview: "/academics" },
  { title: "Admissions Page", description: "Process steps, documents, dates", href: "/admin/cms/admissions", preview: "/admissions" },
  { title: "Contact Page", description: "Hero text and office hours", href: "/admin/cms/contact", preview: "/contact" },
];

export default function CmsPage() {
  return (
    <>
      <AdminHeader title="Website CMS" />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <EditorNote />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cmsSections.map((section) => (
            <Card key={section.href}>
              <CardHeader>
                <CardTitle className="text-base">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
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
          ))}
        </div>
      </div>
    </>
  );
}
