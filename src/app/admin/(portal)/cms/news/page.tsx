"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { AddItemButton, CmsPageShell, EmptyState, Field, ImageUploadField, ListItemCard, SectionCard } from "@/components/admin/cms-form-fields";
import { RichTextField, RichTextPreview } from "@/components/admin/rich-text-field";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createId, useSiteContent } from "@/context/site-content-provider";
import { useCmsPageDraft } from "@/hooks/use-cms-draft";
import { cn } from "@/lib/utils";
import type { NewsItem, NoticeItem, PageHeroContent } from "@/types/site-content";

export default function CmsNewsPage() {
  const { content, updateContent, saving } = useSiteContent();
  const [news, setNews] = useState<NewsItem[]>(content.news);
  const [notices, setNotices] = useState<NoticeItem[]>(content.notices);
  const [hero, setHero] = useState<PageHeroContent>(content.pageHeroes.news);
  const [previewItem, setPreviewItem] = useState<NewsItem | null>(null);

  useEffect(() => {
    setNews(content.news.map((n) => ({ ...n, status: n.status ?? "Published" })));
    setNotices(content.notices);
    setHero(content.pageHeroes.news);
  }, [content]);

  const saved = useMemo(
    () => ({
      news: content.news.map((n) => ({ ...n, status: n.status ?? "Published" })),
      notices: content.notices,
      hero: content.pageHeroes.news,
    }),
    [content]
  );
  const draft = useMemo(() => ({ news, notices, hero }), [news, notices, hero]);
  const reset = useCallback(() => {
    setNews(content.news.map((n) => ({ ...n, status: n.status ?? "Published" })));
    setNotices(content.notices);
    setHero(content.pageHeroes.news);
  }, [content]);
  const { isDirty, onCancel } = useCmsPageDraft(saved, draft, reset);

  const save = () =>
    updateContent((prev) => ({
      ...prev,
      news,
      notices,
      pageHeroes: { ...prev.pageHeroes, news: hero },
    }));

  return (
    <CmsPageShell
      title="News & Notices CMS"
      onSave={save}
      saving={saving}
      isDirty={isDirty}
      onCancel={onCancel}
      storageKey="cms-news"
      previewHref="/news"
    >
      <SectionCard title="Page Hero">
        <Field label="Title" value={hero.title} onChange={(v) => setHero({ ...hero, title: v })} />
        <RichTextField label="Description" value={hero.description} onChange={(v) => setHero({ ...hero, description: v })} rows={3} />
      </SectionCard>

      <SectionCard title="News Articles" description="Only articles with status Published appear on the public website.">
        {news.length === 0 ? (
          <EmptyState
            message="No news articles found."
            actionLabel="Add Article"
            onAction={() =>
              setNews([
                {
                  id: createId(),
                  title: "New Article",
                  excerpt: "",
                  body: "",
                  date: new Date().toISOString().slice(0, 10),
                  category: "General",
                  image: "/logo.png",
                  status: "Draft",
                },
              ])
            }
          />
        ) : (
          news.map((item, i) => (
            <ListItemCard
              key={item.id}
              title={`Article ${i + 1}`}
              deleteLabel={`Delete article "${item.title}"? This action cannot be undone.`}
              onRemove={() => setNews(news.filter((n) => n.id !== item.id))}
            >
              <Field label="Title" value={item.title} onChange={(v) => setNews(news.map((n) => (n.id === item.id ? { ...n, title: v } : n)))} />
              <RichTextField label="Summary (card preview)" value={item.excerpt} onChange={(v) => setNews(news.map((n) => (n.id === item.id ? { ...n, excerpt: v } : n)))} rows={3} />
              <RichTextField label="Full article" value={item.body ?? ""} onChange={(v) => setNews(news.map((n) => (n.id === item.id ? { ...n, body: v } : n)))} rows={8} />
              <Field label="Category" value={item.category} onChange={(v) => setNews(news.map((n) => (n.id === item.id ? { ...n, category: v } : n)))} />
              <Field label="Date" value={item.date} type="date" onChange={(v) => setNews(news.map((n) => (n.id === item.id ? { ...n, date: v } : n)))} />
              <ImageUploadField label="Image" value={item.image} onChange={(v) => setNews(news.map((n) => (n.id === item.id ? { ...n, image: v } : n)))} />
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex flex-wrap items-center gap-3">
                  <Select
                    value={item.status ?? "Draft"}
                    onValueChange={(v) =>
                      setNews(news.map((n) => (n.id === item.id ? { ...n, status: (v ?? "Draft") as NewsItem["status"] } : n)))
                    }
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant={item.status === "Published" ? "default" : "secondary"} className={item.status === "Published" ? "bg-emerald-600" : "bg-amber-500 text-white"}>
                    {item.status === "Published" ? "🟢 Published" : "🟠 Draft"}
                  </Badge>
                  <Button type="button" size="sm" variant="outline" onClick={() => setPreviewItem(item)}>
                    <Eye className="mr-1 h-4 w-4" />
                    Preview
                  </Button>
                  {item.status === "Published" && (
                    <a
                      href={`/news/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      View live
                    </a>
                  )}
                </div>
              </div>
            </ListItemCard>
          ))
        )}
        {news.length > 0 && (
          <AddItemButton
            label="Add Article"
            onClick={() =>
              setNews([
                ...news,
                {
                  id: createId(),
                  title: "New Article",
                  excerpt: "",
                  body: "",
                  date: new Date().toISOString().slice(0, 10),
                  category: "General",
                  image: "/logo.png",
                  status: "Draft",
                },
              ])
            }
          />
        )}
      </SectionCard>

      <SectionCard title="Notices" description="Only notices with status Published appear on the public news page.">
        {notices.length === 0 ? (
          <EmptyState message="No notices found." actionLabel="Add Notice" onAction={() => setNotices([{ id: createId(), title: "New Notice", date: new Date().toISOString().slice(0, 10), audience: "All", status: "Draft" }])} />
        ) : (
          notices.map((item, i) => (
            <ListItemCard key={item.id} title={`Notice ${i + 1}`} deleteLabel={`Delete notice "${item.title}"?`} onRemove={() => setNotices(notices.filter((n) => n.id !== item.id))}>
              <Field label="Title" value={item.title} onChange={(v) => setNotices(notices.map((n) => (n.id === item.id ? { ...n, title: v } : n)))} />
              <Field label="Date" value={item.date} type="date" onChange={(v) => setNotices(notices.map((n) => (n.id === item.id ? { ...n, date: v } : n)))} />
              <Field label="Audience" value={item.audience} onChange={(v) => setNotices(notices.map((n) => (n.id === item.id ? { ...n, audience: v } : n)))} />
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center gap-3">
                  <Select value={item.status} onValueChange={(v) => setNotices(notices.map((n) => (n.id === item.id ? { ...n, status: v ?? "Draft" } : n)))}>
                    <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant={item.status === "Published" ? "default" : "secondary"} className={item.status === "Published" ? "bg-emerald-600" : "bg-amber-500 text-white"}>
                    {item.status === "Published" ? "🟢 Published" : "🟠 Draft"}
                  </Badge>
                </div>
              </div>
            </ListItemCard>
          ))
        )}
        {notices.length > 0 && (
          <AddItemButton label="Add Notice" onClick={() => setNotices([...notices, { id: createId(), title: "New Notice", date: new Date().toISOString().slice(0, 10), audience: "All", status: "Draft" }])} />
        )}
      </SectionCard>

      <Dialog open={Boolean(previewItem)} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Article Preview</DialogTitle>
          </DialogHeader>
          {previewItem && (
            <div className="space-y-4">
              <Badge variant={previewItem.status === "Published" ? "default" : "secondary"}>
                {previewItem.status}
              </Badge>
              <RichTextPreview html={previewItem.body || previewItem.excerpt} title={previewItem.title} />
              <p className="text-xs text-muted-foreground">
                {previewItem.category} · {previewItem.date}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </CmsPageShell>
  );
}
