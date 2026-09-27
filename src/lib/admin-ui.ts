/**
 * Pure UI helpers for the admin dashboard (Fase 2).
 * No browser/Next APIs here so these stay unit-testable under node.
 */

/** Attendance status keys returned by `/api/admin/stats` (domain terms stay Indonesian). */
export const STATUS_ORDER = ["HADIR", "TERLAMBAT", "IZIN", "SAKIT", "ALPA"] as const;

export type StatusKey = (typeof STATUS_ORDER)[number];

/**
 * Status badge styling — literal tokens, no derived palettes.
 * Hadir = hijau, Izin/Sakit = amber, Alpa = merah (CLAUDE.md design tokens).
 * TERLAMBAT gets its own orange so it never collides with IZIN/SAKIT amber.
 */
export const STATUS_STYLE: Record<StatusKey, { dot: string; softBg: string; softText: string }> = {
  HADIR: { dot: "#16A34A", softBg: "#DCFCE7", softText: "#166534" },
  TERLAMBAT: { dot: "#EA580C", softBg: "#FFEDD5", softText: "#9A3412" },
  IZIN: { dot: "#D97706", softBg: "#FEF3C7", softText: "#92400E" },
  SAKIT: { dot: "#D97706", softBg: "#FEF3C7", softText: "#92400E" },
  ALPA: { dot: "#DC2626", softBg: "#FEE2E2", softText: "#991B1B" },
};

/**
 * Fixed session windows (PRD §5.2). Names & hours must match exactly
 * everywhere — mobile & dashboard. Used as form suggestions, never invented.
 */
export const SESI_DEFAULTS: ReadonlyArray<{
  name: string;
  jamMulai: string;
  jamSelesai: string;
}> = [
  { name: "Subuh", jamMulai: "04:00", jamSelesai: "06:00" },
  { name: "Madrasah", jamMulai: "07:00", jamSelesai: "15:30" },
  { name: "Ashar", jamMulai: "15:00", jamSelesai: "16:30" },
  { name: "Maghrib", jamMulai: "18:00", jamSelesai: "19:00" },
  { name: "Isya", jamMulai: "19:00", jamSelesai: "20:30" },
];

/** Local "YYYY-MM-DD" for `<input type="date">` defaults (device timezone). */
export function todayLocalISO(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** "2026-09-20" → "Minggu, 20 September 2026" (id-ID). Falls back to input on garbage. */
export function formatTanggalID(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "04:00" + "06:00" → "04.00–06.00 WIB" (Indonesian time punctuation). */
export function jamRange(jamMulai: string, jamSelesai: string): string {
  const fmt = (t: string) => t.replace(":", ".");
  return `${fmt(jamMulai)}–${fmt(jamSelesai)} WIB`;
}

/** Look up the §5.2 default window for a session name (case-insensitive). */
export function defaultWindowFor(name: string): { jamMulai: string; jamSelesai: string } | null {
  const found = SESI_DEFAULTS.find((s) => s.name.toLowerCase() === name.trim().toLowerCase());
  return found ? { jamMulai: found.jamMulai, jamSelesai: found.jamSelesai } : null;
}

/**
 * Default pondok geofence (CLAUDE.md §Identitas & Branding).
 * Map fallback & form defaults — never invented elsewhere.
 */
export const PONDOK_DEFAULT = {
  lat: -6.3167507,
  lng: 106.8494846,
  radiusMeter: 100,
} as const;
