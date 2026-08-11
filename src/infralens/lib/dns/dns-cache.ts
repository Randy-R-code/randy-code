import { DNS_CACHE_TTL_MS } from "@infralens-config/constants";

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

export function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.value as T;
}

export function setCache<T>(key: string, value: T, ttl = DNS_CACHE_TTL_MS) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttl,
  });
}
