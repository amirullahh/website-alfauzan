import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { guardAdminApi } from "@/lib/api-auth";
import { writeAudit } from "@/lib/audit";

const PUBLIC_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  accessLevel: true,
  nis: true,
  nip: true,
  phone: true,
  jabatan: true,
  statusAkun: true,
  createdAt: true,
} as const;

/** PUT /api/admin/users/[id] — ubah akun (Super Admin only). */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await guardAdminApi(true);
  if (!guard.ok) return guard.response;
  const { id } = await params;

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const { name, email, password, phone, jabatan, statusAkun, accessLevel, nis, nip } = body ?? {};

  if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
    return NextResponse.json({ error: "Nama tidak boleh kosong." }, { status: 400 });
  }
  if (email !== undefined && (typeof email !== "string" || !email.includes("@"))) {
    return NextResponse.json({ error: "Email tidak valid." }, { status: 400 });
  }
  if (password !== undefined && (typeof password !== "string" || password.length < 8)) {
    return NextResponse.json({ error: "Kata sandi minimal 8 karakter." }, { status: 400 });
  }
  if (statusAkun !== undefined && !["AKTIF", "NONAKTIF", "SUSPENDED"].includes(statusAkun)) {
    return NextResponse.json({ error: "Status akun tidak valid." }, { status: 400 });
  }
  if (accessLevel !== undefined && accessLevel !== null) {
    if (existing.role !== "PENGURUS") {
      return NextResponse.json({ error: "accessLevel hanya untuk role PENGURUS." }, { status: 400 });
    }
    if (accessLevel !== "SUPER_ADMIN" && accessLevel !== "PENGURUS") {
      return NextResponse.json({ error: "accessLevel tidak valid." }, { status: 400 });
    }
  }
  // Cegah admin menonaktifkan/mencabut dirinya sendiri hingga terkunci.
  if (id === guard.user.id && (statusAkun === "NONAKTIF" || statusAkun === "SUSPENDED" || accessLevel === "PENGURUS")) {
    return NextResponse.json({ error: "Tidak bisa menurunkan status/akses akun sendiri." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(email !== undefined ? { email } : {}),
      ...(password !== undefined ? { password: await bcrypt.hash(password, 10) } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(jabatan !== undefined ? { jabatan } : {}),
      ...(statusAkun !== undefined ? { statusAkun } : {}),
      ...(accessLevel !== undefined ? { accessLevel } : {}),
      ...(nis !== undefined ? { nis } : {}),
      ...(nip !== undefined ? { nip } : {}),
    },
    select: PUBLIC_SELECT,
  }).catch(() => null);

  if (!updated) {
    return NextResponse.json({ error: "Gagal update: Email/NIS/NIP mungkin sudah dipakai akun lain." }, { status: 409 });
  }

  await writeAudit({
    actorId: guard.user.id,
    aksi: "UPDATE_USER",
    entitas: "User",
    entitasId: id,
    detail: updated.name,
  });

  return NextResponse.json({ data: updated });
}

/** DELETE /api/admin/users/[id] — hapus akun (ditolak bila ada record/izin). */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await guardAdminApi(true);
  if (!guard.ok) return guard.response;
  const { id } = await params;

  if (id === guard.user.id) {
    return NextResponse.json({ error: "Tidak bisa menghapus akun sendiri." }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({
    where: { id },
    include: { _count: { select: { attendanceRecords: true, izinSakit: true } } },
  });
  if (!existing) return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });
  if (existing._count.attendanceRecords > 0 || existing._count.izinSakit > 0) {
    return NextResponse.json(
      { error: "Akun tidak bisa dihapus: masih punya data kehadiran. Nonaktifkan saja (NONAKTIF)." },
      { status: 409 }
    );
  }

  await prisma.user.delete({ where: { id } });
  await writeAudit({
    actorId: guard.user.id,
    aksi: "DELETE_USER",
    entitas: "User",
    entitasId: id,
    detail: existing.name,
  });

  return NextResponse.json({ data: { id } });
}
