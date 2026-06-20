"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AddItemButton, CmsPageShell, Field, ImageUploadField, ListItemCard, SectionCard, TextAreaField } from "@/components/admin/cms-form-fields";
import { useSiteContent } from "@/context/site-content-provider";
import { useCmsPageDraft } from "@/hooks/use-cms-draft";
import type { AboutContent } from "@/types/site-content";

export default function CmsAboutPage() {
  const { content, updateContent, saving } = useSiteContent();
  const [about, setAbout] = useState<AboutContent>(content.about);

  useEffect(() => setAbout(content.about), [content]);

  const saved = useMemo(() => content.about, [content]);
  const reset = useCallback(() => setAbout(content.about), [content]);
  const { isDirty, onCancel } = useCmsPageDraft(saved, about, reset);

  const save = () => updateContent((prev) => ({ ...prev, about }));

  return (
    <CmsPageShell
      title="About Page CMS"
      onSave={save}
      saving={saving}
      isDirty={isDirty}
      onCancel={onCancel}
      storageKey="cms-about"
      previewHref="/about"
    >
      <SectionCard title="Page Hero">
        <Field label="Title" value={about.hero.title} onChange={(v) => setAbout({ ...about, hero: { ...about.hero, title: v } })} />
        <TextAreaField label="Description" value={about.hero.description} onChange={(v) => setAbout({ ...about, hero: { ...about.hero, description: v } })} maxLength={300} />
      </SectionCard>

      <SectionCard title="Our Story">
        <Field label="Title" value={about.storyTitle} onChange={(v) => setAbout({ ...about, storyTitle: v })} />
        {about.storyParagraphs.map((para, i) => (
          <ListItemCard key={i} title={`Paragraph ${i + 1}`} deleteLabel={`Delete paragraph ${i + 1}?`} onRemove={() => setAbout({ ...about, storyParagraphs: about.storyParagraphs.filter((_, idx) => idx !== i) })}>
            <TextAreaField label="Text" value={para} onChange={(v) => setAbout({ ...about, storyParagraphs: about.storyParagraphs.map((p, idx) => (idx === i ? v : p)) })} maxLength={800} />
          </ListItemCard>
        ))}
        <AddItemButton label="Add Paragraph" onClick={() => setAbout({ ...about, storyParagraphs: [...about.storyParagraphs, ""] })} />
      </SectionCard>

      <SectionCard title="Mission & Vision">
        <TextAreaField label="Mission" value={about.mission} onChange={(v) => setAbout({ ...about, mission: v })} maxLength={500} />
        <TextAreaField label="Vision" value={about.vision} onChange={(v) => setAbout({ ...about, vision: v })} maxLength={500} />
      </SectionCard>

      <SectionCard title="Core Values">
        {about.values.map((value, i) => (
          <ListItemCard key={i} title={`Value ${i + 1}`} deleteLabel={`Delete value ${i + 1}?`} onRemove={() => setAbout({ ...about, values: about.values.filter((_, idx) => idx !== i) })}>
            <Field label="Title" value={value.title} onChange={(v) => setAbout({ ...about, values: about.values.map((val, idx) => (idx === i ? { ...val, title: v } : val)) })} />
            <TextAreaField label="Description" value={value.description} onChange={(v) => setAbout({ ...about, values: about.values.map((val, idx) => (idx === i ? { ...val, description: v } : val)) })} maxLength={200} />
          </ListItemCard>
        ))}
        <AddItemButton label="Add Value" onClick={() => setAbout({ ...about, values: [...about.values, { title: "New Value", description: "" }] })} />
      </SectionCard>

      <SectionCard title="Leadership">
        {about.leadership.map((person, i) => (
          <ListItemCard key={i} title={person.name || `Leader ${i + 1}`} deleteLabel={`Delete ${person.name || "this leader"}?`} onRemove={() => setAbout({ ...about, leadership: about.leadership.filter((_, idx) => idx !== i) })}>
            <ImageUploadField label="Photo" value={person.photo ?? ""} onChange={(v) => setAbout({ ...about, leadership: about.leadership.map((p, idx) => (idx === i ? { ...p, photo: v || undefined } : p)) })} previewClassName="aspect-square max-h-32" />
            <Field label="Name" value={person.name} onChange={(v) => setAbout({ ...about, leadership: about.leadership.map((p, idx) => (idx === i ? { ...p, name: v } : p)) })} />
            <Field label="Role" value={person.role} onChange={(v) => setAbout({ ...about, leadership: about.leadership.map((p, idx) => (idx === i ? { ...p, role: v } : p)) })} />
            <TextAreaField label="Bio" value={person.bio} onChange={(v) => setAbout({ ...about, leadership: about.leadership.map((p, idx) => (idx === i ? { ...p, bio: v } : p)) })} maxLength={400} />
          </ListItemCard>
        ))}
        <AddItemButton label="Add Leader" onClick={() => setAbout({ ...about, leadership: [...about.leadership, { name: "", role: "", bio: "" }] })} />
      </SectionCard>
    </CmsPageShell>
  );
}
