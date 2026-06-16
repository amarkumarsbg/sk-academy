"use client";

import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { SectionHeading } from "@/components/public/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSiteContent } from "@/context/site-content-provider";

export function AcademicsPageContent() {
  const { content } = useSiteContent();
  const { academics } = content;

  return (
    <>
      <PageHero title={academics.hero.title} description={academics.hero.description} />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title={academics.levelsTitle} description={academics.levelsDescription} centered className="mb-12" />
          <div className="grid gap-6 lg:grid-cols-2">
            {academics.levels.map((level) => (
              <Card key={level.name}>
                <CardHeader>
                  <CardTitle className="text-primary">{level.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {level.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary">{subject}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <SectionHeading title={academics.featuresTitle} description={academics.featuresDescription} />
            <ul className="space-y-3">
              {academics.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
