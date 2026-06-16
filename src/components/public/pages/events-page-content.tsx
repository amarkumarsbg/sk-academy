"use client";

import { PageHero } from "@/components/public/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSiteContent } from "@/context/site-content-provider";
import { formatDay, formatMonthShort, formatYear } from "@/lib/format-date";

export function EventsPageContent() {
  const { content } = useSiteContent();
  const { events, pageHeroes } = content;

  return (
    <>
      <PageHero title={pageHeroes.events.title} description={pageHeroes.events.description} />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <span className="text-xs font-medium uppercase">{formatMonthShort(event.date)}</span>
                    <span className="text-2xl font-bold leading-none">{formatDay(event.date)}</span>
                    <span className="text-xs">{formatYear(event.date)}</span>
                  </div>
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-1">{event.type}</Badge>
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.time} · {event.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
