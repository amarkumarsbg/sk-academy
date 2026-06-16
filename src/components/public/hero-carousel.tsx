"use client";

import { useCallback, useEffect, useState } from "react";
import { ContentImage } from "@/components/public/content-image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { useSiteContent } from "@/context/site-content-provider";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 5000;

export function HeroCarousel() {
  const { content } = useSiteContent();
  const { heroSlides } = content;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (heroSlides.length === 0) return;
      setActive((index + heroSlides.length) % heroSlides.length);
    },
    [heroSlides.length]
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused || heroSlides.length === 0) return;
    const timer = setInterval(next, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [next, paused, heroSlides.length]);

  if (heroSlides.length === 0) return null;

  return (
    <section
      className="relative h-[420px] w-full overflow-hidden sm:h-[500px] lg:h-[580px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="School highlights"
    >
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            index === active ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
          aria-hidden={index !== active}
        >
          <div className="relative h-full w-full">
            <ContentImage
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/55 to-primary/20" />

          <div className="relative z-10 flex h-full items-center">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl text-primary-foreground">
                <p className="mb-3 text-sm font-medium uppercase tracking-widest text-white/80">
                  {content.settings.name} · {index + 1} / {heroSlides.length}
                </p>
                <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  {slide.title}
                </h1>
                <p className="mt-4 text-base text-white/90 sm:text-lg">{slide.subtitle}</p>
                <ButtonLink
                  href={slide.ctaHref}
                  size="lg"
                  variant="secondary"
                  className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {slide.cta}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={prev}
        className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 sm:left-6"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 sm:right-6 lg:right-16 xl:right-[4.5rem]"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              index === active ? "w-8 bg-accent" : "w-2 bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === active}
          />
        ))}
      </div>
    </section>
  );
}
