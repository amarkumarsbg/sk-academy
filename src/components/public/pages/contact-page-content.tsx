"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/public/contact-form";
import { PageCta } from "@/components/public/page-cta";
import { PageHero } from "@/components/public/page-hero";
import { PageSection } from "@/components/public/page-section";
import { SectionHeading } from "@/components/public/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSiteContent } from "@/context/site-content-provider";

function formatPhone(phone: string) {
  if (!phone) return "";
  const cleaned = phone.replace(/\s+/g, "");
  if (cleaned.startsWith("+91") && cleaned.length === 13) {
    return `+91 ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
  }
  return phone;
}

export function ContactPageContent() {
  const { content } = useSiteContent();
  const { contact, settings } = content;

  return (
    <>
      <PageHero title={contact.hero.title} description={contact.hero.description} />
      <PageSection>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading title="Get in Touch" className="mb-2" />
            <div className="mt-8 space-y-7">
              {[
                { icon: MapPin, label: "Address", value: settings.address },
                { icon: Phone, label: "Phone", value: formatPhone(settings.phone) || settings.phone },
                { icon: Mail, label: "Email", value: settings.email },
              ].map((item) => (
                <div key={item.label} className="flex gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" aria-hidden />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <Card className="card-interactive mt-10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Office Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                {contact.officeHours.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </CardContent>
            </Card>
          </div>
          <div>
            <SectionHeading title="Send a Message" description="We typically respond within one business day." />
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </PageSection>
      <PageCta title="Visit Our Campus" description="Schedule a campus tour or speak with our admissions team today." />
    </>
  );
}
