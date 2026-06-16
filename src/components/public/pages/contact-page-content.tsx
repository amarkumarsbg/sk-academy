"use client";

import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { SectionHeading } from "@/components/public/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSiteContent } from "@/context/site-content-provider";

export function ContactPageContent() {
  const { content } = useSiteContent();
  const { contact, settings } = content;

  return (
    <>
      <PageHero title={contact.hero.title} description={contact.hero.description} />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading title="Get in Touch" />
              <div className="mt-8 space-y-6">
                {[
                  { icon: MapPin, label: "Address", value: settings.address },
                  { icon: Phone, label: "Phone", value: settings.phone },
                  { icon: Mail, label: "Email", value: settings.email },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Card className="mt-8">
                <CardHeader><CardTitle className="text-base">Office Hours</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {contact.officeHours.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <SectionHeading title="Send a Message" description="Demo form — backend integration coming soon." />
              <Card className="mt-8">
                <CardContent className="pt-6">
                  <form className="space-y-4">
                    <input className="flex h-9 w-full rounded-md border px-3 text-sm" placeholder="Your name" />
                    <input className="flex h-9 w-full rounded-md border px-3 text-sm" placeholder="Email" />
                    <textarea rows={4} className="flex w-full rounded-md border px-3 py-2 text-sm" placeholder="Message" />
                    <button type="button" className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary text-sm text-primary-foreground">
                      Send Message (Demo)
                    </button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
