import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdminApi } from "@/lib/api-auth";
import { writeAudit } from "@/lib/audit";

/** Pengaturan yang boleh diubah via dashboard (layar #13, Super Admin only). */
const EDITABLE_KEYS = [
  "toleransi_terlambat_menit",
  "radius_geofence_default_meter",
  "kontak_hubungi_admin",
  "jam_layanan_admin",
  "tema_default",
] as const;

function validateSetting(key: string, value: unknown): string | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    return `Nilai ${key} tidak boleh kosong.`;
  }
  if (key === "toleransi_terlambat_menit" || key === "radius_geofence_default_meter") {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) return `Nilai ${key} harus bilangan bulat positif.`;
  }
  if (key === "tema_default" && value !== "light" && value !== "dark") {
    return "tema_default harus light atau dark.";
  }
  return null;
}

/** GET /api/admin/pengaturan — baca semua pengaturan sistem. */
export async function GET() {
  const guard = await guardAdminApi();
  if (!guard.ok) return guard.response;

  const settings = await prisma.systemSetting.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json({ data: settings });
}

/** PUT /api/admin/pengaturan — update bulk (Super Admin only). */
export async function PUT(request: Request) {
  const guard = await guardAdminApi(true);
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const settings = body?.settings;
  if (typeof settings !== "object" || settings === null || Array.isArray(settings)) {
    return NextResponse.json({ error: "Body harus { settings: { key: value } }." }, { status: 400 });
  }

  const entries = Object.entries(settings) as [string, unknown][];
  if (entries.length === 0) {
    return NextResponse.json({ error: "Tidak ada pengaturan yang dikirim." }, { status: 400 });
  }
  for (const [key, value] of entries) {
    if (!(EDITABLE_KEYS as readonly string[]).includes(key)) {
      return NextResponse.json({ error: `Key tidak dikenal: ${key}.` }, { status: 400 });
    }
    const err = validateSetting(key, value);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
  }

  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.systemSetting.upsert({
        where: { key },
        update: { value: (value as string).trim() },
        create: { key, value: (value as string).trim() },
      })
    )
  );

  await writeAudit({
    actorId: guard.user.id,
    aksi: "UPDATE_PENGATURAN",
    entitas: "SystemSetting",
    detail: entries.map(([k]) => k).join(", "),
  });

  const data = await prisma.systemSetting.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json({ data });
}
