"use client";

import { useState } from "react";
import { EventCard } from "@/components/public/event-card";
import { PageCta } from "@/components/public/page-cta";
import { PageHero } from "@/components/public/page-hero";
import { PageSection } from "@/components/public/page-section";
import { SectionHeading } from "@/components/public/section-heading";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/context/site-content-provider";

const EVENT_CATEGORIES = ["All", "Meeting", "Cultural", "Academic", "Workshop", "Sports"] as const;

export function EventsPageContent() {
  const { content } = useSiteContent();
  const { events, pageHeroes } = content;
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredEvents =
    activeCategory === "All" ? events : events.filter((event) => event.type === activeCategory);

  return (
    <>
      <PageHero title={pageHeroes.events.title} description={pageHeroes.events.description} />
      <PageSection containerClassName="max-w-4xl">
        <SectionHeading
          title="Upcoming Events"
          description="Browse school events by category."
          centered
          className="mb-6"
        />
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {EVENT_CATEGORIES.map((category) => (
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
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </PageSection>
      <PageCta title="Join Our School Events" description="Admissions are open — become part of the SK Academy community." />
    </>
  );
}
