"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ContentImage } from "@/components/public/content-image";
import { PageHero } from "@/components/public/page-hero";
import { PageSection } from "@/components/public/page-section";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { useSiteContent } from "@/context/site-content-provider";

function albumPhotos(album: { cover: string; photos?: string[] }) {
  return album.photos?.filter(Boolean).length ? album.photos!.filter(Boolean) : [album.cover];
}

export function GalleryAlbumContent() {
  const params = useParams<{ id: string }>();
  const { content } = useSiteContent();
  const album = content.gallery.find((item) => item.id === params.id);

  if (!album) {
    return (
      <PageSection containerClassName="max-w-5xl py-16 text-center">
        <h1 className="text-2xl font-semibold">Album not found</h1>
        <ButtonLink href="/gallery" className="mt-4">
          Back to Gallery
        </ButtonLink>
      </PageSection>
    );
  }

  const photos = albumPhotos(album);

  return (
    <>
      <PageHero title={album.title} description={`${photos.length} photos · ${album.category}`} />
      <PageSection containerClassName="max-w-5xl">
        <Link href="/gallery" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Link>
        <Badge className="mb-6">{album.category}</Badge>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <ContentImage src={photo} alt={`${album.title} photo ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </PageSection>
    </>
  );
}
