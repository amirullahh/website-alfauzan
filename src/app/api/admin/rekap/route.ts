import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdminApi } from "@/lib/api-auth";
import { isValidDate, parsePagination } from "@/lib/validation";

const STATUSES = ["HADIR", "TERLAMBAT", "IZIN", "SAKIT", "ALPA"] as const;

/**
 * GET /api/admin/rekap?tanggalDari=&tanggalSampai=&sessionId=&status=&role=&search=&page=&limit=
 * List + filter rekap kehadiran (dipakai layar #9 dan sebagai sumber export).
 */
export async function GET(request: Request) {
  const guard = await guardAdminApi();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);
  const tanggalDari = searchParams.get("tanggalDari");
  const tanggalSampai = searchParams.get("tanggalSampai");
  const sessionId = searchParams.get("sessionId");
  const status = searchParams.get("status");
  const role = searchParams.get("role");
  const search = searchParams.get("search")?.trim();
  const { page, limit } = parsePagination(searchParams);

  if (tanggalDari && !isValidDate(tanggalDari)) {
    return NextResponse.json({ error: "tanggalDari tidak valid (YYYY-MM-DD)." }, { status: 400 });
  }
  if (tanggalSampai && !isValidDate(tanggalSampai)) {
    return NextResponse.json({ error: "tanggalSampai tidak valid (YYYY-MM-DD)." }, { status: 400 });
  }
  if (status && !(STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
  }

  const where: Record<string, unknown> = {};
  if (tanggalDari || tanggalSampai) {
    where.tanggal = {
      ...(tanggalDari ? { gte: tanggalDari } : {}),
      ...(tanggalSampai ? { lte: tanggalSampai } : {}),
    };
  }
  if (sessionId) where.sessionId = sessionId;
  if (status) where.status = status;
  if (role === "SANTRI" || role === "USTADZ") where.user = { role };
  if (search) {
    where.AND = [
      ...(role === "SANTRI" || role === "USTADZ" ? [{ user: { role } }] : []),
      {
        user: {
          OR: [
            { name: { contains: search } },
            { nis: { contains: search } },
            { nip: { contains: search } },
          ],
        },
      },
    ];
    delete where.user;
  }

  const [total, records] = await Promise.all([
    prisma.attendanceRecord.count({ where }),
    prisma.attendanceRecord.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, role: true, nis: true, nip: true } },
        session: { select: { id: true, name: true, jamMulai: true, jamSelesai: true } },
      },
      orderBy: [{ tanggal: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({ data: records, meta: { total, page, limit } });
}
