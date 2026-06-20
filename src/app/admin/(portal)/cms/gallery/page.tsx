"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { AddItemButton, CmsPageShell, EmptyState, Field, ImageUploadField, ListItemCard, SectionCard, TextAreaField } from "@/components/admin/cms-form-fields";
import { Button } from "@/components/ui/button";
import { createId, useSiteContent } from "@/context/site-content-provider";
import { useCmsPageDraft } from "@/hooks/use-cms-draft";
import type { GalleryAlbum, PageHeroContent } from "@/types/site-content";

function photoCount(album: GalleryAlbum) {
  return (album.photos ?? []).filter(Boolean).length || album.count;
}

export default function CmsGalleryPage() {
  const { content, updateContent, saving } = useSiteContent();
  const [gallery, setGallery] = useState<GalleryAlbum[]>(content.gallery);
  const [hero, setHero] = useState<PageHeroContent>(content.pageHeroes.gallery);

  useEffect(() => {
    setGallery(content.gallery);
    setHero(content.pageHeroes.gallery);
  }, [content]);

  const saved = useMemo(
    () => ({ gallery: content.gallery, hero: content.pageHeroes.gallery }),
    [content]
  );
  const draft = useMemo(() => ({ gallery, hero }), [gallery, hero]);
  const reset = useCallback(() => {
    setGallery(content.gallery);
    setHero(content.pageHeroes.gallery);
  }, [content]);
  const { isDirty, onCancel } = useCmsPageDraft(saved, draft, reset);

  const save = () =>
    updateContent((prev) => ({
      ...prev,
      gallery: gallery.map((album) => ({
        ...album,
        count: photoCount(album),
      })),
      pageHeroes: { ...prev.pageHeroes, gallery: hero },
    }));

  const updateAlbum = (id: string, updater: (album: GalleryAlbum) => GalleryAlbum) => {
    setGallery(gallery.map((a) => (a.id === id ? updater(a) : a)));
  };

  return (
    <CmsPageShell
      title="Gallery CMS"
      onSave={save}
      saving={saving}
      isDirty={isDirty}
      onCancel={onCancel}
      storageKey="cms-gallery"
      previewHref="/gallery"
    >
      <SectionCard title="Page Hero">
        <Field label="Title" value={hero.title} onChange={(v) => setHero({ ...hero, title: v })} />
        <TextAreaField label="Description" value={hero.description} onChange={(v) => setHero({ ...hero, description: v })} maxLength={300} />
      </SectionCard>

      <SectionCard title="Albums">
        {gallery.length === 0 ? (
          <EmptyState
            message="No albums found. Click Add Album to create one."
            actionLabel="Add Album"
            onAction={() => setGallery([{ id: createId(), title: "New Album", count: 0, cover: "/logo.png", category: "Events", photos: [] }])}
          />
        ) : (
          gallery.map((album, i) => (
            <ListItemCard
              key={album.id}
              title={`Album ${i + 1}`}
              deleteLabel={`Delete album "${album.title}"? This action cannot be undone.`}
              onRemove={() => setGallery(gallery.filter((a) => a.id !== album.id))}
            >
              <Field label="Title" value={album.title} onChange={(v) => updateAlbum(album.id, (a) => ({ ...a, title: v }))} />
              <Field label="Photo Count (auto)" value={photoCount(album)} readOnly />
              <ImageUploadField label="Cover image" value={album.cover} onChange={(v) => updateAlbum(album.id, (a) => ({ ...a, cover: v }))} />
              <div className="space-y-3">
                <p className="text-sm font-medium">Album Photos</p>
                {(album.photos ?? []).map((photo, photoIndex) => (
                  <div key={photoIndex} className="relative rounded-lg border p-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => {
                        if (confirm(`Remove photo ${photoIndex + 1}?`)) {
                          updateAlbum(album.id, (a) => {
                            const photos = (a.photos ?? []).filter((_, idx) => idx !== photoIndex);
                            return { ...a, photos, count: photos.filter(Boolean).length };
                          });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <ImageUploadField
                      label={`Photo ${photoIndex + 1}`}
                      value={photo}
                      onChange={(v) =>
                        updateAlbum(album.id, (a) => {
                          const photos = [...(a.photos ?? [])];
                          photos[photoIndex] = v;
                          return { ...a, photos, count: photos.filter(Boolean).length };
                        })
                      }
                    />
                  </div>
                ))}
                <AddItemButton
                  label="Add Photo"
                  onClick={() =>
                    updateAlbum(album.id, (a) => ({
                      ...a,
                      photos: [...(a.photos ?? []), ""],
                    }))
                  }
                />
              </div>
            </ListItemCard>
          ))
        )}
        {gallery.length > 0 && (
          <AddItemButton label="Add Album" onClick={() => setGallery([...gallery, { id: createId(), title: "New Album", count: 0, cover: "/logo.png", category: "Events", photos: [] }])} />
        )}
      </SectionCard>
    </CmsPageShell>
  );
}
