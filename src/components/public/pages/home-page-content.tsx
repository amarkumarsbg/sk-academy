"use client";

import { ContentImage } from "@/components/public/content-image";
import { HeroCarousel } from "@/components/public/hero-carousel";
import { HighlightsCarousel } from "@/components/public/highlights-carousel";
import { SectionHeading } from "@/components/public/section-heading";
import { StatCards } from "@/components/public/stat-cards";
import { ScrollReveal } from "@/components/public/motion/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSiteContent } from "@/context/site-content-provider";
import { formatDay, formatMonthShort } from "@/lib/format-date";
import { BookOpen, Calendar, CheckCircle2, GraduationCap, Quote, Users } from "lucide-react";

const featureIcons = [GraduationCap, Users, BookOpen, Calendar];

export function HomePageContent() {
  const { content } = useSiteContent();
  const { settings, stats, news, events, homepage } = content;

  return (
    <>
      <HeroCarousel />

      <section className="border-b bg-background py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <ScrollReveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl ring-1 ring-foreground/5">
              <ContentImage src={homepage.welcomeImage} alt={settings.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <Badge className="mb-4 bg-accent/15 text-accent-foreground hover:bg-accent/20">
              Est. {settings.establishedYear}
            </Badge>
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">{homepage.welcomeTitle}</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {settings.description} {homepage.introExtra}
            </p>
            <ul className="mt-6 space-y-3">
              {homepage.achievements.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <ButtonLink href="/about" variant="outline" className="mt-8">
              Learn More About Us
            </ButtonLink>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-b bg-muted/40 py-14 sm:py-16">
        <StatCards stats={stats} />
      </section>

      <HighlightsCarousel />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title={homepage.whyChooseTitle} description={homepage.whyChooseDescription} centered className="mb-12" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {homepage.features.map((item, i) => {
              const Icon = featureIcons[i] ?? GraduationCap;
              return (
                <Card key={item.title} className="card-interactive border-0 bg-white">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
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

      <section className="bg-primary py-16 text-primary-foreground sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <ScrollReveal>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-2xl shadow-xl ring-2 ring-accent/40">
            <ContentImage
              src={homepage.principalImage}
              alt={homepage.principalName}
              fill
              className="object-cover object-[center_15%]"
              sizes="280px"
            />
          </div>
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
          <div className="text-center lg:text-left">
            <Quote className="mx-auto mb-4 h-8 w-8 text-accent lg:mx-0" />
            <h2 className="text-2xl font-bold sm:text-3xl">Principal&apos;s Message</h2>
            <p className="mt-6 text-lg leading-relaxed text-primary-foreground/90">
              &ldquo;{homepage.principalMessage}&rdquo;
            </p>
            <p className="mt-6 font-semibold text-accent">{homepage.principalName}</p>
            <p className="text-sm text-primary-foreground/70">{homepage.principalTitle}</p>
          </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title={homepage.facilitiesTitle} centered className="mb-12" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {homepage.facilities.map((item) => (
              <Card key={item.title} className="card-interactive border-0 bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title={homepage.achievementsTitle} centered className="mb-12" />
          <div className="grid gap-6 sm:grid-cols-2">
            {homepage.studentAchievements.map((item) => (
              <Card key={item.title} className="card-interactive border-0 bg-white">
                <CardContent className="flex gap-4 pt-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title={homepage.testimonialsTitle} centered className="mb-12" />
          <div className="grid gap-6 md:grid-cols-3">
            {homepage.testimonials.map((item) => (
              <Card key={item.name} className="card-interactive border-0 bg-white">
                <CardContent className="pt-6">
                  <Quote className="mb-3 h-6 w-6 text-accent" />
                  <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{item.quote}&rdquo;</p>
                  <p className="mt-4 font-semibold text-primary">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading title={homepage.newsSectionTitle} description={homepage.newsSectionDescription} />
            <ButtonLink href="/news" variant="outline" className="shrink-0">
              View All
            </ButtonLink>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.slice(0, 3).map((item) => (
              <Card key={item.id} className="card-interactive overflow-hidden border-0 bg-white pt-0">
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
          <SectionHeading title={homepage.eventsSectionTitle} description={homepage.eventsSectionDescription} centered className="mb-10" />
          <div className="grid gap-4 sm:grid-cols-2">
            {events.slice(0, 4).map((event) => (
              <Card key={event.id} className="card-interactive border-0 bg-white">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-primary-foreground">
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
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/admissions" size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
              {homepage.ctaButton}
            </ButtonLink>
            <ButtonLink
              href="/admissions#brochure"
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              Download Brochure
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
