"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { PageSection } from "@/components/public/page-section";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { useSiteContent } from "@/context/site-content-provider";
import { formatDateLong } from "@/lib/format-date";

export function EventDetailContent() {
  const params = useParams<{ id: string }>();
  const { content } = useSiteContent();
  const event = content.events.find((item) => item.id === params.id);

  if (!event) {
    return (
      <PageSection containerClassName="max-w-3xl py-16 text-center">
        <h1 className="text-2xl font-semibold">Event not found</h1>
        <ButtonLink href="/events" className="mt-4">
          Back to Events
        </ButtonLink>
      </PageSection>
    );
  }

  return (
    <>
      <PageHero title={event.title} description={formatDateLong(event.date)} />
      <PageSection containerClassName="max-w-3xl">
        <Link href="/events" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>
        <Badge className="mb-4">{event.type}</Badge>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent" />
            {event.time}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" />
            {event.location}
          </p>
        </div>
        {event.description && (
          <p className="mt-6 text-base leading-relaxed text-foreground">{event.description}</p>
        )}
      </PageSection>
    </>
  );
}
