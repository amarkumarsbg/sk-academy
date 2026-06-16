"use client";

import { useEffect, useState } from "react";
import { AddItemButton, CmsPageShell, Field, ImageUploadField, ListItemCard, SectionCard, TextAreaField } from "@/components/admin/cms-form-fields";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createId, useSiteContent } from "@/context/site-content-provider";
import type { NewsItem, NoticeItem, PageHeroContent } from "@/types/site-content";

export default function CmsNewsPage() {
  const { content, updateContent } = useSiteContent();
  const [news, setNews] = useState<NewsItem[]>(content.news);
  const [notices, setNotices] = useState<NoticeItem[]>(content.notices);
  const [hero, setHero] = useState<PageHeroContent>(content.pageHeroes.news);

  useEffect(() => {
    setNews(content.news);
    setNotices(content.notices);
    setHero(content.pageHeroes.news);
  }, [content]);

  const save = () =>
    updateContent((prev) => ({
      ...prev,
      news,
      notices,
      pageHeroes: { ...prev.pageHeroes, news: hero },
    }));

  return (
    <CmsPageShell title="News & Notices CMS" onSave={save}>
      <SectionCard title="Page Hero">
        <Field label="Title" value={hero.title} onChange={(v) => setHero({ ...hero, title: v })} />
        <TextAreaField label="Description" value={hero.description} onChange={(v) => setHero({ ...hero, description: v })} />
      </SectionCard>

      <SectionCard title="News Articles">
        {news.map((item, i) => (
          <ListItemCard key={item.id} title={`Article ${i + 1}`} onRemove={() => setNews(news.filter((n) => n.id !== item.id))}>
            <Field label="Title" value={item.title} onChange={(v) => setNews(news.map((n) => (n.id === item.id ? { ...n, title: v } : n)))} />
            <TextAreaField label="Excerpt" value={item.excerpt} onChange={(v) => setNews(news.map((n) => (n.id === item.id ? { ...n, excerpt: v } : n)))} />
            <Field label="Category" value={item.category} onChange={(v) => setNews(news.map((n) => (n.id === item.id ? { ...n, category: v } : n)))} />
            <Field label="Date" value={item.date} type="date" onChange={(v) => setNews(news.map((n) => (n.id === item.id ? { ...n, date: v } : n)))} />
            <ImageUploadField label="Image" value={item.image} onChange={(v) => setNews(news.map((n) => (n.id === item.id ? { ...n, image: v } : n)))} />
          </ListItemCard>
        ))}
        <AddItemButton label="Add Article" onClick={() => setNews([...news, { id: createId(), title: "New Article", excerpt: "", date: new Date().toISOString().slice(0, 10), category: "General", image: "/logo.png" }])} />
      </SectionCard>

      <SectionCard title="Notices" description="Only notices with status Published appear on the public news page.">
        {notices.map((item, i) => (
          <ListItemCard key={item.id} title={`Notice ${i + 1}`} onRemove={() => setNotices(notices.filter((n) => n.id !== item.id))}>
            <Field label="Title" value={item.title} onChange={(v) => setNotices(notices.map((n) => (n.id === item.id ? { ...n, title: v } : n)))} />
            <Field label="Date" value={item.date} type="date" onChange={(v) => setNotices(notices.map((n) => (n.id === item.id ? { ...n, date: v } : n)))} />
            <Field label="Audience" value={item.audience} onChange={(v) => setNotices(notices.map((n) => (n.id === item.id ? { ...n, audience: v } : n)))} />
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={item.status} onValueChange={(v) => setNotices(notices.map((n) => (n.id === item.id ? { ...n, status: v ?? "Draft" } : n)))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </ListItemCard>
        ))}
        <AddItemButton label="Add Notice" onClick={() => setNotices([...notices, { id: createId(), title: "New Notice", date: new Date().toISOString().slice(0, 10), audience: "All", status: "Draft" }])} />
      </SectionCard>
    </CmsPageShell>
  );
}
