"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Clock, Download, Mail, MapPin, Phone } from "lucide-react";
import { ContentImage } from "@/components/public/content-image";
import { SchoolLogo } from "@/components/public/school-logo";
import { publicNav } from "@/lib/config";
import { schoolMapLinkUrl } from "@/lib/school-map";
import { useSiteContent } from "@/context/site-content-provider";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/public/social-icons";
import { ButtonLink } from "@/components/ui/button-link";

const FooterMap = dynamic(
  () => import("@/components/public/footer-map").then((mod) => mod.FooterMap),
  {
    ssr: false,
    loading: () => <div className="h-44 animate-pulse rounded-xl bg-white/10 sm:h-48" />,
  }
);

export function SiteFooter() {
  const { content } = useSiteContent();
  const { settings, footer, contact } = content;

  const quickLinks = publicNav.filter((item) => item.href !== "/");
  const socialLinks = [
    { label: "Facebook", href: settings.social.facebook, icon: FacebookIcon, className: "bg-[#1877F2] hover:bg-[#166fe0]" },
    { label: "YouTube", href: settings.social.youtube, icon: YoutubeIcon, className: "bg-[#FF0000] hover:bg-[#e60000]" },
    { label: "Instagram", href: settings.social.instagram, icon: InstagramIcon, className: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:brightness-110" },
  ];

  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <SchoolLogo size="lg" href="/" showName variant="dark" />
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80">{settings.description}</p>
          <div className="mt-4 flex gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow transition hover:scale-110 ${social.className}`}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-primary-foreground/80 transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">School Information</h3>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {settings.address}
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {settings.phone}
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {settings.email}
            </li>
            {contact.officeHours.map((line) => (
              <li key={line} className="flex gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">Extras</h3>
          <div className="space-y-3">
            <ButtonLink
              href={footer.brochureUrl || "/admissions#brochure"}
              variant="secondary"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Brochure
            </ButtonLink>
            <ButtonLink
              href="/contact"
              variant="outline"
              className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              Contact Us
            </ButtonLink>
          </div>
          <div className="mt-4">
            <a
              href={schoolMapLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-xl ring-1 ring-white/10 transition hover:ring-accent/40"
              aria-label="Open SK Academy location in Google Maps"
            >
              <div className="h-44 sm:h-48">
                <FooterMap />
              </div>
            </a>
            <a
              href={schoolMapLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-primary-foreground/70 underline-offset-2 hover:text-accent hover:underline"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden border-t border-white/10">
        <div className="relative h-32 opacity-30">
          <ContentImage src={footer.backgroundImage} alt="SK Academy campus" fill className="object-cover" sizes="100vw" />
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-primary-foreground/70 sm:text-sm">
        <p>
          Copyright © {new Date().getFullYear()} {settings.name}. All rights reserved.
          {" · "}
          <Link href="/privacy" className="hover:text-white">
            Privacy Policy
          </Link>
          {" · "}
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
        </p>
      </div>
    </footer>
  );
}
