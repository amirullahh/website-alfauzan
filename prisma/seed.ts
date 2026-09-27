import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create default location (pondok)
  const location = await prisma.location.upsert({
    where: { id: "default-location" },
    update: {},
    create: {
      id: "default-location",
      name: "Masjid Jami' & Gedung Asrama Putra",
      latitude: -6.3167507,
      longitude: 106.8494846,
      radiusMeter: 100,
      isDefault: true,
    },
  });

  console.log("Created location:", location.name);

  // Create attendance sessions
  const sessions = [
    { name: "Subuh", jamMulai: "04:00", jamSelesai: "06:00", batasToleransiMenit: 15 },
    { name: "Madrasah", jamMulai: "07:00", jamSelesai: "15:30", batasToleransiMenit: 15 },
    { name: "Ashar", jamMulai: "15:00", jamSelesai: "16:30", batasToleransiMenit: 15 },
    { name: "Maghrib", jamMulai: "18:00", jamSelesai: "19:00", batasToleransiMenit: 15 },
    { name: "Isya", jamMulai: "19:00", jamSelesai: "20:30", batasToleransiMenit: 15 },
  ];

  for (const session of sessions) {
    await prisma.attendanceSession.upsert({
      where: { id: `session-${session.name.toLowerCase()}` },
      update: {},
      create: {
        id: `session-${session.name.toLowerCase()}`,
        name: session.name,
        jamMulai: session.jamMulai,
        jamSelesai: session.jamSelesai,
        batasToleransiMenit: session.batasToleransiMenit,
        locationId: location.id,
      },
    });
  }

  console.log("Created attendance sessions");

  // Create sample users
  const passwordHash = await bcrypt.hash("password123", 10);

  const users = [
    {
      email: "superadmin@alfauzan.id",
      name: "Super Admin",
      role: "PENGURUS" as const,
      accessLevel: "SUPER_ADMIN" as const,
      nip: "198001011990011000",
      phone: "+62 857-2020-6674",
      jabatan: "Super Admin",
    },
    {
      email: "pengurus@alfauzan.id",
      name: "Bapak Pengurus",
      role: "PENGURUS" as const,
      accessLevel: "PENGURUS" as const,
      nip: "198001011990011001",
      phone: "+62 857-2020-6674",
      jabatan: "Tata Usaha",
    },
    {
      email: "ustadz.fauzi@alfauzan.id",
      name: "Ustadz Ahmad Fauzi, S.Pd.I",
      role: "USTADZ" as const,
      accessLevel: null,
      nip: "198804122012011002",
      phone: "+62 812-3456-7890",
      jabatan: "Guru Fiqih & Musyrif Asrama",
    },
    {
      email: "santri.ahmad@alfauzan.id",
      name: "Ahmad Santri",
      role: "SANTRI" as const,
      accessLevel: null,
      nis: "2024001",
      phone: "+62 813-9876-5432",
      jabatan: null,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        accessLevel: user.accessLevel ?? null,
      },
      create: {
        email: user.email,
        name: user.name,
        password: passwordHash,
        role: user.role,
        accessLevel: user.accessLevel ?? null,
        nip: user.nip || null,
        nis: user.nis || null,
        phone: user.phone,
        jabatan: user.jabatan,
        statusAkun: "AKTIF",
      },
    });
  }

  console.log("Created sample users");

  // Seed system settings (PRD §11.3 layar #13 defaults)
  const settings = [
    { key: "toleransi_terlambat_menit", value: "15" },
    { key: "radius_geofence_default_meter", value: "100" },
    { key: "kontak_hubungi_admin", value: "+62 857-2020-6674" },
    { key: "jam_layanan_admin", value: "Senin–Ahad, 07.00–20.30 WIB" },
    { key: "tema_default", value: "light" },
  ];

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("Created system settings");
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
