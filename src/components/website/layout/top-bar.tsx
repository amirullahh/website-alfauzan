"use client";

import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-emerald-800 dark:bg-emerald-950 text-emerald-100 py-1.5 px-4 text-xs sm:text-sm flex justify-between items-center overflow-hidden h-8">
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="absolute whitespace-nowrap animate-[marquee_25s_linear_infinite]">
          📢 Pendaftaran Santri Baru (PSB) Tahun Ajaran 2025/2026 dibuka! &nbsp;&nbsp;|&nbsp;&nbsp; 📅 Wisuda Tahfidz 30 Juz — 15 November 2025 &nbsp;&nbsp;|&nbsp;&nbsp; 🏆 Juara 1 MTQ Tingkat Kota Jakarta Selatan
        </div>
      </div>
      <div className="flex items-center gap-4 whitespace-nowrap z-10 bg-emerald-800 dark:bg-emerald-950 pl-4 shrink-0 shadow-[-10px_0_10px_rgba(6,95,70,1)] dark:shadow-[-10px_0_10px_rgba(2,44,34,1)]">
        <span className="hidden sm:flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5" /> (021) 786-1234
        </span>
        <Link href="https://wa.me/6285772020667?text=Assalamualaikum%20Wr%20Wb.%20Setelah%20melihat%20website%20alfantra%2C%20saya%20mau%20tanya%20mengenai%20pendaftaran%20SD%2FSMP%2FSMA%20di%20Pondok%20Pesantren%20AL-Fauzan" target="_blank" className="flex items-center gap-1.5 hover:text-white transition-colors">
          <MessageCircle className="w-3.5 h-3.5" /> 0857-7202-0667
        </Link>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
      `}} />
    </div>
  );
}
