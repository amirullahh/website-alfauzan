import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdminApi } from "@/lib/api-auth";
import { writeAudit } from "@/lib/audit";
import { isValidDate } from "@/lib/validation";

/** PUT /api/admin/izin-sakit/[id] — ubah entri manual. */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await guardAdminApi();
  if (!guard.ok) return guard.response;
  const { id } = await params;

  const existing = await prisma.izinSakit.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Entri tidak ditemukan." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const { tanggalMulai, tanggalSelesai, jenis, keterangan } = body ?? {};

  const nextMulai = tanggalMulai ?? existing.tanggalMulai;
  const nextSelesai = tanggalSelesai === null ? null : (tanggalSelesai ?? existing.tanggalSelesai);
  if (tanggalMulai !== undefined && !isValidDate(tanggalMulai)) {
    return NextResponse.json({ error: "tanggalMulai tidak valid (YYYY-MM-DD)." }, { status: 400 });
  }
  if (tanggalSelesai !== undefined && tanggalSelesai !== null && !isValidDate(tanggalSelesai)) {
    return NextResponse.json({ error: "tanggalSelesai tidak valid (YYYY-MM-DD)." }, { status: 400 });
  }
  if (nextSelesai && nextSelesai < nextMulai) {
    return NextResponse.json({ error: "tanggalSelesai tidak boleh sebelum tanggalMulai." }, { status: 400 });
  }
  if (jenis !== undefined && jenis !== "IZIN" && jenis !== "SAKIT") {
    return NextResponse.json({ error: "Jenis harus IZIN atau SAKIT." }, { status: 400 });
  }

  const updated = await prisma.izinSakit.update({
    where: { id },
    data: {
      tanggalMulai: nextMulai,
      tanggalSelesai: nextSelesai,
      ...(jenis !== undefined ? { jenis } : {}),
      ...(keterangan !== undefined ? { keterangan } : {}),
    },
  });

  await writeAudit({
    actorId: guard.user.id,
    aksi: "UPDATE_IZIN_SAKIT",
    entitas: "IzinSakit",
    entitasId: id,
  });

  return NextResponse.json({ data: updated });
}

/** DELETE /api/admin/izin-sakit/[id] — hapus entri manual. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await guardAdminApi();
  if (!guard.ok) return guard.response;
  const { id } = await params;

  const existing = await prisma.izinSakit.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Entri tidak ditemukan." }, { status: 404 });

  await prisma.izinSakit.delete({ where: { id } });
  await writeAudit({
    actorId: guard.user.id,
    aksi: "DELETE_IZIN_SAKIT",
    entitas: "IzinSakit",
    entitasId: id,
  });

  return NextResponse.json({ data: { id } });
}
