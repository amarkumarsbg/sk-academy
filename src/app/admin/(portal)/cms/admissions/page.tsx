"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AddItemButton, CmsPageShell, Field, ListItemCard, SectionCard, TextAreaField } from "@/components/admin/cms-form-fields";
import { useSiteContent } from "@/context/site-content-provider";
import { useCmsPageDraft } from "@/hooks/use-cms-draft";
import type { AdmissionsContent } from "@/types/site-content";

export default function CmsAdmissionsPage() {
  const { content, updateContent, saving } = useSiteContent();
  const [admissions, setAdmissions] = useState<AdmissionsContent>(content.admissions);

  useEffect(() => setAdmissions(content.admissions), [content]);

  const saved = useMemo(() => content.admissions, [content]);
  const reset = useCallback(() => setAdmissions(content.admissions), [content]);
  const { isDirty, onCancel } = useCmsPageDraft(saved, admissions, reset);

  const save = () => updateContent((prev) => ({ ...prev, admissions }));

  return (
    <CmsPageShell
      title="Admissions Page CMS"
      onSave={save}
      saving={saving}
      isDirty={isDirty}
      onCancel={onCancel}
      storageKey="cms-admissions"
      previewHref="/admissions"
    >
      <SectionCard title="Page Hero">
        <Field label="Title" value={admissions.hero.title} onChange={(v) => setAdmissions({ ...admissions, hero: { ...admissions.hero, title: v } })} />
        <TextAreaField label="Description" value={admissions.hero.description} onChange={(v) => setAdmissions({ ...admissions, hero: { ...admissions.hero, description: v } })} maxLength={300} />
      </SectionCard>

      <SectionCard title="Admission Steps">
        {admissions.steps.map((step, i) => (
          <ListItemCard key={i} title={`Step ${step.step}`} deleteLabel={`Delete step ${step.step}?`} onRemove={() => setAdmissions({ ...admissions, steps: admissions.steps.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, step: idx + 1 })) })}>
            <Field label="Title" value={step.title} onChange={(v) => setAdmissions({ ...admissions, steps: admissions.steps.map((s, idx) => (idx === i ? { ...s, title: v } : s)) })} />
            <TextAreaField label="Description" value={step.description} onChange={(v) => setAdmissions({ ...admissions, steps: admissions.steps.map((s, idx) => (idx === i ? { ...s, description: v } : s)) })} maxLength={300} />
          </ListItemCard>
        ))}
        <AddItemButton label="Add Step" onClick={() => setAdmissions({ ...admissions, steps: [...admissions.steps, { step: admissions.steps.length + 1, title: "New Step", description: "" }] })} />
      </SectionCard>

      <SectionCard title="Eligibility & Documents">
        {admissions.eligibilityItems.map((item, i) => (
          <ListItemCard key={i} title={`Item ${i + 1}`} deleteLabel={`Delete eligibility item ${i + 1}?`} onRemove={() => setAdmissions({ ...admissions, eligibilityItems: admissions.eligibilityItems.filter((_, idx) => idx !== i) })}>
            <Field label="Text" value={item} onChange={(v) => setAdmissions({ ...admissions, eligibilityItems: admissions.eligibilityItems.map((el, idx) => (idx === i ? v : el)) })} />
          </ListItemCard>
        ))}
        <AddItemButton label="Add Item" onClick={() => setAdmissions({ ...admissions, eligibilityItems: [...admissions.eligibilityItems, ""] })} />
      </SectionCard>

      <SectionCard title="Important Dates">
        {admissions.importantDates.map((item, i) => (
          <ListItemCard key={i} title={item.label || `Date ${i + 1}`} deleteLabel={`Delete "${item.label || "this date"}"?`} onRemove={() => setAdmissions({ ...admissions, importantDates: admissions.importantDates.filter((_, idx) => idx !== i) })}>
            <Field label="Label" value={item.label} onChange={(v) => setAdmissions({ ...admissions, importantDates: admissions.importantDates.map((d, idx) => (idx === i ? { ...d, label: v } : d)) })} />
            <Field label="Date" value={item.date} onChange={(v) => setAdmissions({ ...admissions, importantDates: admissions.importantDates.map((d, idx) => (idx === i ? { ...d, date: v } : d)) })} />
          </ListItemCard>
        ))}
        <AddItemButton label="Add Date" onClick={() => setAdmissions({ ...admissions, importantDates: [...admissions.importantDates, { label: "", date: "" }] })} />
      </SectionCard>
    </CmsPageShell>
  );
}
