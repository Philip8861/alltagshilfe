/**
 * Einfaches In-Memory-Rate-Limiting für Formulare/APIs.
 * Für Multi-Instance später durch Redis ersetzen.
 */
const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 1000; // 1 Minute
const MAX_REQUESTS = 5;

export function rateLimit(identifier: string): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry) {
    store.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true, remaining: MAX_REQUESTS - 1 };
  }

  if (now > entry.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true, remaining: MAX_REQUESTS - 1 };
  }

  entry.count += 1;
  if (entry.count > MAX_REQUESTS) {
    return { success: false, remaining: 0 };
  }
  return { success: true, remaining: MAX_REQUESTS - entry.count };
}
