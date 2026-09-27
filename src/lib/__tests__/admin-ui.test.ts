import {
  PONDOK_DEFAULT,
  STATUS_ORDER,
  STATUS_STYLE,
  defaultWindowFor,
  formatTanggalID,
  jamRange,
  todayLocalISO,
} from "@/lib/admin-ui";

describe("admin-ui helpers (Fase 2)", () => {
  test("STATUS_ORDER covers all five domain statuses", () => {
    expect(STATUS_ORDER).toEqual(["HADIR", "TERLAMBAT", "IZIN", "SAKIT", "ALPA"]);
  });

  test("STATUS_STYLE uses literal design tokens (green/amber/red)", () => {
    expect(STATUS_STYLE.HADIR.dot).toBe("#16A34A");
    expect(STATUS_STYLE.IZIN.dot).toBe("#D97706");
    expect(STATUS_STYLE.SAKIT.dot).toBe("#D97706");
    expect(STATUS_STYLE.ALPA.dot).toBe("#DC2626");
    // TERLAMBAT must NOT reuse the IZIN/SAKIT amber — stays distinguishable.
    expect(STATUS_STYLE.TERLAMBAT.dot).not.toBe(STATUS_STYLE.IZIN.dot);
  });

  test("todayLocalISO returns device-local YYYY-MM-DD", () => {
    expect(todayLocalISO(new Date(2026, 8, 20))).toBe("2026-09-20");
    expect(todayLocalISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test("formatTanggalID renders Indonesian long date, passes garbage through", () => {
    expect(formatTanggalID("2026-09-20")).toBe("Minggu, 20 September 2026");
    expect(formatTanggalID("bukan-tanggal")).toBe("bukan-tanggal");
  });

  test("jamRange uses Indonesian dot punctuation + WIB", () => {
    expect(jamRange("04:00", "06:00")).toBe("04.00–06.00 WIB");
  });

  test("defaultWindowFor matches PRD §5.2 windows case-insensitively", () => {
    expect(defaultWindowFor("subuh")).toEqual({ jamMulai: "04:00", jamSelesai: "06:00" });
    expect(defaultWindowFor(" Madrasah ")).toEqual({ jamMulai: "07:00", jamSelesai: "15:30" });
    expect(defaultWindowFor("Dhuha")).toBeNull();
  });

  test("PONDOK_DEFAULT matches the official geofence identity", () => {
    expect(PONDOK_DEFAULT.lat).toBe(-6.3167507);
    expect(PONDOK_DEFAULT.lng).toBe(106.8494846);
    expect(PONDOK_DEFAULT.radiusMeter).toBe(100);
  });
});
