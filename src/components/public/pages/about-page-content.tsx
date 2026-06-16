"use client";

import { PageHero } from "@/components/public/page-hero";
import { SectionHeading } from "@/components/public/section-heading";
import { SchoolLogo } from "@/components/public/school-logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSiteContent } from "@/context/site-content-provider";

export function AboutPageContent() {
  const { content } = useSiteContent();
  const { about, settings } = content;

  return (
    <>
      <PageHero title={about.hero.title} description={about.hero.description} />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="flex justify-center lg:order-2">
              <SchoolLogo size="hero" href={null} />
            </div>
            <div className="lg:order-1">
              <SectionHeading
                title={about.storyTitle}
                description={
                  about.storyDescription ||
                  `Founded in ${settings.establishedYear}, ${settings.name} has been a beacon of quality education in ${settings.location}.`
                }
              />
              {about.storyParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 20)} className="mt-4 text-muted-foreground leading-relaxed first:mt-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{about.mission}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{about.vision}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Our Core Values" centered className="mb-10" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((value) => (
              <Card key={value.title}>
                <CardHeader>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Leadership Team" centered className="mb-10" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {about.leadership.map((leader) => (
              <Card key={leader.name}>
                <CardHeader>
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    {leader.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <CardTitle>{leader.name}</CardTitle>
                  <p className="text-sm font-medium text-primary">{leader.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{leader.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
