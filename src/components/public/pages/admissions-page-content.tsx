"use client";

import { PageHero } from "@/components/public/page-hero";
import { PageSection } from "@/components/public/page-section";
import { PageCta } from "@/components/public/page-cta";
import { SectionHeading } from "@/components/public/section-heading";
import { AdmissionInquiryForm } from "@/components/public/admission-inquiry-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import { useSiteContent } from "@/context/site-content-provider";
import { Download } from "lucide-react";

export function AdmissionsPageContent() {
  const { content } = useSiteContent();
  const { admissions, footer } = content;

  return (
    <>
      <PageHero title={admissions.hero.title} description={admissions.hero.description} />
      <PageSection variant="muted">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <AdmissionInquiryForm />
          <div className="flex flex-col justify-center">
            <SectionHeading
              title="Start Your Journey"
              description="Admissions for 2026–27 are now open. Submit an inquiry or download our brochure to learn more."
            />
            <Card id="brochure" className="card-interactive mt-6 border-accent/20 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Download className="h-5 w-5 text-accent" aria-hidden />
                  School Brochure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Download our brochure for details on curriculum, facilities, fees, and the admission process.
                </p>
                <ButtonLink href={footer.brochureUrl || "#"} className="mt-4" variant="outline">
                  Download Brochure
                </ButtonLink>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <SectionHeading
          title="Admission Process"
          description="A simple four-step process to enroll your child."
          centered
          className="mb-8"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {admissions.steps.map((step) => (
            <Card key={step.step} className="card-interactive flex h-full flex-col border-0 bg-white">
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
      </PageSection>

      <PageSection variant="muted">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div>
            <SectionHeading title="Eligibility & Documents" />
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {admissions.eligibilityItems.map((item, i) => (
                <li key={item} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Card className="card-interactive h-full border-0 bg-white">
            <CardHeader>
              <CardTitle>Important Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {admissions.importantDates.map((item) => (
                <div key={item.label} className="flex justify-between gap-4 border-b pb-3 last:border-0 last:pb-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageCta />
    </>
  );
}
