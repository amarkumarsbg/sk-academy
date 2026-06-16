"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { ContentImage } from "@/components/public/content-image";
import { PageHero } from "@/components/public/page-hero";
import { SectionHeading } from "@/components/public/section-heading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/context/site-content-provider";
import type { GalleryAlbum } from "@/types/site-content";

function albumPhotos(album: GalleryAlbum) {
  return album.photos?.length ? album.photos : [album.cover];
}

export function GalleryPageContent() {
  const { content } = useSiteContent();
  const { gallery, pageHeroes } = content;
  const [viewer, setViewer] = useState<{ albumIndex: number; photoIndex: number } | null>(null);

  const openAlbum = (albumIndex: number) => {
    setViewer({ albumIndex, photoIndex: 0 });
  };

  const closeViewer = () => setViewer(null);

  const activeAlbum = viewer !== null ? gallery[viewer.albumIndex] : null;
  const photos = activeAlbum ? albumPhotos(activeAlbum) : [];
  const activePhoto = viewer !== null ? photos[viewer.photoIndex] : null;

  const showPrev = useCallback(() => {
    setViewer((current) => {
      if (!current) return current;
      const items = albumPhotos(gallery[current.albumIndex]);
      if (current.photoIndex > 0) {
        return { ...current, photoIndex: current.photoIndex - 1 };
      }
      if (current.albumIndex > 0) {
        const prevAlbum = gallery[current.albumIndex - 1];
        return {
          albumIndex: current.albumIndex - 1,
          photoIndex: albumPhotos(prevAlbum).length - 1,
        };
      }
      return current;
    });
  }, [gallery]);

  const showNext = useCallback(() => {
    setViewer((current) => {
      if (!current) return current;
      const items = albumPhotos(gallery[current.albumIndex]);
      if (current.photoIndex < items.length - 1) {
        return { ...current, photoIndex: current.photoIndex + 1 };
      }
      if (current.albumIndex < gallery.length - 1) {
        return { albumIndex: current.albumIndex + 1, photoIndex: 0 };
      }
      return current;
    });
  }, [gallery]);

  useEffect(() => {
    if (!viewer) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "Escape") closeViewer();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewer, showNext, showPrev]);

  return (
    <>
      <PageHero title={pageHeroes.gallery.title} description={pageHeroes.gallery.description} />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Albums"
            description="Click an album to view photos."
            centered
            className="mb-10"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((album, index) => (
              <button
                key={album.id}
                type="button"
                onClick={() => openAlbum(index)}
                className="group relative overflow-hidden rounded-xl text-left shadow-md transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="relative aspect-[4/3]">
                  <ContentImage
                    src={album.cover}
                    alt={album.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white opacity-0 transition group-hover:opacity-100">
                    <ZoomIn className="h-4 w-4" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold">{album.title}</h3>
                    <p className="text-sm text-white/80">
                      {albumPhotos(album).length} photo{albumPhotos(album).length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={viewer !== null} onOpenChange={(open) => !open && closeViewer()}>
        <DialogContent className="max-w-5xl gap-0 overflow-hidden p-0 sm:max-w-5xl" showCloseButton>
          {activeAlbum && activePhoto && viewer && (
            <>
              <div className="relative aspect-[16/10] w-full bg-black sm:aspect-[16/9]">
                <ContentImage
                  src={activePhoto}
                  alt={activeAlbum.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
                {photos.length > 1 && (
                  <>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
                      onClick={showPrev}
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
                      onClick={showNext}
                      aria-label="Next photo"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>

              <div className="border-t p-4">
                <DialogHeader className="text-left">
                  <DialogTitle>{activeAlbum.title}</DialogTitle>
                  <DialogDescription>
                    Photo {viewer.photoIndex + 1} of {photos.length}
                  </DialogDescription>
                </DialogHeader>

                {photos.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                    {photos.map((photo, photoIndex) => (
                      <button
                        key={`${photo}-${photoIndex}`}
                        type="button"
                        onClick={() => setViewer({ albumIndex: viewer.albumIndex, photoIndex })}
                        className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-md border-2 transition ${
                          photoIndex === viewer.photoIndex
                            ? "border-primary"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <ContentImage src={photo} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
