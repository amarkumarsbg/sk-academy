"use client";

import { PageHero } from "@/components/public/page-hero";
import { SectionHeading } from "@/components/public/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSiteContent } from "@/context/site-content-provider";

export function AdmissionsPageContent() {
  const { content } = useSiteContent();
  const { admissions } = content;

  return (
    <>
      <PageHero title={admissions.hero.title} description={admissions.hero.description} />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Admission Process" description="A simple four-step process to enroll your child." centered className="mb-12" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {admissions.steps.map((step) => (
              <Card key={step.step}>
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {step.step}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading title="Eligibility & Documents" />
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                {admissions.eligibilityItems.map((item, i) => (
                  <li key={item} className="flex gap-2">
                    <Badge variant="outline">{i + 1}</Badge>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Card>
              <CardHeader><CardTitle>Important Dates</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {admissions.importantDates.map((item) => (
                  <div key={item.label} className="flex justify-between border-b pb-3 last:border-0 last:pb-0">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium">{item.date}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
