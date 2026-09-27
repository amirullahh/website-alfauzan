"use client";

import { useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { t } from "@/lib/i18n";
import { FileBox, Clock, FileText } from "lucide-react";

interface AttendanceItem {
  id: string;
  date: string;
  session: string;
  checkIn: string;
  checkOut: string | null;
  status: "hadir" | "terlambat" | "izin" | "sakit" | "alpa";
  duration: string;
}

const sampleData: AttendanceItem[] = [
  {
    id: "1",
    date: "2024-10-23",
    session: "Madrasah",
    checkIn: "07:05",
    checkOut: "15:30",
    status: "hadir",
    duration: "8j 25m",
  },
  {
    id: "2",
    date: "2024-10-22",
    session: "Madrasah",
    checkIn: "07:12",
    checkOut: "15:30",
    status: "hadir",
    duration: "8j 18m",
  },
  {
    id: "3",
    date: "2024-10-21",
    session: "Madrasah",
    checkIn: "07:20",
    checkOut: "15:30",
    status: "terlambat",
    duration: "8j 10m",
  },
  {
    id: "4",
    date: "2024-10-20",
    session: "Madrasah",
    checkIn: "07:00",
    checkOut: "15:30",
    status: "hadir",
    duration: "8j 30m",
  },
  {
    id: "5",
    date: "2024-10-19",
    session: "Madrasah",
    checkIn: "",
    checkOut: null,
    status: "alpa",
    duration: "-",
  },
];

const statusConfig = {
  hadir: { label: t("present"), bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800/50" },
  terlambat: { label: t("late"), bg: "bg-yellow-100 dark:bg-yellow-900/40", text: "text-yellow-700 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-800/50" },
  izin: { label: t("permission"), bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800/50" },
  sakit: { label: t("sick"), bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800/50" },
  alpa: { label: t("absent"), bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800/50" },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}`;
}

export default function RiwayatPage() {
  const [filter, setFilter] = useState<"all" | "hadir" | "terlambat" | "izin" | "sakit" | "alpa">("all");

  const filtered = filter === "all" ? sampleData : sampleData.filter((d) => d.status === filter);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <AppHeader title={t("history")} />

      <main className="flex flex-col relative w-full px-6 pt-24 pb-28">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6" data-aos="fade-down">
          <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">18</span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Hari Hadir</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <span className="text-xl font-black text-slate-900 dark:text-white">142j</span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Total Jam</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">85%</span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Tepat Waktu</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide" data-aos="fade-left">
          {(["all", "hadir", "terlambat", "izin", "sakit", "alpa"] as const).map((f) => (
            <button
              key={f}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors shadow-sm ${
                filter === f
                  ? "bg-emerald-600 text-white shadow-emerald-600/30"
                  : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "Semua" : statusConfig[f]?.label || f}
            </button>
          ))}
        </div>

        {/* Attendance List */}
        <div className="flex flex-col gap-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16" data-aos="fade-in">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-4">
                <FileBox className="w-8 h-8 text-slate-300 dark:text-slate-700" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tidak ada riwayat di rentang ini</p>
            </div>
          ) : (
            filtered.map((item, index) => {
              const status = statusConfig[item.status];
              return (
                <Link
                  key={item.id}
                  href={`/riwayat/detail?id=${item.id}`}
                  className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 text-center leading-tight px-1">{formatDate(item.date)}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{item.session}</span>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.checkIn || "--:--"} - {item.checkOut || "--:--"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${status.bg} ${status.text} border ${status.border} uppercase tracking-wider`}>
                      {status.label}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">{item.duration}</span>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Export Button */}
        <button className="flex items-center justify-center w-full h-14 mt-8 px-6 border-2 border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 text-sm font-bold rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/30 active:scale-[0.98] transition-all" data-aos="fade-up" data-aos-delay="200">
          <FileText className="mr-2 w-5 h-5" />
          {t("exportPDF")}
        </button>
      </main>

      <BottomNav />
    </div>
  );
}
