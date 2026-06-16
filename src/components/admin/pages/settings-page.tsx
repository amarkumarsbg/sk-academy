"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { EditorNote, SaveButton } from "@/components/admin/content-editor";
import { Field, ImageUploadField, SectionCard, TextAreaField } from "@/components/admin/cms-form-fields";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSiteContent } from "@/context/site-content-provider";
import type { AnnouncementContent, SiteSettings } from "@/types/site-content";

export function SettingsPageContent() {
  const { content, updateContent, resetContent } = useSiteContent();
  const [settings, setSettings] = useState<SiteSettings>(content.settings);
  const [announcement, setAnnouncement] = useState<AnnouncementContent>(content.announcement);
  const [footerImage, setFooterImage] = useState(content.footer.backgroundImage);

  useEffect(() => {
    setSettings(content.settings);
    setAnnouncement(content.announcement);
    setFooterImage(content.footer.backgroundImage);
  }, [content]);

  const save = () => {
    updateContent((prev) => ({
      ...prev,
      settings,
      announcement,
      footer: { ...prev.footer, backgroundImage: footerImage },
    }));
  };

  return (
    <>
      <AdminHeader title="Settings" />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <EditorNote />
        <div className="mx-auto max-w-2xl space-y-6">
          <SectionCard title="School Information" description="Basic details shown across the public website.">
            <Field label="School Name" value={settings.name} onChange={(v) => setSettings({ ...settings, name: v })} />
            <Field label="Tagline" value={settings.tagline} onChange={(v) => setSettings({ ...settings, tagline: v })} />
            <TextAreaField label="Description" value={settings.description} onChange={(v) => setSettings({ ...settings, description: v })} rows={4} />
            <Field label="Location" value={settings.location} onChange={(v) => setSettings({ ...settings, location: v })} />
            <Field label="Established Year" value={settings.establishedYear} type="number" onChange={(v) => setSettings({ ...settings, establishedYear: Number(v) || 2011 })} />
            <ImageUploadField
              label="School logo"
              value={settings.logo}
              onChange={(v) => setSettings({ ...settings, logo: v })}
              previewClassName="aspect-square max-h-32"
            />
          </SectionCard>

          <SectionCard title="Contact">
            <Field label="Email" value={settings.email} onChange={(v) => setSettings({ ...settings, email: v })} />
            <Field label="Admissions Email" value={settings.admissionsEmail} onChange={(v) => setSettings({ ...settings, admissionsEmail: v })} />
            <Field label="Phone" value={settings.phone} onChange={(v) => setSettings({ ...settings, phone: v })} />
            <Field label="WhatsApp Number" value={settings.whatsapp} onChange={(v) => setSettings({ ...settings, whatsapp: v })} />
            <Field label="Address" value={settings.address} onChange={(v) => setSettings({ ...settings, address: v })} />
          </SectionCard>

          <SectionCard title="Social Links">
            <Field label="Facebook" value={settings.social.facebook} onChange={(v) => setSettings({ ...settings, social: { ...settings.social, facebook: v } })} />
            <Field label="Instagram" value={settings.social.instagram} onChange={(v) => setSettings({ ...settings, social: { ...settings.social, instagram: v } })} />
            <Field label="YouTube" value={settings.social.youtube} onChange={(v) => setSettings({ ...settings, social: { ...settings.social, youtube: v } })} />
          </SectionCard>

          <SectionCard title="Academic Year">
            <Field label="Session" value={settings.academicSession} onChange={(v) => setSettings({ ...settings, academicSession: v })} />
            <Field label="Start Date" value={settings.sessionStartDate} type="date" onChange={(v) => setSettings({ ...settings, sessionStartDate: v })} />
          </SectionCard>

          <SectionCard title="Announcement Bar" description="Scrolling banner at the top of every public page.">
            <Field label="Message" value={announcement.message} onChange={(v) => setAnnouncement({ ...announcement, message: v })} />
            <Field label="Link Text" value={announcement.linkText} onChange={(v) => setAnnouncement({ ...announcement, linkText: v })} />
            <Field label="Link URL" value={announcement.linkHref} onChange={(v) => setAnnouncement({ ...announcement, linkHref: v })} />
          </SectionCard>

          <SectionCard title="Footer">
            <ImageUploadField label="Background image" value={footerImage} onChange={setFooterImage} />
          </SectionCard>

          <div className="flex flex-wrap gap-3">
            <SaveButton onSave={save} />
            <Button type="button" variant="outline" onClick={() => { if (confirm("Reset all website content to defaults?")) resetContent(); }}>
              Reset All Content
            </Button>
          </div>

          <CardNote />
        </div>
      </div>
    </>
  );
}

function CardNote() {
  return (
    <div className="rounded-lg border border-dashed p-4">
      <p className="text-sm text-muted-foreground">
        Settings save locally in your browser. Backend database sync is planned for a later phase.
      </p>
      <Separator className="my-4" />
      <p className="text-xs text-muted-foreground">Planned: PostgreSQL + Prisma · Auth.js · REST/tRPC API</p>
    </div>
  );
}
