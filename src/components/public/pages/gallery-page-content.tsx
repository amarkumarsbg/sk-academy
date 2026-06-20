"use client";

import Link from "next/link";
import { useState } from "react";
import { ContentImage } from "@/components/public/content-image";
import { PageHero } from "@/components/public/page-hero";
import { PageSection } from "@/components/public/page-section";
import { PageCta } from "@/components/public/page-cta";
import { SectionHeading } from "@/components/public/section-heading";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/context/site-content-provider";
import type { GalleryAlbum } from "@/types/site-content";

function albumPhotos(album: GalleryAlbum) {
  return album.photos?.length ? album.photos : [album.cover];
}

const GALLERY_CATEGORIES = ["All", "Events", "Sports", "Campus Life", "Annual Function", "Achievements"] as const;

export function GalleryPageContent() {
  const { content } = useSiteContent();
  const { gallery, pageHeroes } = content;
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredGallery =
    activeCategory === "All" ? gallery : gallery.filter((album) => album.category === activeCategory);

  return (
    <>
      <PageHero title={pageHeroes.gallery.title} description={pageHeroes.gallery.description} />
      <PageSection>
        <SectionHeading
          title="Albums"
          description="Browse photos by category. Click any album to view all photos."
          centered
          className="mb-6"
        />
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {GALLERY_CATEGORIES.map((category) => (
            <Button
              key={category}
              type="button"
              size="sm"
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filteredGallery.map((album) => (
            <Link
              key={album.id}
              href={`/gallery/${album.id}`}
              className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl text-left shadow-md ring-1 ring-foreground/5 transition hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="relative aspect-[4/3]">
                <ContentImage
                  src={album.cover}
                  alt={album.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <span className="mb-1 inline-block rounded-full bg-accent/90 px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
                    {album.category}
                  </span>
                  <h3 className="font-semibold">{album.title}</h3>
                  <p className="text-sm text-white/80">
                    {albumPhotos(album).length} photo{albumPhotos(album).length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </PageSection>
      <PageCta title="Experience SK Academy" description="Visit our campus and see our facilities in person." />
    </>
  );
}
