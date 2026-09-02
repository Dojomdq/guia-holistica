// Rate limiter en memoria (por IP) para login.
// Simple y suficiente para este proyecto; sin dependencias externas.
const WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_ATTEMPTS = 5;

const store = new Map<string, number[]>();

export function rateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (store.get(ip) || []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_ATTEMPTS) {
    store.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  store.set(ip, timestamps);
  return false;
}

export function rateLimitInfo(ip: string): { remaining: number; retryAfter: number } {
  const now = Date.now();
  const timestamps = (store.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  const oldest = timestamps.length ? Math.min(...timestamps) : now;
  const retryAfter = Math.max(0, Math.ceil((oldest + WINDOW_MS - now) / 1000));
  return { remaining: Math.max(0, MAX_ATTEMPTS - timestamps.length), retryAfter };
}
