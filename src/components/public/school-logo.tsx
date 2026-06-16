"use client";

import { ContentImage } from "@/components/public/content-image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/context/site-content-provider";

type SchoolLogoProps = {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "hero";
  className?: string;
  href?: string | null;
  showName?: boolean;
  nameClassName?: string;
  priority?: boolean;
};

const sizeMap = {
  xs: { className: "h-8 w-8", width: 32, height: 32 },
  sm: { className: "h-10 w-10", width: 40, height: 40 },
  md: { className: "h-12 w-12", width: 48, height: 48 },
  lg: { className: "h-16 w-16", width: 64, height: 64 },
  xl: { className: "h-24 w-24", width: 96, height: 96 },
  hero: { className: "h-36 w-36 sm:h-44 sm:w-44", width: 176, height: 176 },
} as const;

export function SchoolLogo({
  size = "md",
  className,
  href = "/",
  showName = false,
  nameClassName,
  priority = false,
}: SchoolLogoProps) {
  const { content } = useSiteContent();
  const { settings } = content;
  const dimensions = sizeMap[size];

  const image = (
    <ContentImage
      src={settings.logo}
      alt={`${settings.name} logo`}
      width={dimensions.width}
      height={dimensions.height}
      priority={priority}
      className={cn("object-contain", dimensions.className, className)}
    />
  );

  const inner = showName ? (
    <div className="flex items-center gap-3">
      {image}
      <div className={nameClassName}>
        <p className="text-sm font-bold leading-none text-primary">{settings.name}</p>
        <p className="text-xs text-muted-foreground">{settings.location}</p>
      </div>
    </div>
  ) : (
    image
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {inner}
      </Link>
    );
  }

  return <div className="inline-flex shrink-0 items-center">{inner}</div>;
}
