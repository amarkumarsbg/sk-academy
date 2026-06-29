"use client";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { ContentImage } from "@/components/public/content-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GalleryLightboxProps = {
  photos: string[];
  currentIndex: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  title?: string;
};

export function GalleryLightbox({
  photos,
  currentIndex,
  open,
  onClose,
  onIndexChange,
  title,
}: GalleryLightboxProps) {
  const hasMultiple = photos.length > 1;
  const canGoPrev = hasMultiple && currentIndex > 0;
  const canGoNext = hasMultiple && currentIndex < photos.length - 1;

  const goPrev = useCallback(() => {
    if (canGoPrev) onIndexChange(currentIndex - 1);
  }, [canGoPrev, currentIndex, onIndexChange]);

  const goNext = useCallback(() => {
    if (canGoNext) onIndexChange(currentIndex + 1);
  }, [canGoNext, currentIndex, onIndexChange]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, goPrev, goNext]);

  if (!open || typeof document === "undefined") return null;

  const photo = photos[currentIndex];
  if (!photo) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex animate-in fade-in-0 duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title} photo viewer` : "Photo viewer"}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/92 backdrop-blur-md"
        onClick={onClose}
        aria-label="Close gallery"
      />

      <div className="pointer-events-none relative z-10 flex h-full w-full flex-col">
        <div className="pointer-events-auto flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="min-w-0 text-white">
            {title && <p className="truncate text-sm font-medium sm:text-base">{title}</p>}
            <p className="text-xs text-white/60 sm:text-sm">
              {currentIndex + 1} of {photos.length}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 sm:px-20">
          {canGoPrev && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="pointer-events-auto absolute left-2 top-1/2 z-20 h-11 w-11 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white sm:left-4 sm:h-12 sm:w-12"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}

          <div
            key={photo}
            className="pointer-events-auto relative h-full w-full max-h-[calc(100vh-8rem)] max-w-6xl animate-in zoom-in-95 fade-in-0 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <ContentImage
              src={photo}
              alt={title ? `${title} — photo ${currentIndex + 1}` : `Photo ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {canGoNext && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="pointer-events-auto absolute right-2 top-1/2 z-20 h-11 w-11 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white sm:right-4 sm:h-12 sm:w-12"
              aria-label="Next photo"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </div>

        {hasMultiple && (
          <div className="pointer-events-auto flex justify-center gap-2 overflow-x-auto px-4 pb-6 pt-2 sm:pb-8">
            {photos.map((thumb, index) => (
              <button
                key={`${thumb}-${index}`}
                type="button"
                onClick={() => onIndexChange(index)}
                className={cn(
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition sm:h-16 sm:w-24",
                  index === currentIndex
                    ? "ring-white opacity-100"
                    : "opacity-50 ring-transparent hover:opacity-80"
                )}
                aria-label={`View photo ${index + 1}`}
                aria-current={index === currentIndex ? "true" : undefined}
              >
                <ContentImage src={thumb} alt="" fill className="object-cover" sizes="96px" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export function GalleryPhotoTile({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl text-left ring-1 ring-foreground/5 transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <ContentImage
        src={src}
        alt={alt}
        fill
        className="object-cover transition duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/25" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg">
          <ZoomIn className="h-5 w-5" />
        </span>
      </div>
    </button>
  );
}
