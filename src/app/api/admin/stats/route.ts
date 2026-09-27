import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdminApi } from "@/lib/api-auth";
import { isValidDate } from "@/lib/validation";
import { getCurrentDateString } from "@/lib/attendance";

/**
 * GET /api/admin/stats?tanggal=YYYY-MM-DD
 * Ringkasan harian: counts per status + per sesi + total santri/ustadz.
 */
export async function GET(request: Request) {
  const guard = await guardAdminApi();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);
  const tanggalParam = searchParams.get("tanggal");
  const tanggal = tanggalParam ?? getCurrentDateString();
  if (!isValidDate(tanggal)) {
    return NextResponse.json({ error: "Format tanggal tidak valid (YYYY-MM-DD)." }, { status: 400 });
  }

  const [records, sessions, santriCount, ustadzCount, izinSakit] = await Promise.all([
    prisma.attendanceRecord.findMany({
      where: { tanggal },
      select: { status: true, sessionId: true },
    }),
    prisma.attendanceSession.findMany({
      select: { id: true, name: true },
      orderBy: { jamMulai: "asc" },
    }),
    prisma.user.count({ where: { role: "SANTRI", statusAkun: "AKTIF" } }),
    prisma.user.count({ where: { role: "USTADZ", statusAkun: "AKTIF" } }),
    prisma.izinSakit.findMany({
      where: { tanggalMulai: { lte: tanggal }, OR: [{ tanggalSelesai: null }, { tanggalSelesai: { gte: tanggal } }] },
      select: { jenis: true },
    }),
  ]);

  const byStatus: Record<string, number> = { HADIR: 0, TERLAMBAT: 0, IZIN: 0, SAKIT: 0, ALPA: 0 };
  for (const r of records) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
  for (const iz of izinSakit) byStatus[iz.jenis] = (byStatus[iz.jenis] ?? 0) + 1;

  const bySession = sessions.map((s) => {
    const counts: Record<string, number> = { HADIR: 0, TERLAMBAT: 0, IZIN: 0, SAKIT: 0, ALPA: 0 };
    for (const r of records) {
      if (r.sessionId === s.id) counts[r.status] = (counts[r.status] ?? 0) + 1;
    }
    return { sessionId: s.id, sessionName: s.name, ...counts };
  });

  return NextResponse.json({
    data: { tanggal, byStatus, bySession, totalSantri: santriCount, totalUstadz: ustadzCount },
  });
}
