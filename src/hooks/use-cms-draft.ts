"use client";

import { useEffect } from "react";

export function useUnsavedChangesWarning(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);
}

export function useIsDirty<T>(saved: T, draft: T) {
  const isDirty = JSON.stringify(saved) !== JSON.stringify(draft);
  useUnsavedChangesWarning(isDirty);
  return isDirty;
}

export function useCmsPageDraft<T>(saved: T, draft: T, reset: () => void) {
  const isDirty = useIsDirty(saved, draft);
  return { isDirty, onCancel: reset };
}
