"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AddItemButton, CmsPageShell, EmptyState, Field, ImageUploadField, ListItemCard, SectionCard, TextAreaField } from "@/components/admin/cms-form-fields";
import { createId, useSiteContent } from "@/context/site-content-provider";
import { useCmsPageDraft } from "@/hooks/use-cms-draft";
import type { HighlightItem, HighlightsSection } from "@/types/site-content";

export default function CmsHighlightsPage() {
  const { content, updateContent, saving } = useSiteContent();
  const [highlights, setHighlights] = useState<HighlightItem[]>(content.highlights);
  const [section, setSection] = useState<HighlightsSection>(content.highlightsSection);

  useEffect(() => {
    setHighlights(content.highlights);
    setSection(content.highlightsSection);
  }, [content]);

  const saved = useMemo(
    () => ({ highlights: content.highlights, section: content.highlightsSection }),
    [content]
  );
  const draft = useMemo(() => ({ highlights, section }), [highlights, section]);
  const reset = useCallback(() => {
    setHighlights(content.highlights);
    setSection(content.highlightsSection);
  }, [content]);
  const { isDirty, onCancel } = useCmsPageDraft(saved, draft, reset);

  const save = () => updateContent((prev) => ({ ...prev, highlights, highlightsSection: section }));

  return (
    <CmsPageShell
      title="Highlights CMS"
      onSave={save}
      saving={saving}
      isDirty={isDirty}
      onCancel={onCancel}
      storageKey="cms-highlights"
      previewHref="/"
    >
      <SectionCard title="Section Header">
        <Field label="Label" value={section.label} onChange={(v) => setSection({ ...section, label: v })} />
        <Field label="Title" value={section.title} onChange={(v) => setSection({ ...section, title: v })} />
        <TextAreaField label="Description" value={section.description} onChange={(v) => setSection({ ...section, description: v })} maxLength={300} />
      </SectionCard>

      <SectionCard title="Highlight Cards">
        {highlights.length === 0 ? (
          <EmptyState message="No highlights found." actionLabel="Add Highlight" onAction={() => setHighlights([{ id: createId(), title: "New Highlight", excerpt: "", image: "/logo.png" }])} />
        ) : (
          highlights.map((item, i) => (
            <ListItemCard
              key={item.id}
              title={`Highlight ${i + 1}`}
              deleteLabel={`Delete highlight ${i + 1}? This action cannot be undone.`}
              onRemove={() => setHighlights(highlights.filter((h) => h.id !== item.id))}
            >
              <Field label="Title" value={item.title} onChange={(v) => setHighlights(highlights.map((h) => (h.id === item.id ? { ...h, title: v } : h)))} />
              <TextAreaField label="Excerpt" value={item.excerpt} onChange={(v) => setHighlights(highlights.map((h) => (h.id === item.id ? { ...h, excerpt: v } : h)))} maxLength={200} />
              <ImageUploadField label="Image" value={item.image} onChange={(v) => setHighlights(highlights.map((h) => (h.id === item.id ? { ...h, image: v } : h)))} />
            </ListItemCard>
          ))
        )}
        {highlights.length > 0 && (
          <AddItemButton label="Add Highlight" onClick={() => setHighlights([...highlights, { id: createId(), title: "New Highlight", excerpt: "", image: "/logo.png" }])} />
        )}
      </SectionCard>
    </CmsPageShell>
  );
}
