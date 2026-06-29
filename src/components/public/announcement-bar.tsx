"use client";

import Link from "next/link";
import { useSiteContent } from "@/context/site-content-provider";

export function AnnouncementBar() {
  const { content } = useSiteContent();
  const { message, linkText, linkHref } = content.announcement;

  const announcementText = (
    <>
      <span>{message}</span>
      <span className="mx-4 text-white/50">|</span>
      <Link href={linkHref} className="font-medium hover:underline">
        {linkText}
      </Link>
    </>
  );

  return (
    <>
      <div className="bg-primary px-4 py-2.5 text-center text-sm text-primary-foreground sm:hidden">
        <p className="leading-snug">{message}</p>
        <Link href={linkHref} className="mt-1 inline-block font-medium underline underline-offset-2">
          {linkText}
        </Link>
      </div>
      <div className="announcement-marquee hidden bg-primary py-2.5 text-primary-foreground sm:block">
        <div className="announcement-marquee__text text-sm tracking-wide">
          {announcementText}
        </div>
      </div>
    </>
  );
}
