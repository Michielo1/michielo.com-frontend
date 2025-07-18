// Cache utility for localStorage with expiration
const CACHE_DURATION_MS = 3 * 60 * 60 * 1000; // 3 hours

export function getCache<T = any>(key: string): T | null {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  try {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION_MS) {
      return data;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

export function setCache(key: string, data: any) {
  localStorage.setItem(
    key,
    JSON.stringify({ data, timestamp: Date.now() })
  );
} 