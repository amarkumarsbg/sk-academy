"use client";

import { useEffect } from "react";
import { ButtonLink } from "@/components/ui/button-link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-medium text-primary">Something went wrong</p>
      <h1 className="mt-2 text-3xl font-bold">We hit a snag</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Please try again. If the problem continues, contact us and we will help.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
        <ButtonLink href="/">Go Home</ButtonLink>
      </div>
    </div>
  );
}
