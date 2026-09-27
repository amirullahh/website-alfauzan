import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { prisma } from "@/lib/db";
import { guardAdminApi } from "@/lib/api-auth";
import { writeAudit } from "@/lib/audit";
import { isValidDate } from "@/lib/validation";
import { buildRekapCsv, toRekapRow } from "@/lib/rekap-export";

const STATUSES = ["HADIR", "TERLAMBAT", "IZIN", "SAKIT", "ALPA"] as const;

/**
 * GET /api/admin/rekap/export?format=csv|pdf&...filter
 * Export rekap (layar #9: tombol "Export PDF" / "Export Excel" polos,
 * tanpa workflow tanda tangan — PRD §11.6.7).
 * Format "excel" = CSV kompatibel Excel (tanpa dependency baru).
 */
export async function GET(request: Request) {
  const guard = await guardAdminApi();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "csv";
  if (format !== "csv" && format !== "pdf") {
    return NextResponse.json({ error: "Format harus csv atau pdf." }, { status: 400 });
  }

  const tanggalDari = searchParams.get("tanggalDari");
  const tanggalSampai = searchParams.get("tanggalSampai");
  const sessionId = searchParams.get("sessionId");
  const status = searchParams.get("status");
  const role = searchParams.get("role");
  const search = searchParams.get("search")?.trim();

  if (tanggalDari && !isValidDate(tanggalDari)) {
    return NextResponse.json({ error: "tanggalDari tidak valid (YYYY-MM-DD)." }, { status: 400 });
  }
  if (tanggalSampai && !isValidDate(tanggalSampai)) {
    return NextResponse.json({ error: "tanggalSampai tidak valid (YYYY-MM-DD)." }, { status: 400 });
  }
  if (status && !(STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
  }

  const where: Record<string, unknown> = {};
  if (tanggalDari || tanggalSampai) {
    where.tanggal = {
      ...(tanggalDari ? { gte: tanggalDari } : {}),
      ...(tanggalSampai ? { lte: tanggalSampai } : {}),
    };
  }
  if (sessionId) where.sessionId = sessionId;
  if (status) where.status = status;
  if (role === "SANTRI" || role === "USTADZ") where.user = { role };
  if (search) {
    const userFilter = {
      user: {
        OR: [
          { name: { contains: search } },
          { nis: { contains: search } },
          { nip: { contains: search } },
        ],
      },
    };
    where.AND = role === "SANTRI" || role === "USTADZ" ? [{ user: { role } }, userFilter] : [userFilter];
    delete where.user;
  }

  const records = await prisma.attendanceRecord.findMany({
    where,
    include: {
      user: { select: { name: true, role: true, nis: true, nip: true } },
      session: { select: { name: true } },
    },
    orderBy: [{ tanggal: "asc" }, { createdAt: "asc" }],
    take: 5000,
  });

  const rows = records.map(toRekapRow);
  const stamp = new Date().toISOString().slice(0, 10);

  await writeAudit({
    actorId: guard.user.id,
    aksi: "EXPORT_REKAP",
    entitas: "AttendanceRecord",
    detail: `format=${format} rows=${rows.length}`,
  });

  if (format === "csv") {
    return new NextResponse(buildRekapCsv(rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="rekap-kehadiran-${stamp}.csv"`,
      },
    });
  }

  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(14);
  doc.text("Rekap Kehadiran — Pondok Pesantren Al-Fauzan Nusantara", 14, 14);
  doc.setFontSize(10);
  doc.text(`Periode: ${tanggalDari ?? "-"} s/d ${tanggalSampai ?? "-"} · ${rows.length} baris`, 14, 21);
  const cols = ["Tanggal", "Nama", "Role", "NIS/NIP", "Sesi", "Masuk", "Pulang", "Status"];
  const colX = [14, 34, 84, 104, 134, 164, 184, 209];
  let y = 30;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  cols.forEach((c, i) => doc.text(c, colX[i], y));
  doc.setFont("helvetica", "normal");
  y += 6;
  for (const r of rows) {
    if (y > 195) {
      doc.addPage();
      y = 14;
    }
    const cells = [r.tanggal, r.nama.slice(0, 26), r.role, r.nisNip, r.sesi, r.jamMasuk, r.jamPulang, r.status];
    cells.forEach((c, i) => doc.text(String(c), colX[i], y));
    y += 5;
  }

  const pdf = Buffer.from(doc.output("arraybuffer"));
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="rekap-kehadiran-${stamp}.pdf"`,
    },
  });
}
