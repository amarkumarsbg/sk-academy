"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Globe, Image, Palette, Phone, Search, Settings2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { CmsStickyFooter, Field, ImageUploadField, SectionCard, TextAreaField } from "@/components/admin/cms-form-fields";
import { markCmsSectionSaved, useCmsToast } from "@/components/admin/cms-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uploadDocument } from "@/lib/api";
import { useCmsPageDraft } from "@/hooks/use-cms-draft";
import { useSiteContent } from "@/context/site-content-provider";
import type { AnnouncementContent, SiteSettings } from "@/types/site-content";

const tabItems = [
  { value: "general", label: "General", icon: Settings2 },
  { value: "contact", label: "Contact", icon: Phone },
  { value: "social", label: "Social", icon: Globe },
  { value: "seo", label: "SEO", icon: Search },
  { value: "logo", label: "Logo", icon: Image },
  { value: "theme", label: "Theme", icon: Palette },
] as const;

export function SettingsPageContent() {
  const { content, updateContent, resetContent, saving, lastSavedAt } = useSiteContent();
  const { showToast } = useCmsToast();
  const [settings, setSettings] = useState<SiteSettings>(content.settings);
  const [announcement, setAnnouncement] = useState<AnnouncementContent>(content.announcement);
  const [footerImage, setFooterImage] = useState(content.footer.backgroundImage);
  const [brochureUrl, setBrochureUrl] = useState(content.footer.brochureUrl);
  const [brochureUploading, setBrochureUploading] = useState(false);

  useEffect(() => {
    setSettings(content.settings);
    setAnnouncement(content.announcement);
    setFooterImage(content.footer.backgroundImage);
    setBrochureUrl(content.footer.brochureUrl);
  }, [content]);

  const savedSnapshot = useMemo(
    () => ({
      settings: content.settings,
      announcement: content.announcement,
      footerImage: content.footer.backgroundImage,
      brochureUrl: content.footer.brochureUrl,
    }),
    [content]
  );
  const draftSnapshot = useMemo(
    () => ({ settings, announcement, footerImage, brochureUrl }),
    [settings, announcement, footerImage, brochureUrl]
  );
  const resetDraft = useCallback(() => {
    setSettings(content.settings);
    setAnnouncement(content.announcement);
    setFooterImage(content.footer.backgroundImage);
    setBrochureUrl(content.footer.brochureUrl);
  }, [content]);
  const { isDirty, onCancel } = useCmsPageDraft(savedSnapshot, draftSnapshot, resetDraft);

  const save = async () => {
    await updateContent((prev) => ({
      ...prev,
      settings,
      announcement,
      footer: { ...prev.footer, backgroundImage: footerImage, brochureUrl },
    }));
    markCmsSectionSaved("cms-settings");
    showToast("Settings saved successfully");
  };

  return (
    <>
      <AdminHeader title="Settings" />
      <div className="p-4 pb-28 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <Link href="/admin/cms" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to CMS
            </Link>
            <Link href="/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
              Preview website ↗
            </Link>
          </div>
          <div className="mx-auto max-w-2xl">
            <Tabs defaultValue="general">
              <TabsList className="mb-6 flex h-auto w-full flex-wrap gap-1">
                {tabItems.map(({ value, label, icon: Icon }) => (
                  <TabsTrigger key={value} value={value} className="gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <SectionCard title="School Information" description="Basic details shown across the public website.">
                  <Field label="School Name" value={settings.name} onChange={(v) => setSettings({ ...settings, name: v })} />
                  <Field label="Tagline" value={settings.tagline} onChange={(v) => setSettings({ ...settings, tagline: v })} />
                  <TextAreaField label="Description" value={settings.description} onChange={(v) => setSettings({ ...settings, description: v })} rows={4} maxLength={500} />
                  <Field label="Location" value={settings.location} onChange={(v) => setSettings({ ...settings, location: v })} />
                  <Field label="Established Year" value={settings.establishedYear} type="number" onChange={(v) => setSettings({ ...settings, establishedYear: Number(v) || 2011 })} />
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
                <SectionCard title="Footer & Downloads">
                  <ImageUploadField label="Background image" value={footerImage} onChange={setFooterImage} />
                  <Field label="Brochure URL" value={brochureUrl} onChange={setBrochureUrl} placeholder="https://... or upload PDF below" />
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Upload brochure PDF</Label>
                    <input
                      type="file"
                      accept="application/pdf"
                      disabled={brochureUploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setBrochureUploading(true);
                        try {
                          setBrochureUrl(await uploadDocument(file));
                        } finally {
                          setBrochureUploading(false);
                          e.target.value = "";
                        }
                      }}
                      className="block w-full text-sm"
                    />
                    {brochureUploading && <p className="text-xs text-muted-foreground">Uploading brochure…</p>}
                    {brochureUrl && (
                      <a href={brochureUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                        View current brochure ↗
                      </a>
                    )}
                  </div>
                </SectionCard>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <SectionCard title="Contact Information">
                  <Field label="Email" value={settings.email} onChange={(v) => setSettings({ ...settings, email: v })} />
                  <Field label="Admissions Email" value={settings.admissionsEmail} onChange={(v) => setSettings({ ...settings, admissionsEmail: v })} />
                  <Field label="Phone" value={settings.phone} onChange={(v) => setSettings({ ...settings, phone: v })} />
                  <Field label="WhatsApp Number" value={settings.whatsapp} onChange={(v) => setSettings({ ...settings, whatsapp: v })} />
                  <Field label="Address" value={settings.address} onChange={(v) => setSettings({ ...settings, address: v })} />
                </SectionCard>
              </TabsContent>

              <TabsContent value="social" className="space-y-6">
                <SectionCard title="Social Media Links">
                  <Field label="Facebook" value={settings.social.facebook} onChange={(v) => setSettings({ ...settings, social: { ...settings.social, facebook: v } })} />
                  <Field label="Instagram" value={settings.social.instagram} onChange={(v) => setSettings({ ...settings, social: { ...settings.social, instagram: v } })} />
                  <Field label="YouTube" value={settings.social.youtube} onChange={(v) => setSettings({ ...settings, social: { ...settings.social, youtube: v } })} />
                </SectionCard>
              </TabsContent>

              <TabsContent value="seo" className="space-y-6">
                <SectionCard title="Search Engine Optimization" description="Meta tags used for search engines and link previews.">
                  <Field label="Meta Title" value={settings.seo.metaTitle} onChange={(v) => setSettings({ ...settings, seo: { ...settings.seo, metaTitle: v } })} />
                  <TextAreaField label="Meta Description" value={settings.seo.metaDescription} onChange={(v) => setSettings({ ...settings, seo: { ...settings.seo, metaDescription: v } })} rows={3} maxLength={160} />
                  <Field label="Meta Keywords" value={settings.seo.metaKeywords} onChange={(v) => setSettings({ ...settings, seo: { ...settings.seo, metaKeywords: v } })} placeholder="school, education, academy" />
                </SectionCard>
              </TabsContent>

              <TabsContent value="logo" className="space-y-6">
                <SectionCard title="School Logo">
                  <ImageUploadField label="Logo" value={settings.logo} onChange={(v) => setSettings({ ...settings, logo: v })} previewClassName="aspect-square max-h-40" />
                </SectionCard>
              </TabsContent>

              <TabsContent value="theme" className="space-y-6">
                <SectionCard title="Theme Colors" description="Brand colors used across the public website.">
                  <Field label="Primary Color" value={settings.theme.primaryColor} type="color" onChange={(v) => setSettings({ ...settings, theme: { ...settings.theme, primaryColor: v } })} />
                  <Field label="Accent Color" value={settings.theme.accentColor} type="color" onChange={(v) => setSettings({ ...settings, theme: { ...settings.theme, accentColor: v } })} />
                  <div className="flex gap-3 pt-2">
                    <div className="h-10 flex-1 rounded-md" style={{ backgroundColor: settings.theme.primaryColor }} />
                    <div className="h-10 flex-1 rounded-md" style={{ backgroundColor: settings.theme.accentColor }} />
                  </div>
                </SectionCard>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (confirm("Reset all website content to defaults? This cannot be undone.")) resetContent();
                }}
              >
                Reset All Content to Defaults
              </Button>
            </div>
          </div>
      </div>
      <CmsStickyFooter isDirty={isDirty} saving={saving} lastSavedAt={lastSavedAt} onSave={save} onCancel={onCancel} />
    </>
  );
}
