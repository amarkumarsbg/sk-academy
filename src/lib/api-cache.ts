const DEFAULT_TTL_MS = 30_000;

interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
}

const stores = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string, ttlMs = DEFAULT_TTL_MS): T | undefined {
  const entry = stores.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.fetchedAt > ttlMs) return undefined;
  return entry.data as T;
}

export function getStale<T>(key: string): T | undefined {
  const entry = stores.get(key);
  return entry?.data as T | undefined;
}

export function setCached<T>(key: string, data: T): void {
  stores.set(key, { data, fetchedAt: Date.now() });
}

export function invalidateCache(key: string): void {
  stores.delete(key);
}

export function invalidateCachePrefix(prefix: string): void {
  for (const key of stores.keys()) {
    if (key.startsWith(prefix)) {
      stores.delete(key);
    }
  }
}
