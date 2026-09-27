import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdminApi } from "@/lib/api-auth";
import { writeAudit } from "@/lib/audit";
import { isPositiveInt, isTimeRangeValid, isValidTime } from "@/lib/validation";

/** PUT /api/admin/sesi/[id] — ubah sesi. */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await guardAdminApi();
  if (!guard.ok) return guard.response;
  const { id } = await params;

  const existing = await prisma.attendanceSession.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Sesi tidak ditemukan." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const { name, jamMulai, jamSelesai, batasToleransiMenit, locationId } = body ?? {};

  const nextJamMulai = jamMulai ?? existing.jamMulai;
  const nextJamSelesai = jamSelesai ?? existing.jamSelesai;
  if (jamMulai !== undefined && !isValidTime(jamMulai)) {
    return NextResponse.json({ error: "Jam mulai harus format HH:mm." }, { status: 400 });
  }
  if (jamSelesai !== undefined && !isValidTime(jamSelesai)) {
    return NextResponse.json({ error: "Jam selesai harus format HH:mm." }, { status: 400 });
  }
  if (!isTimeRangeValid(nextJamMulai, nextJamSelesai)) {
    return NextResponse.json({ error: "Jam mulai harus sebelum jam selesai." }, { status: 400 });
  }
  if (batasToleransiMenit !== undefined && !isPositiveInt(batasToleransiMenit)) {
    return NextResponse.json({ error: "Batas toleransi harus bilangan bulat positif (menit)." }, { status: 400 });
  }
  if (locationId !== undefined && locationId !== null) {
    const loc = await prisma.location.findUnique({ where: { id: locationId } });
    if (!loc) return NextResponse.json({ error: "Lokasi tidak ditemukan." }, { status: 400 });
  }
  if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
    return NextResponse.json({ error: "Nama sesi tidak boleh kosong." }, { status: 400 });
  }

  const updated = await prisma.attendanceSession.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name: name.trim() } : {}),
      jamMulai: nextJamMulai,
      jamSelesai: nextJamSelesai,
      ...(batasToleransiMenit !== undefined ? { batasToleransiMenit } : {}),
      ...(locationId !== undefined ? { locationId } : {}),
    },
  });

  await writeAudit({
    actorId: guard.user.id,
    aksi: "UPDATE_SESI",
    entitas: "AttendanceSession",
    entitasId: id,
    detail: `${updated.name} ${updated.jamMulai}-${updated.jamSelesai}`,
  });

  return NextResponse.json({ data: updated });
}

/** DELETE /api/admin/sesi/[id] — hapus sesi (ditolak bila masih ada record). */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await guardAdminApi();
  if (!guard.ok) return guard.response;
  const { id } = await params;

  const existing = await prisma.attendanceSession.findUnique({
    where: { id },
    include: { _count: { select: { records: true } } },
  });
  if (!existing) return NextResponse.json({ error: "Sesi tidak ditemukan." }, { status: 404 });
  if (existing._count.records > 0) {
    return NextResponse.json(
      { error: `Sesi tidak bisa dihapus: masih ada ${existing._count.records} record kehadiran.` },
      { status: 409 }
    );
  }

  await prisma.attendanceSession.delete({ where: { id } });
  await writeAudit({
    actorId: guard.user.id,
    aksi: "DELETE_SESI",
    entitas: "AttendanceSession",
    entitasId: id,
    detail: existing.name,
  });

  return NextResponse.json({ data: { id } });
}
