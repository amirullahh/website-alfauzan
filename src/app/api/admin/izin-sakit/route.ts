import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdminApi } from "@/lib/api-auth";
import { writeAudit } from "@/lib/audit";
import { isValidDate, parsePagination } from "@/lib/validation";

/**
 * GET /api/admin/izin-sakit?jenis=&search=&page=&limit=
 * Riwayat entri izin/sakit manual (layar #11).
 */
export async function GET(request: Request) {
  const guard = await guardAdminApi();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);
  const jenis = searchParams.get("jenis");
  const search = searchParams.get("search")?.trim();
  const { page, limit } = parsePagination(searchParams);

  const where: Record<string, unknown> = {};
  if (jenis === "IZIN" || jenis === "SAKIT") where.jenis = jenis;
  if (search) {
    where.user = {
      OR: [
        { name: { contains: search } },
        { nis: { contains: search } },
        { nip: { contains: search } },
      ],
    };
  }

  const [total, items] = await Promise.all([
    prisma.izinSakit.count({ where }),
    prisma.izinSakit.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, role: true, nis: true, nip: true } },
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: { tanggalMulai: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({ data: items, meta: { total, page, limit } });
}

/**
 * POST /api/admin/izin-sakit — input manual admin (v1: tanpa alur
 * pengajuan mandiri santri/ustadz — PRD §5.1/§11).
 */
export async function POST(request: Request) {
  const guard = await guardAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const { userId, tanggalMulai, tanggalSelesai, jenis, keterangan } = body ?? {};

  if (typeof userId !== "string" || userId.length === 0) {
    return NextResponse.json({ error: "userId wajib diisi." }, { status: 400 });
  }
  if (!isValidDate(tanggalMulai)) {
    return NextResponse.json({ error: "tanggalMulai tidak valid (YYYY-MM-DD)." }, { status: 400 });
  }
  if (tanggalSelesai !== undefined && tanggalSelesai !== null && !isValidDate(tanggalSelesai)) {
    return NextResponse.json({ error: "tanggalSelesai tidak valid (YYYY-MM-DD)." }, { status: 400 });
  }
  if (tanggalSelesai && tanggalSelesai < tanggalMulai) {
    return NextResponse.json({ error: "tanggalSelesai tidak boleh sebelum tanggalMulai." }, { status: 400 });
  }
  if (jenis !== "IZIN" && jenis !== "SAKIT") {
    return NextResponse.json({ error: "Jenis harus IZIN atau SAKIT." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, role: true } });
  if (!target) return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });
  if (target.role !== "SANTRI" && target.role !== "USTADZ") {
    return NextResponse.json({ error: "Izin/sakit hanya untuk Santri atau Ustadz." }, { status: 400 });
  }

  const created = await prisma.izinSakit.create({
    data: {
      userId,
      tanggalMulai,
      tanggalSelesai: tanggalSelesai ?? null,
      jenis,
      keterangan: keterangan ?? null,
      createdById: guard.user.id,
    },
  });

  await writeAudit({
    actorId: guard.user.id,
    aksi: "CREATE_IZIN_SAKIT",
    entitas: "IzinSakit",
    entitasId: created.id,
    detail: `${target.name} ${jenis} ${tanggalMulai}${tanggalSelesai ? ` s/d ${tanggalSelesai}` : ""}`,
  });

  return NextResponse.json({ data: created }, { status: 201 });
}
