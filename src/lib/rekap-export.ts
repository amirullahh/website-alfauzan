export interface RekapRow {
  tanggal: string;
  nama: string;
  role: string;
  nisNip: string;
  sesi: string;
  jamMasuk: string;
  jamPulang: string;
  status: string;
}

const CSV_HEADER = ["Tanggal", "Nama", "Role", "NIS/NIP", "Sesi", "Jam Masuk", "Jam Pulang", "Status"];

function escapeCsvCell(value: string): string {
  const v = value ?? "";
  return /[";\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/**
 * Builds a semicolon-delimited CSV with BOM so Microsoft Excel (ID locale)
 * opens it correctly. No new dependency needed (PRD §11.3 layar #9).
 */
export function buildRekapCsv(rows: RekapRow[]): string {
  const lines = [
    CSV_HEADER.join(";"),
    ...rows.map((r) =>
      [
        r.tanggal,
        r.nama,
        r.role,
        r.nisNip,
        r.sesi,
        r.jamMasuk,
        r.jamPulang,
        r.status,
      ]
        .map(escapeCsvCell)
        .join(";")
    ),
  ];
  return `﻿${lines.join("\r\n")}`;
}

export function toRekapRow(r: {
  tanggal: string;
  jamMasuk: string | null;
  jamPulang: string | null;
  status: string;
  user: { name: string; role: string; nis: string | null; nip: string | null };
  session: { name: string };
}): RekapRow {
  return {
    tanggal: r.tanggal,
    nama: r.user.name,
    role: r.user.role,
    nisNip: r.user.nis ?? r.user.nip ?? "-",
    sesi: r.session.name,
    jamMasuk: r.jamMasuk ?? "-",
    jamPulang: r.jamPulang ?? "-",
    status: r.status,
  };
}
