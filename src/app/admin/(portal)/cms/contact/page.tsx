"use client";

import { useEffect, useState } from "react";
import { AddItemButton, CmsPageShell, Field, ListItemCard, SectionCard, TextAreaField } from "@/components/admin/cms-form-fields";
import { useSiteContent } from "@/context/site-content-provider";
import type { ContactContent } from "@/types/site-content";

export default function CmsContactPage() {
  const { content, updateContent } = useSiteContent();
  const [contact, setContact] = useState<ContactContent>(content.contact);

  useEffect(() => setContact(content.contact), [content]);

  const save = () => updateContent((prev) => ({ ...prev, contact }));

  return (
    <CmsPageShell title="Contact Page CMS" onSave={save}>
      <SectionCard title="Page Hero">
        <Field label="Title" value={contact.hero.title} onChange={(v) => setContact({ ...contact, hero: { ...contact.hero, title: v } })} />
        <TextAreaField label="Description" value={contact.hero.description} onChange={(v) => setContact({ ...contact, hero: { ...contact.hero, description: v } })} />
      </SectionCard>

      <SectionCard title="Office Hours">
        {contact.officeHours.map((line, i) => (
          <ListItemCard key={i} title={`Line ${i + 1}`} onRemove={() => setContact({ ...contact, officeHours: contact.officeHours.filter((_, idx) => idx !== i) })}>
            <Field label="Text" value={line} onChange={(v) => setContact({ ...contact, officeHours: contact.officeHours.map((h, idx) => (idx === i ? v : h)) })} />
          </ListItemCard>
        ))}
        <AddItemButton label="Add Line" onClick={() => setContact({ ...contact, officeHours: [...contact.officeHours, ""] })} />
      </SectionCard>
    </CmsPageShell>
  );
}
