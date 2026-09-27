import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { guardAdminApi } from "@/lib/api-auth";
import { writeAudit } from "@/lib/audit";
import { parsePagination } from "@/lib/validation";

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

/**
 * GET /api/admin/users?role=SANTRI&search=...&page=&limit=
 * List user (tab Santri/Ustadz/Pengurus, Super Admin only).
 */
export async function GET(request: Request) {
  const guard = await guardAdminApi(true);
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const search = searchParams.get("search")?.trim();
  const { page, limit } = parsePagination(searchParams);

  const where: Record<string, unknown> = {};
  if (role === "SANTRI" || role === "USTADZ" || role === "PENGURUS") where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { nis: { contains: search } },
      { nip: { contains: search } },
    ];
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: PUBLIC_SELECT,
      orderBy: { name: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({ data: users, meta: { total, page, limit } });
}

/**
 * POST /api/admin/users — buat akun (Super Admin only).
 * Password tidak pernah dikirim via WA/gateway (PRD §11.6.5): admin
 * menyampaikan kredensial manual di luar sistem.
 */
export async function POST(request: Request) {
  const guard = await guardAdminApi(true);
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const { email, password, name, role, accessLevel, nis, nip, phone, jabatan } = body ?? {};

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Email tidak valid." }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "Kata sandi minimal 8 karakter." }, { status: 400 });
  }
  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Nama wajib diisi." }, { status: 400 });
  }
  if (role !== "SANTRI" && role !== "USTADZ" && role !== "PENGURUS") {
    return NextResponse.json({ error: "Role harus SANTRI, USTADZ, atau PENGURUS." }, { status: 400 });
  }
  if (role === "PENGURUS" && accessLevel !== "SUPER_ADMIN" && accessLevel !== "PENGURUS") {
    return NextResponse.json({ error: "Akun pengurus wajib punya accessLevel SUPER_ADMIN/PENGURUS." }, { status: 400 });
  }
  if (role !== "PENGURUS" && accessLevel !== undefined && accessLevel !== null) {
    return NextResponse.json({ error: "accessLevel hanya untuk role PENGURUS." }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, ...(nis ? [{ nis }] : []), ...(nip ? [{ nip }] : [])] },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json({ error: "Email/NIS/NIP sudah terdaftar." }, { status: 409 });
  }

  const created = await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 10),
      name: name.trim(),
      role,
      accessLevel: role === "PENGURUS" ? accessLevel : null,
      nis: nis ?? null,
      nip: nip ?? null,
      phone: phone ?? null,
      jabatan: jabatan ?? null,
      statusAkun: "AKTIF",
    },
    select: PUBLIC_SELECT,
  });

  await writeAudit({
    actorId: guard.user.id,
    aksi: "CREATE_USER",
    entitas: "User",
    entitasId: created.id,
    detail: `${created.name} (${created.role})`,
  });

  return NextResponse.json({ data: created }, { status: 201 });
}
