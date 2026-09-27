import { AttendanceStatus } from "@prisma/client";
import {
  timeToMinutes,
  determineAttendanceStatus,
  isSessionActive,
  getCurrentTimeString,
  getCurrentDateString,
} from "../attendance";

describe("timeToMinutes", () => {
  it("converts midnight correctly", () => {
    expect(timeToMinutes("00:00")).toBe(0);
  });

  it("converts noon correctly", () => {
    expect(timeToMinutes("12:00")).toBe(720);
  });

  it("converts arbitrary time correctly", () => {
    expect(timeToMinutes("07:30")).toBe(450);
    expect(timeToMinutes("15:45")).toBe(945);
  });
});

describe("determineAttendanceStatus", () => {
  const session = {
    jamMulai: "07:00",
    jamSelesai: "15:30",
    batasToleransiMenit: 15,
  };

  it("returns HADIR when check-in before start time", () => {
    expect(determineAttendanceStatus("06:45", session)).toBe(
      AttendanceStatus.HADIR
    );
  });

  it("returns HADIR when check-in within tolerance", () => {
    expect(determineAttendanceStatus("07:10", session)).toBe(
      AttendanceStatus.HADIR
    );
  });

  it("returns HADIR when check-in exactly at tolerance boundary", () => {
    expect(determineAttendanceStatus("07:15", session)).toBe(
      AttendanceStatus.HADIR
    );
  });

  it("returns TERLAMBAT when check-in after tolerance", () => {
    expect(determineAttendanceStatus("07:20", session)).toBe(
      AttendanceStatus.TERLAMBAT
    );
  });

  it("returns TERLAMBAT when check-in late but within session", () => {
    expect(determineAttendanceStatus("12:00", session)).toBe(
      AttendanceStatus.TERLAMBAT
    );
  });

  it("returns ALPA when check-in after session ends", () => {
    expect(determineAttendanceStatus("16:00", session)).toBe(
      AttendanceStatus.ALPA
    );
  });
});

describe("getCurrentTimeString", () => {
  it("returns time in HH:mm format", () => {
    const time = getCurrentTimeString();
    expect(time).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe("getCurrentDateString", () => {
  it("returns date in YYYY-MM-DD format", () => {
    const date = getCurrentDateString();
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("isSessionActive", () => {
  // This test is time-dependent, so we test with a wide window
  it("returns correct boolean based on current time", () => {
    const session = {
      jamMulai: "00:00",
      jamSelesai: "23:59",
      batasToleransiMenit: 15,
    };
    expect(isSessionActive(session)).toBe(true);
  });
});
