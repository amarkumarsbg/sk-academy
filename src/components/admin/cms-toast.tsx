"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

interface CmsToastContextValue {
  showToast: (message: string) => void;
}

const CmsToastContext = createContext<CmsToastContextValue | null>(null);

export function CmsToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback((text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 3500);
  }, []);

  return (
    <CmsToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div
          role="status"
          className="fixed bottom-24 right-4 z-[100] flex max-w-sm items-center gap-2 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg sm:bottom-6"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}
    </CmsToastContext.Provider>
  );
}

export function useCmsToast() {
  const context = useContext(CmsToastContext);
  if (!context) {
    throw new Error("useCmsToast must be used within CmsToastProvider");
  }
  return context;
}

export function markCmsSectionSaved(storageKey: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey, new Date().toISOString());
}

export function getCmsSectionSavedAt(storageKey: string): Date | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}
