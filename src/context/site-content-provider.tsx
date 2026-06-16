"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultSiteContent, STORAGE_KEY, CONTENT_VERSION_KEY, CONTENT_VERSION } from "@/data/default-content";
import { mergeStoredSiteContent } from "@/lib/merge-site-content";
import type { SiteContent } from "@/types/site-content";

interface SiteContentContextValue {
  content: SiteContent;
  hydrated: boolean;
  updateContent: (updater: (prev: SiteContent) => SiteContent) => void;
  resetContent: () => void;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedVersion = localStorage.getItem(CONTENT_VERSION_KEY);
      if (storedVersion !== String(CONTENT_VERSION)) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(CONTENT_VERSION_KEY, String(CONTENT_VERSION));
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setContent(mergeStoredSiteContent(JSON.parse(stored)));
      } else {
        setContent(defaultSiteContent);
      }
    } catch {
      setContent(defaultSiteContent);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content, hydrated]);

  const updateContent = useCallback((updater: (prev: SiteContent) => SiteContent) => {
    setContent((prev) => updater(prev));
  }, []);

  const resetContent = useCallback(() => {
    setContent(defaultSiteContent);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ content, hydrated, updateContent, resetContent }),
    [content, hydrated, updateContent, resetContent]
  );

  return (
    <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error("useSiteContent must be used within SiteContentProvider");
  }
  return context;
}

export function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
