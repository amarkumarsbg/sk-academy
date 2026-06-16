"use client";

import Link from "next/link";
import { ContentImage } from "@/components/public/content-image";
import { Mail, MapPin, Phone } from "lucide-react";
import { publicNav } from "@/lib/config";
import { useSiteContent } from "@/context/site-content-provider";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/public/social-icons";

export function SiteFooter() {
  const { content } = useSiteContent();
  const { settings, footer } = content;

  const socialLinks = [
    { label: "Facebook", href: settings.social.facebook, icon: FacebookIcon, className: "bg-[#1877F2] hover:bg-[#166fe0]" },
    { label: "YouTube", href: settings.social.youtube, icon: YoutubeIcon, className: "bg-[#FF0000] hover:bg-[#e60000]" },
    { label: "Instagram", href: settings.social.instagram, icon: InstagramIcon, className: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:brightness-110" },
  ];

  return (
    <footer>
      <div className="bg-primary py-10 text-primary-foreground">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:grid-cols-3 sm:gap-6 sm:px-6">
          {[
            { icon: MapPin, lines: [settings.address] },
            { icon: Phone, lines: [settings.phone] },
            { icon: Mail, lines: [settings.email, settings.admissionsEmail] },
          ].map((item) => (
            <div key={item.lines[0]} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <item.icon className="h-6 w-6" />
              </div>
              {item.lines.map((line) => (
                <p key={line} className="text-sm leading-relaxed text-primary-foreground/95">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden">
        <ContentImage src={footer.backgroundImage} alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-primary/80" />

        <div className="relative px-4 py-12 sm:px-6">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-4 gap-y-3">
            {publicNav.filter((item) => item.href !== "/").map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/90 transition hover:text-white sm:text-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex items-center justify-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-white shadow-md transition hover:scale-110 ${social.className}`}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-primary px-4 py-4 text-center text-xs text-primary-foreground/70 sm:text-sm">
        <p>
          Copyright © {new Date().getFullYear()} {settings.name}. All rights reserved.
          {" · "}
          <Link href="/contact" className="hover:text-white">
            Privacy Policy
          </Link>
        </p>
      </div>
    </footer>
  );
}
