"use client";

import { ContentImage } from "@/components/public/content-image";
import { BookOpen, Calendar, GraduationCap, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/public/section-heading";
import { HeroCarousel } from "@/components/public/hero-carousel";
import { HighlightsCarousel } from "@/components/public/highlights-carousel";
import { useSiteContent } from "@/context/site-content-provider";
import { formatDay, formatMonthShort } from "@/lib/format-date";

const featureIcons = [GraduationCap, Users, BookOpen, Calendar];

export function HomePageContent() {
  const { content } = useSiteContent();
  const { settings, stats, news, events, homepage } = content;

  return (
    <>
      <HeroCarousel />

      <section className="border-b bg-background py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">
              Welcome to {settings.name}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {settings.description} {homepage.introExtra} in {settings.location}.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Badge variant="secondary">Est. {settings.establishedYear}</Badge>
              <Badge variant="secondary">{settings.tagline}</Badge>
              <Badge variant="secondary">CBSE Curriculum</Badge>
            </div>
          </div>
        </div>
      </section>

      <HighlightsCarousel />

      <section className="border-b bg-muted/40 py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={homepage.whyChooseTitle}
            description={homepage.whyChooseDescription}
            centered
            className="mb-12"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {homepage.features.map((item, i) => {
              const Icon = featureIcons[i] ?? GraduationCap;
              return (
                <Card key={item.title} className="border-0 shadow-md">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{item.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <SectionHeading title={homepage.newsSectionTitle} description={homepage.newsSectionDescription} />
            <ButtonLink href="/news" variant="outline" className="hidden sm:inline-flex">
              View All
            </ButtonLink>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.slice(0, 3).map((item) => (
              <Card key={item.id} className="overflow-hidden pt-0">
                <div className="relative aspect-video">
                  <ContentImage src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{item.category}</Badge>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{item.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={homepage.eventsSectionTitle}
            description={homepage.eventsSectionDescription}
            centered
            className="mb-10"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {events.slice(0, 4).map((event) => (
              <Card key={event.id}>
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="text-xs font-medium">{formatMonthShort(event.date)}</span>
                    <span className="text-lg font-bold leading-none">{formatDay(event.date)}</span>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-1">{event.type}</Badge>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.time} · {event.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <ButtonLink href="/events" variant="outline">View All Events</ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">{homepage.ctaTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">{homepage.ctaDescription}</p>
          <ButtonLink href="/admissions" size="lg" variant="secondary" className="mt-8">
            {homepage.ctaButton}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
