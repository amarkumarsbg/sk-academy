"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { createResource, deleteResource, fetchResource, updateResource } from "@/lib/api";

export function useResource<T extends { id: string }>(
  resource: string,
  options?: { enabled?: boolean }
) {
  const enabled = options?.enabled ?? true;
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchResource<T>(resource);
      setItems(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [enabled, resource]);

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
    setItems((prev) => [created, ...prev]);
    return created;
  };

  const update = async (id: string, data: T) => {
    const updated = await updateResource<T>(resource, id, data);
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const remove = async (id: string) => {
    await deleteResource(resource, id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return { items, loading, error, load, create, update, remove };
}
