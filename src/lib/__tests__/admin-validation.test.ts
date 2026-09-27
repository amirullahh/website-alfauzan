import {
  isPositiveInt,
  isTimeRangeValid,
  isValidDate,
  isValidLat,
  isValidLng,
  isValidTime,
  parsePagination,
} from "../validation";
import { buildRekapCsv, toRekapRow } from "../rekap-export";

describe("validation", () => {
  it("accepts HH:mm times", () => {
    expect(isValidTime("04:00")).toBe(true);
    expect(isValidTime("15:30")).toBe(true);
    expect(isValidTime("24:00")).toBe(false);
    expect(isValidTime("4:00")).toBe(false);
    expect(isValidTime("")).toBe(false);
    expect(isValidTime(null)).toBe(false);
  });

  it("accepts YYYY-MM-DD dates", () => {
    expect(isValidDate("2026-05-14")).toBe(true);
    expect(isValidDate("14-05-2026")).toBe(false);
    expect(isValidDate("2026-13-01")).toBe(false);
  });

  it("validates coordinates", () => {
    expect(isValidLat(-6.3167507)).toBe(true);
    expect(isValidLat(91)).toBe(false);
    expect(isValidLng(106.8494846)).toBe(true);
    expect(isValidLng(181)).toBe(false);
    expect(isValidLng("106" as unknown as number)).toBe(false);
  });

  it("validates time ranges", () => {
    expect(isTimeRangeValid("04:00", "06:00")).toBe(true);
    expect(isTimeRangeValid("06:00", "06:00")).toBe(false);
    expect(isTimeRangeValid("19:00", "18:00")).toBe(false);
  });

  it("rejects non-positive integers", () => {
    expect(isPositiveInt(100)).toBe(true);
    expect(isPositiveInt(0)).toBe(false);
    expect(isPositiveInt(-5)).toBe(false);
    expect(isPositiveInt(1.5)).toBe(false);
  });

  it("parses pagination with sane bounds", () => {
    expect(parsePagination(new URLSearchParams(""))).toEqual({ page: 1, limit: 20 });
    expect(parsePagination(new URLSearchParams("page=3&limit=50"))).toEqual({ page: 3, limit: 50 });
    expect(parsePagination(new URLSearchParams("page=-2&limit=9999"))).toEqual({ page: 1, limit: 100 });
  });
});

describe("rekap-export", () => {
  const sample = {
    tanggal: "2026-05-14",
    jamMasuk: "07:05",
    jamPulang: "15:30",
    status: "HADIR",
    user: { name: "Ahmad Santri", role: "SANTRI", nis: "2024001", nip: null },
    session: { name: "Madrasah" },
  };

  it("maps a record to a row", () => {
    expect(toRekapRow(sample)).toEqual({
      tanggal: "2026-05-14",
      nama: "Ahmad Santri",
      role: "SANTRI",
      nisNip: "2024001",
      sesi: "Madrasah",
      jamMasuk: "07:05",
      jamPulang: "15:30",
      status: "HADIR",
    });
  });

  it("builds semicolon CSV with BOM and header", () => {
    const csv = buildRekapCsv([toRekapRow(sample)]);
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    const lines = csv.slice(1).split("\r\n");
    expect(lines[0]).toBe("Tanggal;Nama;Role;NIS/NIP;Sesi;Jam Masuk;Jam Pulang;Status");
    expect(lines[1]).toContain("Ahmad Santri");
  });

  it("escapes cells containing semicolons", () => {
    const csv = buildRekapCsv([
      { tanggal: "2026-05-14", nama: "A;B", role: "SANTRI", nisNip: "-", sesi: "Subuh", jamMasuk: "-", jamPulang: "-", status: "ALPA" },
    ]);
    expect(csv.split("\r\n")[1]).toContain('"A;B"');
  });
});
