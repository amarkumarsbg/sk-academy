"use client";

import { useEffect, useState } from "react";
import { AddItemButton, CmsPageShell, Field, ImageUploadField, ListItemCard, SectionCard, TextAreaField } from "@/components/admin/cms-form-fields";
import { createId, useSiteContent } from "@/context/site-content-provider";
import type { GalleryAlbum, PageHeroContent } from "@/types/site-content";

export default function CmsGalleryPage() {
  const { content, updateContent } = useSiteContent();
  const [gallery, setGallery] = useState<GalleryAlbum[]>(content.gallery);
  const [hero, setHero] = useState<PageHeroContent>(content.pageHeroes.gallery);

  useEffect(() => {
    setGallery(content.gallery);
    setHero(content.pageHeroes.gallery);
  }, [content]);

  const save = () =>
    updateContent((prev) => ({
      ...prev,
      gallery,
      pageHeroes: { ...prev.pageHeroes, gallery: hero },
    }));

  return (
    <CmsPageShell title="Gallery CMS" onSave={save}>
      <SectionCard title="Page Hero">
        <Field label="Title" value={hero.title} onChange={(v) => setHero({ ...hero, title: v })} />
        <TextAreaField label="Description" value={hero.description} onChange={(v) => setHero({ ...hero, description: v })} />
      </SectionCard>

      <SectionCard title="Albums">
        {gallery.map((album, i) => (
          <ListItemCard key={album.id} title={`Album ${i + 1}`} onRemove={() => setGallery(gallery.filter((a) => a.id !== album.id))}>
            <Field label="Title" value={album.title} onChange={(v) => setGallery(gallery.map((a) => (a.id === album.id ? { ...a, title: v } : a)))} />
            <Field label="Photo Count" value={album.count} type="number" onChange={(v) => setGallery(gallery.map((a) => (a.id === album.id ? { ...a, count: Number(v) || 0 } : a)))} />
            <ImageUploadField label="Cover image" value={album.cover} onChange={(v) => setGallery(gallery.map((a) => (a.id === album.id ? { ...a, cover: v } : a)))} />
          </ListItemCard>
        ))}
        <AddItemButton label="Add Album" onClick={() => setGallery([...gallery, { id: createId(), title: "New Album", count: 0, cover: "/logo.png" }])} />
      </SectionCard>
    </CmsPageShell>
  );
}
