"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { getCached, getStale, invalidateCache, setCached } from "@/lib/api-cache";
import { createResource, deleteResource, fetchResource, updateResource } from "@/lib/api";

const RESOURCE_CACHE_PREFIX = "resource:";

export function invalidateResourceCache(resource: string) {
  invalidateCache(`${RESOURCE_CACHE_PREFIX}${resource}`);
}

export function useResource<T extends { id: string }>(
  resource: string,
  options?: { enabled?: boolean }
) {
  const enabled = options?.enabled ?? true;
  const cacheKey = `${RESOURCE_CACHE_PREFIX}${resource}`;
  const [items, setItems] = useState<T[]>(() => getStale<T[]>(cacheKey) ?? []);
  const [loading, setLoading] = useState(enabled && !getCached<T[]>(cacheKey));
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!enabled) return;

    const cached = getCached<T[]>(cacheKey);
    const stale = getStale<T[]>(cacheKey);

    if (cached) {
      setItems(cached);
      setLoading(false);
      return;
    }

    if (stale) {
      setItems(stale);
    } else {
      setLoading(true);
    }

    setError("");
    try {
      const data = await fetchResource<T>(resource);
      setCached(cacheKey, data);
      setItems(data);
    } catch (err) {
      if (!stale) {
        setError(err instanceof ApiError ? err.message : "Failed to load data");
      }
    } finally {
      setLoading(false);
    }
  }, [cacheKey, enabled, resource]);

  useEffect(() => {
    if (!enabled) {
      setItems([]);
      setLoading(false);
      setError("");
      return;
    }
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load when resource changes
  }, [enabled, resource]);

  const create = async (data: T) => {
    const created = await createResource<T>(resource, data);
    invalidateResourceCache(resource);
    setItems((prev) => {
      const next = [created, ...prev];
      setCached(cacheKey, next);
      return next;
    });
    return created;
  };

  const update = async (id: string, data: T) => {
    const updated = await updateResource<T>(resource, id, data);
    invalidateResourceCache(resource);
    setItems((prev) => {
      const next = prev.map((item) => (item.id === id ? updated : item));
      setCached(cacheKey, next);
      return next;
    });
    return updated;
  };

  const remove = async (id: string) => {
    await deleteResource(resource, id);
    invalidateResourceCache(resource);
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      setCached(cacheKey, next);
      return next;
    });
  };

  return { items, loading, error, load, create, update, remove };
}
