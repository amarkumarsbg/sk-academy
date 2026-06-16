import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PageSectionProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "muted" | "primary";
  containerClassName?: string;
};

export function PageSection({
  children,
  className,
  variant = "default",
  containerClassName,
}: PageSectionProps) {
  return (
    <section
      className={cn(
        "py-10 sm:py-12",
        variant === "muted" && "bg-muted/40",
        variant === "primary" && "bg-primary text-primary-foreground",
        className
      )}
    >
      <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
