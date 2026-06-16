"use client";

import { CheckCircle2 } from "lucide-react";
import { PageCta } from "@/components/public/page-cta";
import { PageHero } from "@/components/public/page-hero";
import { PageSection } from "@/components/public/page-section";
import { SchoolHighlights } from "@/components/public/school-highlights";
import { SectionHeading } from "@/components/public/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSiteContent } from "@/context/site-content-provider";

export function AcademicsPageContent() {
  const { content } = useSiteContent();
  const { academics } = content;

  return (
    <>
      <PageHero title={academics.hero.title} description={academics.hero.description} />
      <PageSection>
        <SectionHeading
          title={academics.levelsTitle}
          description={academics.levelsDescription}
          centered
          className="mb-8"
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {academics.levels.map((level) => (
            <Card key={level.name} className="card-interactive flex h-full flex-col">
              <CardHeader>
                <CardTitle className="text-primary">{level.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{level.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {level.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection variant="muted">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <SectionHeading title={academics.featuresTitle} description={academics.featuresDescription} />
          <ul className="space-y-3">
            {academics.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </PageSection>

      <SchoolHighlights />
      <PageCta title="Explore Admissions" description="See how SK Academy can support your child's academic journey." />
    </>
  );
}
