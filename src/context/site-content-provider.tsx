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
import { defaultSiteContent } from "@/data/default-content";
import { saveSiteContent } from "@/lib/api";
import type { SiteContent } from "@/types/site-content";

interface SiteContentContextValue {
  content: SiteContent;
  hydrated: boolean;
  saving: boolean;
  lastSavedAt: Date | null;
  updateContent: (updater: (prev: SiteContent) => SiteContent) => Promise<void>;
  resetContent: () => void;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({
  children,
  initialContent = defaultSiteContent,
}: {
  children: ReactNode;
  initialContent?: SiteContent;
}) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    setContent(initialContent);
    setHydrated(true);
  }, [initialContent]);

  const updateContent = useCallback(async (updater: (prev: SiteContent) => SiteContent) => {
    let nextContent!: SiteContent;
    setContent((prev) => {
      nextContent = updater(prev);
      return nextContent;
    });

    setSaving(true);
    try {
      const saved = await saveSiteContent(nextContent);
      setContent(saved);
      setLastSavedAt(new Date());
    } finally {
      setSaving(false);
    }
  }, []);

  const resetContent = useCallback(() => {
    setContent(defaultSiteContent);
  }, []);

  const value = useMemo(
    () => ({ content, hydrated, saving, lastSavedAt, updateContent, resetContent }),
    [content, hydrated, saving, lastSavedAt, updateContent, resetContent]
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
