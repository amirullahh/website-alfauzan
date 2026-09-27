import { AttendanceStatus } from "@prisma/client";

export interface SessionTime {
  jamMulai: string; // HH:mm
  jamSelesai: string; // HH:mm
  batasToleransiMenit: number;
}

/**
 * Parse time string "HH:mm" to minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Get current time in "HH:mm" format (WIB)
 */
export function getCurrentTimeString(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

/**
 * Get current date in "YYYY-MM-DD" format
 */
export function getCurrentDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

/**
 * Determine attendance status based on check-in time vs session schedule
 */
export function determineAttendanceStatus(
  checkInTime: string,
  session: SessionTime
): AttendanceStatus {
  const checkInMinutes = timeToMinutes(checkInTime);
  const startMinutes = timeToMinutes(session.jamMulai);
  const toleranceMinutes = session.batasToleransiMenit;

  // Within tolerance window = Hadir (present)
  if (checkInMinutes <= startMinutes + toleranceMinutes) {
    return AttendanceStatus.HADIR;
  }

  // After tolerance but within session = Terlambat (late)
  const endMinutes = timeToMinutes(session.jamSelesai);
  if (checkInMinutes <= endMinutes) {
    return AttendanceStatus.TERLAMBAT;
  }

  // After session ends = Alpa (absent) — should be blocked by UI but handle anyway
  return AttendanceStatus.ALPA;
}

/**
 * Check if a session is currently active
 */
export function isSessionActive(session: SessionTime): boolean {
  const now = timeToMinutes(getCurrentTimeString());
  const start = timeToMinutes(session.jamMulai);
  const end = timeToMinutes(session.jamSelesai);
  return now >= start && now <= end;
}

/**
 * Get active session based on current time
 */
export function getActiveSession(sessions: { id: string; name: string; jamMulai: string; jamSelesai: string; batasToleransiMenit: number }[]): (typeof sessions)[0] | null {
  const now = timeToMinutes(getCurrentTimeString());
  return (
    sessions.find((s) => {
      const start = timeToMinutes(s.jamMulai);
      const end = timeToMinutes(s.jamSelesai);
      return now >= start && now <= end;
    }) || null
  );
}
