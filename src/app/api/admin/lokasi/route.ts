import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdminApi } from "@/lib/api-auth";
import { writeAudit } from "@/lib/audit";
import { isPositiveInt, isValidLat, isValidLng } from "@/lib/validation";

/** GET /api/admin/lokasi — list semua titik geofence. */
export async function GET() {
  const guard = await guardAdminApi();
  if (!guard.ok) return guard.response;

  const data = await prisma.location.findMany({
    include: { _count: { select: { sessions: true } } },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
  });
  return NextResponse.json({ data });
}

/** POST /api/admin/lokasi — tambah titik (field spec PRD §11.4). */
export async function POST(request: Request) {
  const guard = await guardAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const { name, latitude, longitude, radiusMeter, isActive } = body ?? {};

  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Nama lokasi wajib diisi." }, { status: 400 });
  }
  if (!isValidLat(latitude) || !isValidLng(longitude)) {
    return NextResponse.json({ error: "Latitude (-90..90) / longitude (-180..180) tidak valid." }, { status: 400 });
  }
  const radius = radiusMeter ?? 100;
  if (!isPositiveInt(radius)) {
    return NextResponse.json({ error: "Radius harus bilangan bulat positif (meter)." }, { status: 400 });
  }

  const created = await prisma.location.create({
    data: {
      name: name.trim(),
      latitude,
      longitude,
      radiusMeter: radius,
      isActive: isActive ?? true,
    },
  });

  await writeAudit({
    actorId: guard.user.id,
    aksi: "CREATE_LOKASI",
    entitas: "Location",
    entitasId: created.id,
    detail: `${created.name} (${created.latitude}, ${created.longitude}, r=${created.radiusMeter}m)`,
  });

  return NextResponse.json({ data: created }, { status: 201 });
}
