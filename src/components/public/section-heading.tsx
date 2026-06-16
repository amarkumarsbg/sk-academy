import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({ title, description, centered, className }: SectionHeadingProps) {
  return (
    <div className={cn(centered && "text-center", className)}>
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
      {description && (
        <p className={cn("mt-2 text-muted-foreground", centered && "mx-auto max-w-2xl")}>
          {description}
        </p>
      )}
    </div>
  );
}
