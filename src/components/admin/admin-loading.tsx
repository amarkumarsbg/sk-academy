import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
} as const;

export function LoadingSpinner({
  className,
  size = "md",
}: {
  className?: string;
  size?: keyof typeof sizeClasses;
}) {
  return (
    <Loader2
      className={cn("animate-spin", sizeClasses[size], className)}
      aria-hidden
    />
  );
}

export function AdminLoadingText({
  label = "Loading...",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <LoadingSpinner size="sm" />
      {label}
    </span>
  );
}

export function AdminPageLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <LoadingSpinner size="lg" className="text-primary" />
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function AdminButtonSpinner({ label }: { label: string }) {
  return (
    <>
      <LoadingSpinner size="sm" className="mr-2 text-current" />
      {label}
    </>
  );
}

export function AdminStatLoading() {
  return (
    <span className="inline-flex items-center py-1" aria-label="Loading">
      <LoadingSpinner size="md" className="text-primary" />
    </span>
  );
}
