"use client";

import { useEffect, useState } from "react";
import { AddItemButton, CmsPageShell, Field, ImageUploadField, ListItemCard, SectionCard, TextAreaField } from "@/components/admin/cms-form-fields";
import { createId, useSiteContent } from "@/context/site-content-provider";
import type { HighlightItem, HighlightsSection } from "@/types/site-content";

export default function CmsHighlightsPage() {
  const { content, updateContent } = useSiteContent();
  const [highlights, setHighlights] = useState<HighlightItem[]>(content.highlights);
  const [section, setSection] = useState<HighlightsSection>(content.highlightsSection);

  useEffect(() => {
    setHighlights(content.highlights);
    setSection(content.highlightsSection);
  }, [content]);

  const save = () => updateContent((prev) => ({ ...prev, highlights, highlightsSection: section }));

  return (
    <CmsPageShell title="Highlights CMS" onSave={save}>
      <SectionCard title="Section Header">
        <Field label="Label" value={section.label} onChange={(v) => setSection({ ...section, label: v })} />
        <Field label="Title" value={section.title} onChange={(v) => setSection({ ...section, title: v })} />
        <TextAreaField label="Description" value={section.description} onChange={(v) => setSection({ ...section, description: v })} />
      </SectionCard>

      <SectionCard title="Highlight Cards">
        {highlights.map((item, i) => (
          <ListItemCard key={item.id} title={`Highlight ${i + 1}`} onRemove={() => setHighlights(highlights.filter((h) => h.id !== item.id))}>
            <Field label="Title" value={item.title} onChange={(v) => setHighlights(highlights.map((h) => (h.id === item.id ? { ...h, title: v } : h)))} />
            <TextAreaField label="Excerpt" value={item.excerpt} onChange={(v) => setHighlights(highlights.map((h) => (h.id === item.id ? { ...h, excerpt: v } : h)))} />
            <ImageUploadField label="Image" value={item.image} onChange={(v) => setHighlights(highlights.map((h) => (h.id === item.id ? { ...h, image: v } : h)))} />
          </ListItemCard>
        ))}
        <AddItemButton label="Add Highlight" onClick={() => setHighlights([...highlights, { id: createId(), title: "New Highlight", excerpt: "", image: "/logo.png" }])} />
      </SectionCard>
    </CmsPageShell>
  );
}
