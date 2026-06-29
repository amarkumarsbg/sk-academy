"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/lib/api";
import { getCached, getStale, setCached } from "@/lib/api-cache";

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const USER_CACHE_KEY = "auth:me";

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(() => getStale<CurrentUser>(USER_CACHE_KEY) ?? null);
  const [loading, setLoading] = useState(!getCached<CurrentUser>(USER_CACHE_KEY));

  useEffect(() => {
    const cached = getCached<CurrentUser>(USER_CACHE_KEY);
    if (cached) {
      setUser(cached);
      setLoading(false);
      return;
    }

    const stale = getStale<CurrentUser>(USER_CACHE_KEY);
    if (!stale) {
      setLoading(true);
    }

    getMe()
      .then((res) => {
        setCached(USER_CACHE_KEY, res.user);
        setUser(res.user);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
