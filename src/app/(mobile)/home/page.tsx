"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { t } from "@/lib/i18n";
import { getCurrentTimeString, getCurrentDateString } from "@/lib/attendance";
import { Cloud, CloudOff, Calendar, CheckCircle2, CheckSquare, LogOut, Clock, Pointer } from "lucide-react";

const sessions = [
  { name: t("sessionSubuh"), key: "subuh" },
  { name: t("sessionMadrasah"), key: "madrasah" },
  { name: t("sessionAshar"), key: "ashar" },
  { name: t("sessionMaghrib"), key: "maghrib" },
  { name: t("sessionIsya"), key: "isya" },
];

function formatDateIndonesian(date: Date): string {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export default function HomePage() {
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState(getCurrentTimeString());
  const [activeSession, setActiveSession] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const user = session?.user;
  const today = new Date();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <AppHeader title={t("home")} />

      <main className="flex flex-col relative w-full px-6 pt-24 pb-28">
        <div className="flex flex-col w-full pb-6 space-y-6">
          {/* Sync Status Ribbon */}
          <div className="w-full bg-yellow-100 dark:bg-yellow-900/40 px-4 py-2 rounded-full flex items-center justify-between shadow-sm border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              {isOnline ? <Cloud className="w-4 h-4" /> : <CloudOff className="w-4 h-4" />}
              <span className="text-[11px] font-bold uppercase tracking-wider">{t("syncActive")}</span>
            </div>
            <span className="text-[11px] text-yellow-800 dark:text-yellow-200 font-bold uppercase tracking-wider">
              {isOnline ? t("online") : t("offline")}
            </span>
          </div>

          {/* Greeting Section */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800" data-aos="fade-up">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative shrink-0">
                {user?.photoUrl ? (
                  <img
                    alt={user.name || "User"}
                    className="w-14 h-14 rounded-full object-cover shadow-sm ring-2 ring-emerald-500/20"
                    src={user.photoUrl}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xl font-bold shadow-sm ring-1 ring-emerald-200 dark:ring-emerald-800">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                  {t("welcomeGreeting")}, {user?.name?.split(" ")[0] || "Santri"}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate font-medium">
                  {user?.jabatan || user?.role || "Santri"}
                </p>
              </div>
            </div>
          </div>

          {/* Live Clock Card */}
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-md border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center" data-aos="fade-up" data-aos-delay="100">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2 relative z-10">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide">
                {formatDateIndonesian(today)}
              </span>
            </div>
            <div className="flex items-baseline justify-center gap-2 my-2 relative z-10">
              <span className="text-4xl text-emerald-600 dark:text-emerald-400 tracking-tight font-black" style={{ fontVariantNumeric: "tabular-nums" }}>
                {currentTime}
              </span>
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">WIB</span>
            </div>
            
            {/* Session Toggle Chips */}
            <div className="flex items-center gap-2 mt-4 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-full w-full justify-between overflow-x-auto relative z-10 ring-1 ring-slate-200 dark:ring-slate-800">
              {sessions.map((s, idx) => (
                <button
                  key={s.key}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 transition-colors ${
                    activeSession === idx
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => setActiveSession(idx)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Attendance Status Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col space-y-4" data-aos="fade-up" data-aos-delay="150">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {t("attendanceStatus")}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                Belum check-in
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 dark:bg-slate-950 rounded-2xl ring-1 ring-slate-100 dark:ring-slate-800">
              <div className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-100 dark:border-emerald-800/50 text-center">
                <CheckCircle2 className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold">1. {t("checkIn")}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 scale-90">Menunggu</span>
              </div>
              <div className="flex flex-col items-center justify-center py-3 px-1 rounded-xl text-slate-400 dark:text-slate-500 text-center opacity-70">
                <CheckSquare className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold">2. {t("present")}</span>
                <span className="text-[10px] scale-90">--:--</span>
              </div>
              <div className="flex flex-col items-center justify-center py-3 px-1 rounded-xl text-slate-400 dark:text-slate-500 text-center opacity-70">
                <LogOut className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold">3. {t("checkOut")}</span>
                <span className="text-[10px] scale-90">--:--</span>
              </div>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm" data-aos="fade-up" data-aos-delay="200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-500 ring-1 ring-yellow-200 dark:ring-yellow-800/50">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-0.5">{t("todaySchedule")}</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {sessions[activeSession].name}: 07.00–15.30
                </span>
              </div>
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800" data-aos="fade-up" data-aos-delay="250">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{t("monthlySummary")}</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">Oktober 2024</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl ring-1 ring-slate-100 dark:ring-slate-800">
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mb-1">85%</span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Hadir</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl ring-1 ring-slate-100 dark:ring-slate-800">
                <span className="text-xl font-black text-yellow-500 dark:text-yellow-400 mb-1">10%</span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Izin/Sakit</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl ring-1 ring-slate-100 dark:ring-slate-800">
                <span className="text-xl font-black text-red-500 dark:text-red-400 mb-1">5%</span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Alpa</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Check-in Button */}
      <div className="fixed bottom-20 left-0 right-0 z-40 px-6 max-w-md mx-auto" data-aos="zoom-in" data-aos-delay="300">
        <Link
          href="/check-in"
          className="flex items-center justify-center w-full h-[56px] px-6 bg-emerald-600 text-white text-base font-bold rounded-2xl shadow-lg shadow-emerald-600/30 dark:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-700 active:scale-[0.98] transition-all"
        >
          <Pointer className="mr-3 w-5 h-5" />
          {t("checkInNow")}
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
