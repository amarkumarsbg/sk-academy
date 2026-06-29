"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { publicNav } from "@/lib/config";
import { SchoolLogo } from "@/components/public/school-logo";
import { useSiteContent } from "@/context/site-content-provider";
import { ButtonLink } from "@/components/ui/button-link";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { content } = useSiteContent();
  const { settings } = content;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1 sm:hidden">
          <SchoolLogo size="sm" showName showLocation={false} priority />
        </div>
        <div className="hidden min-w-0 sm:block">
          <SchoolLogo size="md" showName showLocation={false} priority />
        </div>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-foreground/70"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/admissions" size="sm" className="hidden md:inline-flex">
            Apply Now
          </ButtonLink>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted lg:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mb-4 flex justify-center">
                <SchoolLogo size="lg" href={null} />
              </div>
              <SheetTitle className="text-center">{settings.name}</SheetTitle>
              <p className="text-center text-xs text-muted-foreground">{settings.tagline}</p>
              <nav className="mt-6 flex flex-col gap-1">
                {publicNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <ButtonLink href="/admissions" className="mt-6 w-full" onClick={() => setOpen(false)}>
                Apply Now
              </ButtonLink>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
