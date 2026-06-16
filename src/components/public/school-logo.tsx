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
  showLocation?: boolean;
  variant?: "light" | "dark";
  nameClassName?: string;
  priority?: boolean;
};

const sizeMap = {
  xs: { className: "h-9 w-9", width: 36, height: 36 },
  sm: { className: "h-10 w-10", width: 40, height: 40 },
  md: { className: "h-11 w-11", width: 44, height: 44 },
  lg: { className: "h-14 w-14", width: 56, height: 56 },
  xl: { className: "h-20 w-20", width: 80, height: 80 },
  hero: { className: "h-36 w-36 sm:h-44 sm:w-44", width: 176, height: 176 },
} as const;

export function SchoolLogo({
  size = "md",
  className,
  href = "/",
  showName = false,
  showLocation = true,
  variant = "light",
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
      className={cn("shrink-0 rounded-full object-contain", dimensions.className, className)}
    />
  );

  const inner = showName ? (
    <div className="flex min-w-0 items-center gap-2.5">
      {image}
      <div className={cn("min-w-0 leading-tight", nameClassName)}>
        <p
          className={cn(
            "truncate text-sm font-bold sm:text-base",
            variant === "dark" ? "text-primary-foreground" : "text-primary"
          )}
        >
          {settings.name}
        </p>
        {showLocation && (
          <p
            className={cn(
              "truncate text-[11px] sm:text-xs",
              variant === "dark" ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
          >
            {settings.location}
          </p>
        )}
      </div>
    </div>
  ) : (
    image
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex max-w-full shrink-0 items-center">
        {inner}
      </Link>
    );
  }

  return <div className="inline-flex max-w-full shrink-0 items-center">{inner}</div>;
}
