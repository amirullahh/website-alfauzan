"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/i18n";
import { Home, History, User } from "lucide-react";

const navItems = [
  { href: "/home", label: t("home"), icon: Home },
  { href: "/riwayat", label: t("history"), icon: History },
  { href: "/profil", label: t("profile"), icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-20 h-14 rounded-xl transition-colors ${
                isActive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <div className={`relative flex items-center justify-center w-12 h-8 rounded-full transition-colors ${isActive ? "bg-emerald-100/50 dark:bg-emerald-900/30" : ""}`}>
                <Icon className={`w-6 h-6 ${isActive ? "fill-current" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-bold mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
