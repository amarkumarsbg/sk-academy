"use client";

import { PageHero } from "@/components/public/page-hero";
import { SectionHeading } from "@/components/public/section-heading";
import { AdmissionInquiryForm } from "@/components/public/admission-inquiry-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { useSiteContent } from "@/context/site-content-provider";
import { Download } from "lucide-react";

export function AdmissionsPageContent() {
  const { content } = useSiteContent();
  const { admissions, footer } = content;

  return (
    <>
      <PageHero title={admissions.hero.title} description={admissions.hero.description} />
      <section className="border-b bg-muted/40 py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <AdmissionInquiryForm />
          <div className="flex flex-col justify-center">
            <SectionHeading
              title="Start Your Journey"
              description="Admissions for 2026–27 are now open. Submit an inquiry or download our brochure to learn more."
            />
            <Card id="brochure" className="card-interactive mt-6 border-accent/20 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Download className="h-5 w-5 text-accent" />
                  School Brochure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Download our brochure for details on curriculum, facilities, fees, and the admission process.
                </p>
                <ButtonLink href={footer.brochureUrl || "#"} className="mt-4" variant="outline">
                  Download Brochure (Demo)
                </ButtonLink>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Admission Process" description="A simple four-step process to enroll your child." centered className="mb-12" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {admissions.steps.map((step) => (
              <Card key={step.step} className="card-interactive border-0 bg-white">
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
            <Card className="card-interactive border-0 bg-white">
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
