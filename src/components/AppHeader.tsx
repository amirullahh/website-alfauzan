"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { t } from "@/lib/i18n";
import { ArrowLeft } from "lucide-react";

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function AppHeader({ title, showBack, onBack }: AppHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl shadow-sm border-b border-slate-100 dark:border-slate-800 pt-safe">
      <div className="max-w-md mx-auto flex flex-col h-20 px-6 justify-between">
        <div className="flex items-center justify-between pb-3 h-full">
          <div className="flex items-center gap-3">
            {showBack ? (
              <button
                aria-label="Kembali"
                className="w-12 h-12 -ml-3 flex items-center justify-center text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={onBack}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            ) : null}
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center">
              <Image
                src="/logo_redesign.jpg"
                alt="Absensi Pondok Logo"
                width={28}
                height={28}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 dark:text-white leading-tight font-heading">
                {t("institutionShort")}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-bold">
                {title}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            {session?.user?.photoUrl ? (
              <img
                alt={session.user.name || "Profile"}
                className="w-9 h-9 rounded-full object-cover shadow-sm ring-2 ring-emerald-500/20"
                src={session.user.photoUrl}
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-sm font-bold ring-1 ring-emerald-200 dark:ring-emerald-800">
                {session?.user?.name?.charAt(0) || "U"}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
