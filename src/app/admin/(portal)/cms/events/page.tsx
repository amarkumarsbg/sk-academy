"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AddItemButton, CmsPageShell, EmptyState, Field, ListItemCard, SectionCard, TextAreaField } from "@/components/admin/cms-form-fields";
import { createId, useSiteContent } from "@/context/site-content-provider";
import { useCmsPageDraft } from "@/hooks/use-cms-draft";
import type { EventItem, PageHeroContent } from "@/types/site-content";

export default function CmsEventsPage() {
  const { content, updateContent, saving } = useSiteContent();
  const [events, setEvents] = useState<EventItem[]>(content.events);
  const [hero, setHero] = useState<PageHeroContent>(content.pageHeroes.events);

  useEffect(() => {
    setEvents(content.events);
    setHero(content.pageHeroes.events);
  }, [content]);

  const saved = useMemo(
    () => ({ events: content.events, hero: content.pageHeroes.events }),
    [content]
  );
  const draft = useMemo(() => ({ events, hero }), [events, hero]);
  const reset = useCallback(() => {
    setEvents(content.events);
    setHero(content.pageHeroes.events);
  }, [content]);
  const { isDirty, onCancel } = useCmsPageDraft(saved, draft, reset);

  const save = () =>
    updateContent((prev) => ({
      ...prev,
      events,
      pageHeroes: { ...prev.pageHeroes, events: hero },
    }));

  return (
    <CmsPageShell
      title="Events CMS"
      onSave={save}
      saving={saving}
      isDirty={isDirty}
      onCancel={onCancel}
      storageKey="cms-events"
      previewHref="/events"
    >
      <SectionCard title="Page Hero">
        <Field label="Title" value={hero.title} onChange={(v) => setHero({ ...hero, title: v })} />
        <TextAreaField label="Description" value={hero.description} onChange={(v) => setHero({ ...hero, description: v })} maxLength={300} />
      </SectionCard>

      <SectionCard title="Events">
        {events.length === 0 ? (
          <EmptyState
            message="No events found."
            actionLabel="Add Event"
            onAction={() =>
              setEvents([
                {
                  id: createId(),
                  title: "New Event",
                  date: new Date().toISOString().slice(0, 10),
                  time: "10:00 AM",
                  location: "School Campus",
                  type: "General",
                },
              ])
            }
          />
        ) : (
          events.map((event, i) => (
            <ListItemCard
              key={event.id}
              title={`Event ${i + 1}`}
              deleteLabel={`Delete event "${event.title}"? This action cannot be undone.`}
              onRemove={() => setEvents(events.filter((e) => e.id !== event.id))}
            >
              <Field label="Title" value={event.title} onChange={(v) => setEvents(events.map((e) => (e.id === event.id ? { ...e, title: v } : e)))} />
              <TextAreaField label="Description" value={event.description ?? ""} onChange={(v) => setEvents(events.map((e) => (e.id === event.id ? { ...e, description: v || undefined } : e)))} maxLength={500} />
              <Field label="Date" value={event.date} type="date" onChange={(v) => setEvents(events.map((e) => (e.id === event.id ? { ...e, date: v } : e)))} />
              <Field label="Time" value={event.time} onChange={(v) => setEvents(events.map((e) => (e.id === event.id ? { ...e, time: v } : e)))} />
              <Field label="Location" value={event.location} onChange={(v) => setEvents(events.map((e) => (e.id === event.id ? { ...e, location: v } : e)))} />
              <Field label="Type" value={event.type} onChange={(v) => setEvents(events.map((e) => (e.id === event.id ? { ...e, type: v } : e)))} />
            </ListItemCard>
          ))
        )}
        {events.length > 0 && (
          <AddItemButton label="Add Event" onClick={() => setEvents([...events, { id: createId(), title: "New Event", date: new Date().toISOString().slice(0, 10), time: "10:00 AM", location: "School Campus", type: "General" }])} />
        )}
      </SectionCard>
    </CmsPageShell>
  );
}
