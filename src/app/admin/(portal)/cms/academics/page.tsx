"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AddItemButton, CmsPageShell, Field, ListItemCard, SectionCard, TextAreaField } from "@/components/admin/cms-form-fields";
import { useSiteContent } from "@/context/site-content-provider";
import { useCmsPageDraft } from "@/hooks/use-cms-draft";
import type { AcademicsContent } from "@/types/site-content";

export default function CmsAcademicsPage() {
  const { content, updateContent, saving } = useSiteContent();
  const [academics, setAcademics] = useState<AcademicsContent>(content.academics);

  useEffect(() => setAcademics(content.academics), [content]);

  const saved = useMemo(() => content.academics, [content]);
  const reset = useCallback(() => setAcademics(content.academics), [content]);
  const { isDirty, onCancel } = useCmsPageDraft(saved, academics, reset);

  const save = () => updateContent((prev) => ({ ...prev, academics }));

  return (
    <CmsPageShell
      title="Academics Page CMS"
      onSave={save}
      saving={saving}
      isDirty={isDirty}
      onCancel={onCancel}
      storageKey="cms-academics"
      previewHref="/academics"
    >
      <SectionCard title="Page Hero">
        <Field label="Title" value={academics.hero.title} onChange={(v) => setAcademics({ ...academics, hero: { ...academics.hero, title: v } })} />
        <TextAreaField label="Description" value={academics.hero.description} onChange={(v) => setAcademics({ ...academics, hero: { ...academics.hero, description: v } })} maxLength={300} />
      </SectionCard>

      <SectionCard title="Levels Section">
        <Field label="Title" value={academics.levelsTitle} onChange={(v) => setAcademics({ ...academics, levelsTitle: v })} />
        <TextAreaField label="Description" value={academics.levelsDescription} onChange={(v) => setAcademics({ ...academics, levelsDescription: v })} maxLength={300} />
        {academics.levels.map((level, i) => (
          <ListItemCard key={i} title={level.name || `Level ${i + 1}`} deleteLabel={`Delete level "${level.name}"?`} onRemove={() => setAcademics({ ...academics, levels: academics.levels.filter((_, idx) => idx !== i) })}>
            <Field label="Name" value={level.name} onChange={(v) => setAcademics({ ...academics, levels: academics.levels.map((l, idx) => (idx === i ? { ...l, name: v } : l)) })} />
            <TextAreaField label="Description" value={level.description} onChange={(v) => setAcademics({ ...academics, levels: academics.levels.map((l, idx) => (idx === i ? { ...l, description: v } : l)) })} maxLength={300} />
            <Field label="Subjects (comma-separated)" value={level.subjects.join(", ")} onChange={(v) => setAcademics({ ...academics, levels: academics.levels.map((l, idx) => (idx === i ? { ...l, subjects: v.split(",").map((s) => s.trim()).filter(Boolean) } : l)) })} />
          </ListItemCard>
        ))}
        <AddItemButton label="Add Level" onClick={() => setAcademics({ ...academics, levels: [...academics.levels, { name: "New Level", description: "", subjects: [] }] })} />
      </SectionCard>

      <SectionCard title="Features Section">
        <Field label="Title" value={academics.featuresTitle} onChange={(v) => setAcademics({ ...academics, featuresTitle: v })} />
        <TextAreaField label="Description" value={academics.featuresDescription} onChange={(v) => setAcademics({ ...academics, featuresDescription: v })} maxLength={300} />
        {academics.features.map((feature, i) => (
          <ListItemCard key={i} title={`Feature ${i + 1}`} deleteLabel={`Delete feature ${i + 1}?`} onRemove={() => setAcademics({ ...academics, features: academics.features.filter((_, idx) => idx !== i) })}>
            <Field label="Text" value={feature} onChange={(v) => setAcademics({ ...academics, features: academics.features.map((f, idx) => (idx === i ? v : f)) })} />
          </ListItemCard>
        ))}
        <AddItemButton label="Add Feature" onClick={() => setAcademics({ ...academics, features: [...academics.features, ""] })} />
      </SectionCard>
    </CmsPageShell>
  );
}
