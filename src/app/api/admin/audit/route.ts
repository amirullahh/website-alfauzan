import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdminApi } from "@/lib/api-auth";
import { isValidDate, parsePagination } from "@/lib/validation";

/**
 * GET /api/admin/audit?entitas=&search=&tanggalDari=&tanggalSampai=&page=&limit=
 * Riwayat perubahan data oleh staf (layar #12). Read-only: tidak ada POST.
 */
export async function GET(request: Request) {
  const guard = await guardAdminApi();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);
  const entitas = searchParams.get("entitas")?.trim();
  const search = searchParams.get("search")?.trim();
  const tanggalDari = searchParams.get("tanggalDari");
  const tanggalSampai = searchParams.get("tanggalSampai");
  const { page, limit } = parsePagination(searchParams);

  if (tanggalDari && !isValidDate(tanggalDari)) {
    return NextResponse.json({ error: "tanggalDari tidak valid (YYYY-MM-DD)." }, { status: 400 });
  }
  if (tanggalSampai && !isValidDate(tanggalSampai)) {
    return NextResponse.json({ error: "tanggalSampai tidak valid (YYYY-MM-DD)." }, { status: 400 });
  }

  const where: Record<string, unknown> = {};
  if (entitas) where.entitas = entitas;
  if (tanggalDari || tanggalSampai) {
    where.createdAt = {
      ...(tanggalDari ? { gte: new Date(`${tanggalDari}T00:00:00`) } : {}),
      ...(tanggalSampai ? { lte: new Date(`${tanggalSampai}T23:59:59`) } : {}),
    };
  }
  if (search) {
    where.OR = [
      { aksi: { contains: search } },
      { detail: { contains: search } },
      { actor: { name: { contains: search } } },
    ];
  }

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      include: { actor: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({ data: logs, meta: { total, page, limit } });
}
