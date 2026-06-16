"use client";

import { ContentImage } from "@/components/public/content-image";
import { PageHero } from "@/components/public/page-hero";
import { SectionHeading } from "@/components/public/section-heading";
import { useSiteContent } from "@/context/site-content-provider";

export function GalleryPageContent() {
  const { content } = useSiteContent();
  const { gallery, pageHeroes } = content;

  return (
    <>
      <PageHero title={pageHeroes.gallery.title} description={pageHeroes.gallery.description} />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Albums" description="Browse our collection of memorable moments." centered className="mb-10" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((album) => (
              <div key={album.id} className="group relative overflow-hidden rounded-xl shadow-md transition-shadow hover:shadow-lg">
                <div className="relative aspect-[4/3]">
                  <ContentImage src={album.cover} alt={album.title} fill className="object-cover transition duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold">{album.title}</h3>
                    <p className="text-sm text-white/80">{album.count} photos</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
