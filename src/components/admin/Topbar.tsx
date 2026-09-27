"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { t } from "@/lib/i18n";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())} WIB`;
}

export function Topbar({ sidebarWidth }: { sidebarWidth: string }) {
  const { theme, toggleTheme } = useTheme();
  const now = useClock();

  return (
    <header
      className="fixed top-8 right-0 h-16 bg-[#FFF8F5]/80 dark:bg-[#0C0A09]/80 backdrop-blur-xl z-40 border-b border-[#E7E5E4] dark:border-[#292524] px-6 flex items-center justify-between gap-6 transition-all duration-200"
      style={{ left: sidebarWidth }}
    >
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#57534E] dark:text-[#A8A29E] text-[20px]">
            search
          </span>
          <input
            className="w-full h-10 pl-10 pr-16 rounded-xl bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] text-sm text-[#1C1917] dark:text-[#F5F5F4] placeholder:text-[#57534E]/60 dark:placeholder:text-[#A8A29E]/60 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            placeholder={t("adminSearchPlaceholder")}
            type="text"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-[#F4ECE8] dark:bg-[#292524] text-[#57534E] dark:text-[#A8A29E] text-[11px] font-medium tracking-wider">
            Ctrl+K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Date + clock */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4ECE8] dark:bg-[#292524] text-[#1C1917] dark:text-[#F5F5F4]">
          <span className="material-symbols-outlined text-[16px] text-[#0F766E] dark:text-[#2DD4BF]">
            calendar_today
          </span>
          <span className="text-xs font-medium">{now ? formatDate(now) : "…"}</span>
          <span className="text-[#57534E]/40 dark:text-[#A8A29E]/40">|</span>
          <span className="material-symbols-outlined text-[16px] text-[#D4A017] dark:text-[#FACC15]">
            schedule
          </span>
          <span className="text-[13px] font-semibold tabular-nums text-[#0F766E] dark:text-[#2DD4BF]">
            {now ? formatTime(now) : "…"}
          </span>
        </div>

        {/* Theme toggle — real dark mode, persisted */}
        <button
          className="w-10 h-10 rounded-full bg-[#F4ECE8] dark:bg-[#292524] hover:bg-[#E7E5E4] dark:hover:bg-[#44403C] flex items-center justify-center text-[#57534E] dark:text-[#FACC15] transition-colors"
          title={theme === "light" ? "Ubah ke mode gelap" : "Ubah ke mode terang"}
          type="button"
          onClick={toggleTheme}
        >
          <span className="material-symbols-outlined text-[20px]">
            {theme === "light" ? "dark_mode" : "light_mode"}
          </span>
        </button>
      </div>
    </header>
  );
}
