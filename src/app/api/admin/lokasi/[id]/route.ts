import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdminApi } from "@/lib/api-auth";
import { writeAudit } from "@/lib/audit";
import { isPositiveInt, isValidLat, isValidLng } from "@/lib/validation";

/** PUT /api/admin/lokasi/[id] — ubah titik (termasuk toggle aktif). */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await guardAdminApi();
  if (!guard.ok) return guard.response;
  const { id } = await params;

  const existing = await prisma.location.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Lokasi tidak ditemukan." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const { name, latitude, longitude, radiusMeter, isActive, isDefault } = body ?? {};

  if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
    return NextResponse.json({ error: "Nama lokasi tidak boleh kosong." }, { status: 400 });
  }
  if (latitude !== undefined && !isValidLat(latitude)) {
    return NextResponse.json({ error: "Latitude tidak valid (-90..90)." }, { status: 400 });
  }
  if (longitude !== undefined && !isValidLng(longitude)) {
    return NextResponse.json({ error: "Longitude tidak valid (-180..180)." }, { status: 400 });
  }
  if (radiusMeter !== undefined && !isPositiveInt(radiusMeter)) {
    return NextResponse.json({ error: "Radius harus bilangan bulat positif (meter)." }, { status: 400 });
  }
  if (isActive !== undefined && typeof isActive !== "boolean") {
    return NextResponse.json({ error: "Status aktif harus boolean." }, { status: 400 });
  }

  // Nonaktifkan lokasi default yang masih dipakai sesi aktif → tolak,
  // agar check-in tidak kehilangan titik geofence rujukan.
  if (isActive === false && existing.isDefault) {
    const sessionsUsing = await prisma.attendanceSession.count({ where: { locationId: id } });
    if (sessionsUsing > 0) {
      return NextResponse.json(
        { error: "Lokasi default tidak bisa dinonaktifkan: masih dipakai sesi jadwal." },
        { status: 409 }
      );
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (isDefault === true) {
      await tx.location.updateMany({ where: { isDefault: true }, data: { isDefault: false } });
    }
    return tx.location.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(latitude !== undefined ? { latitude } : {}),
        ...(longitude !== undefined ? { longitude } : {}),
        ...(radiusMeter !== undefined ? { radiusMeter } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
        ...(isDefault !== undefined ? { isDefault: !!isDefault } : {}),
      },
    });
  });

  await writeAudit({
    actorId: guard.user.id,
    aksi: "UPDATE_LOKASI",
    entitas: "Location",
    entitasId: id,
    detail: updated.name,
  });

  return NextResponse.json({ data: updated });
}

/** DELETE /api/admin/lokasi/[id] — hapus titik (ditolak bila dipakai sesi). */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await guardAdminApi();
  if (!guard.ok) return guard.response;
  const { id } = await params;

  const existing = await prisma.location.findUnique({
    where: { id },
    include: { _count: { select: { sessions: true } } },
  });
  if (!existing) return NextResponse.json({ error: "Lokasi tidak ditemukan." }, { status: 404 });
  if (existing.isDefault) {
    return NextResponse.json({ error: "Lokasi default tidak bisa dihapus." }, { status: 409 });
  }
  if (existing._count.sessions > 0) {
    return NextResponse.json(
      { error: `Lokasi tidak bisa dihapus: masih dipakai ${existing._count.sessions} sesi.` },
      { status: 409 }
    );
  }

  await prisma.location.delete({ where: { id } });
  await writeAudit({
    actorId: guard.user.id,
    aksi: "DELETE_LOKASI",
    entitas: "Location",
    entitasId: id,
    detail: existing.name,
  });

  return NextResponse.json({ data: { id } });
}
