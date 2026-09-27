/**
 * In-memory sliding-window rate limiter for login attempts.
 *
 * Keyed by normalized login identifier. Blocks brute-force attacks with a
 * generic failure response (no user enumeration). NOTE: counters live in
 * process memory, so they are per-instance — fine for v1 single-instance
 * deploy; move to Redis/Upstash when scaling horizontally.
 */
const WINDOW_MS = 10 * 60 * 1000; // 10 menit
const MAX_FAILS = 10; // maks 10x gagal per window

const failures = new Map<string, number[]>();

function prune(key: string, now: number): number[] {
  const recent = (failures.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length === 0) {
    failures.delete(key);
  } else {
    failures.set(key, recent);
  }
  return recent;
}

export function normalizeLoginKey(identifier: string): string {
  return identifier.trim().toLowerCase();
}

export function isLoginBlocked(key: string): boolean {
  return prune(key, Date.now()).length >= MAX_FAILS;
}

export function recordLoginFailure(key: string): void {
  const now = Date.now();
  const recent = prune(key, now);
  recent.push(now);
  failures.set(key, recent);
}

export function clearLoginFailures(key: string): void {
  failures.delete(key);
}
