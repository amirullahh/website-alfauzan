"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { t } from "@/lib/i18n";
import { Map, Camera, Loader2, ArrowLeft } from "lucide-react";

function RiwayatDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Mock detail data
  const detail = {
    date: "Rabu, 23 Oktober 2024",
    session: "Madrasah",
    checkIn: "07:05",
    checkOut: "15:30",
    status: "hadir" as const,
    duration: "8j 25m",
    location: "Masjid Jami' & Gedung Asrama Putra",
    distance: 12,
    accuracy: 8,
    lat: -6.3167507,
    lng: 106.8494846,
    fotoMasuk: null,
    fotoPulang: null,
  };

  const statusConfig = {
    hadir: { label: t("present"), bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-400" },
    terlambat: { label: t("late"), bg: "bg-yellow-100 dark:bg-yellow-900/40", text: "text-yellow-700 dark:text-yellow-400" },
    izin: { label: t("permission"), bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-400" },
    sakit: { label: t("sick"), bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-400" },
    alpa: { label: t("absent"), bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-700 dark:text-red-400" },
  };

  const status = statusConfig[detail.status];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <AppHeader title={t("attendanceDetail")} showBack onBack={() => window.history.back()} />

      <main className="flex flex-col relative w-full px-6 pt-24 pb-6">
        {/* Date & Status */}
        <div className="flex items-center justify-between mb-6" data-aos="fade-down">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{detail.date}</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">{detail.session}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${status.bg} ${status.text} uppercase tracking-wider`}>
            {status.label}
          </span>
        </div>

        {/* Time Info */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 mb-5" data-aos="fade-up">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Waktu Kehadiran</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{t("checkIn")}</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{detail.checkIn}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{t("checkOut")}</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{detail.checkOut}</span>
            </div>
          </div>
          <div className="flex items-center justify-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Durasi: </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white ml-2">{detail.duration}</span>
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 mb-5" data-aos="fade-up" data-aos-delay="50">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">{t("locationMap")}</h3>
          <div className="w-full h-[200px] rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-4">
            <div className="text-center flex flex-col items-center">
              <Map className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Peta lokasi verifikasi</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Lokasi</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-right">{detail.location}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{t("distance")}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{detail.distance} {t("meters")}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Akurasi GPS</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">±{detail.accuracy}m</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Koordinat</span>
              <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300">{detail.lat}, {detail.lng}</span>
            </div>
          </div>
        </div>

        {/* Photo Proof */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6" data-aos="fade-up" data-aos-delay="100">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">{t("photoProof")}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
              <Camera className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Foto {t("checkIn")}</span>
            </div>
            <div className="aspect-[3/4] rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
              <Camera className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Foto {t("checkOut")}</span>
            </div>
          </div>
        </div>

        <Link
          href="/riwayat"
          className="flex items-center justify-center w-full h-14 px-6 bg-emerald-600 text-white text-base font-bold rounded-2xl shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-[0.98] transition-all"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Kembali ke Riwayat
        </Link>
      </main>
    </div>
  );
}

export default function RiwayatDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400" />
        <span className="mt-4 text-sm font-bold text-slate-500 dark:text-slate-400">Memuat detail...</span>
      </div>
    }>
      <RiwayatDetailContent />
    </Suspense>
  );
}
