"use client";

import { useRef } from "react";
import { ContentImage } from "@/components/public/content-image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteContent } from "@/context/site-content-provider";
import { ButtonLink } from "@/components/ui/button-link";

export function HighlightsCarousel() {
  const { content } = useSiteContent();
  const scrollRef = useRef<HTMLDivElement>(null);
  const section = content.highlightsSection;

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.querySelector("article");
    const amount = card ? card.clientWidth + 24 : container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden bg-muted/30 py-14 sm:py-16">
      <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
              {section.label}
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {section.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
              {section.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition hover:border-primary/30 hover:bg-primary hover:text-primary-foreground"
              aria-label="Scroll highlights left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition hover:border-primary/30 hover:bg-primary hover:text-primary-foreground"
              aria-label="Scroll highlights right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <ButtonLink href="/news" variant="outline" className="ml-2 hidden sm:inline-flex">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </ButtonLink>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {content.highlights.map((item) => (
            <article
              key={item.id}
              className="group w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl bg-card shadow-md ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl sm:w-[300px] lg:w-[320px]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <ContentImage
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="320px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                    Event
                  </span>
                </div>
              </div>
              <div className="space-y-2 p-5">
                <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {item.excerpt}
                </p>
                <Link
                  href="/news"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100"
                >
                  Read more
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
