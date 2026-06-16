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
    <div className="announcement-marquee bg-primary py-2.5 text-primary-foreground">
      <div className="announcement-marquee__text text-sm tracking-wide">
        {announcementText}
      </div>
    </div>
  );
}
