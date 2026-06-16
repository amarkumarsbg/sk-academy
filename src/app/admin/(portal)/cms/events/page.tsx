"use client";

import { useEffect, useState } from "react";
import { AddItemButton, CmsPageShell, Field, ListItemCard, SectionCard, TextAreaField } from "@/components/admin/cms-form-fields";
import { createId, useSiteContent } from "@/context/site-content-provider";
import type { EventItem, PageHeroContent } from "@/types/site-content";

export default function CmsEventsPage() {
  const { content, updateContent } = useSiteContent();
  const [events, setEvents] = useState<EventItem[]>(content.events);
  const [hero, setHero] = useState<PageHeroContent>(content.pageHeroes.events);

  useEffect(() => {
    setEvents(content.events);
    setHero(content.pageHeroes.events);
  }, [content]);

  const save = () =>
    updateContent((prev) => ({
      ...prev,
      events,
      pageHeroes: { ...prev.pageHeroes, events: hero },
    }));

  return (
    <CmsPageShell title="Events CMS" onSave={save}>
      <SectionCard title="Page Hero">
        <Field label="Title" value={hero.title} onChange={(v) => setHero({ ...hero, title: v })} />
        <TextAreaField label="Description" value={hero.description} onChange={(v) => setHero({ ...hero, description: v })} />
      </SectionCard>

      <SectionCard title="Events">
        {events.map((event, i) => (
          <ListItemCard key={event.id} title={`Event ${i + 1}`} onRemove={() => setEvents(events.filter((e) => e.id !== event.id))}>
            <Field label="Title" value={event.title} onChange={(v) => setEvents(events.map((e) => (e.id === event.id ? { ...e, title: v } : e)))} />
            <Field label="Date" value={event.date} type="date" onChange={(v) => setEvents(events.map((e) => (e.id === event.id ? { ...e, date: v } : e)))} />
            <Field label="Time" value={event.time} onChange={(v) => setEvents(events.map((e) => (e.id === event.id ? { ...e, time: v } : e)))} />
            <Field label="Location" value={event.location} onChange={(v) => setEvents(events.map((e) => (e.id === event.id ? { ...e, location: v } : e)))} />
            <Field label="Type" value={event.type} onChange={(v) => setEvents(events.map((e) => (e.id === event.id ? { ...e, type: v } : e)))} />
          </ListItemCard>
        ))}
        <AddItemButton label="Add Event" onClick={() => setEvents([...events, { id: createId(), title: "New Event", date: new Date().toISOString().slice(0, 10), time: "10:00 AM", location: "School Campus", type: "General" }])} />
      </SectionCard>
    </CmsPageShell>
  );
}
