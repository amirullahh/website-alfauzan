import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdminApi } from "@/lib/api-auth";
import { writeAudit } from "@/lib/audit";
import { isPositiveInt, isTimeRangeValid, isValidTime } from "@/lib/validation";

/** GET /api/admin/sesi — list semua sesi terurut jam mulai. */
export async function GET() {
  const guard = await guardAdminApi();
  if (!guard.ok) return guard.response;

  const data = await prisma.attendanceSession.findMany({
    include: { location: { select: { id: true, name: true } }, _count: { select: { records: true } } },
    orderBy: { jamMulai: "asc" },
  });
  return NextResponse.json({ data });
}

/** POST /api/admin/sesi — tambah sesi (nama & jam wajib match kebijakan §5.2). */
export async function POST(request: Request) {
  const guard = await guardAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const { name, jamMulai, jamSelesai, batasToleransiMenit, locationId } = body ?? {};

  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Nama sesi wajib diisi." }, { status: 400 });
  }
  if (!isValidTime(jamMulai) || !isValidTime(jamSelesai)) {
    return NextResponse.json({ error: "Jam mulai/selesai harus format HH:mm." }, { status: 400 });
  }
  if (!isTimeRangeValid(jamMulai, jamSelesai)) {
    return NextResponse.json({ error: "Jam mulai harus sebelum jam selesai." }, { status: 400 });
  }
  const toleransi = batasToleransiMenit ?? 15;
  if (!isPositiveInt(toleransi)) {
    return NextResponse.json({ error: "Batas toleransi harus bilangan bulat positif (menit)." }, { status: 400 });
  }
  if (locationId !== undefined && locationId !== null) {
    const loc = await prisma.location.findUnique({ where: { id: locationId } });
    if (!loc) return NextResponse.json({ error: "Lokasi tidak ditemukan." }, { status: 400 });
  }

  const created = await prisma.attendanceSession.create({
    data: {
      name: name.trim(),
      jamMulai,
      jamSelesai,
      batasToleransiMenit: toleransi,
      locationId: locationId ?? null,
    },
  });

  await writeAudit({
    actorId: guard.user.id,
    aksi: "CREATE_SESI",
    entitas: "AttendanceSession",
    entitasId: created.id,
    detail: `${created.name} ${created.jamMulai}-${created.jamSelesai}`,
  });

  return NextResponse.json({ data: created }, { status: 201 });
}
