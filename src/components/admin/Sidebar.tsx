"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { AdminSessionUser } from "@/lib/admin";
import { t } from "@/lib/i18n";

interface NavItem {
  href: string;
  labelKey: string;
  icon: string;
  badgeKey?: string;
  superOnly?: boolean;
  countBadgeKey?: string;
}

interface NavGroup {
  titleKey: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    titleKey: "navGroupMain",
    items: [{ href: "/admin/dashboard", labelKey: "navDashboard", icon: "dashboard" }],
  },
  {
    titleKey: "navGroupAttendance",
    items: [
      { href: "/admin/jadwal", labelKey: "navSchedule", icon: "schedule", countBadgeKey: "sessionCount" },
      { href: "/admin/lokasi", labelKey: "navLocations", icon: "near_me" },
      { href: "/admin/izin-sakit", labelKey: "navLeave", icon: "event_available" },
    ],
  },
  {
    titleKey: "navGroupReports",
    items: [{ href: "/admin/rekap", labelKey: "navRecap", icon: "summarize" }],
  },
  {
    titleKey: "navGroupSystem",
    items: [
      { href: "/admin/akun", labelKey: "navAccounts", icon: "manage_accounts" },
      { href: "/admin/pengaturan", labelKey: "navSettings", icon: "settings" },
      { href: "/admin/audit", labelKey: "navAudit", icon: "history_edu" },
    ],
  },
];

interface SidebarProps {
  user: AdminSessionUser;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ user, collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-8 h-[calc(100%-32px)] z-50 flex flex-col justify-between bg-[#FAF2EE] dark:bg-[#1C1917] border-r border-[#E7E5E4] dark:border-[#292524] transition-all duration-200 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      <div className="flex flex-col min-h-0">
        {/* Brand */}
        <div className={`pt-6 pb-4 ${collapsed ? "px-3" : "px-6"}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0">
              <img src="/logo_redesign.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-base font-bold text-[#1C1917] dark:text-[#F5F5F4] truncate leading-tight">
                  Pondok Pesantren
                </span>
                <span className="text-[11px] text-[#0F766E] dark:text-[#2DD4BF] tracking-wide uppercase font-semibold">
                  Al-Fauzan Nusantara
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-[#D4A017] dark:text-[#FACC15] font-medium tracking-wider">
                {t("motto")}
              </span>
              <span className="text-[11px] text-[#57534E] dark:text-[#A8A29E]">
                {t("adminCity")}
              </span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className={`flex flex-col gap-y-1 mt-2 overflow-y-auto max-h-[calc(100vh-230px)] ${collapsed ? "px-2" : "px-3"}`}>
          {NAV_GROUPS.map((group) => (
            <div key={group.titleKey}>
              {!collapsed && (
                <div className="px-3 pt-4 pb-1 text-[11px] uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] font-bold">
                  {t(group.titleKey)}
                </div>
              )}
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? t(item.labelKey) : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
                      active
                        ? "bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] font-semibold shadow-sm"
                        : "text-[#57534E] dark:text-[#A8A29E] hover:bg-[#F4ECE8] dark:hover:bg-[#292524] hover:text-[#1C1917] dark:hover:text-[#F5F5F4]"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    <span className="material-symbols-outlined text-[20px] shrink-0">
                      {item.icon}
                    </span>
                    {!collapsed && <span className="flex-1">{t(item.labelKey)}</span>}
                    {!collapsed && item.countBadgeKey && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#F4ECE8] dark:bg-[#292524] text-[#57534E] dark:text-[#A8A29E]">
                        {t(item.countBadgeKey)}
                      </span>
                    )}
                    {!collapsed && item.badgeKey && (
                      <span className="flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-full bg-[#FFDFA0] dark:bg-[#78350F] text-[#715300] dark:text-[#FBBF24] font-medium">
                        <span className="material-symbols-outlined text-[12px]">lock</span>
                        {t(item.badgeKey)}
                      </span>
                    )}
                    {collapsed && item.superOnly && (
                      <span className="material-symbols-outlined text-[12px] text-[#D4A017] dark:text-[#FACC15]">
                        lock
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-2 p-3">
        {/* Collapse toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? t("expandMenu") : t("collapseMenu")}
          className="flex items-center justify-center h-9 rounded-xl text-[#57534E] dark:text-[#A8A29E] hover:bg-[#F4ECE8] dark:hover:bg-[#292524] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            {collapsed ? "menu_open" : "menu"}
          </span>
        </button>

        {/* User card */}
        <div className={`rounded-xl bg-[#F4ECE8] dark:bg-[#292524] ${collapsed ? "p-2 flex justify-center" : "p-3"}`}>
          {collapsed ? (
            <div className="w-9 h-9 rounded-full bg-[#0F766E] dark:bg-[#2DD4BF] flex items-center justify-center text-white dark:text-[#0C0A09] font-bold">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-[#0F766E] dark:bg-[#2DD4BF] flex items-center justify-center text-white dark:text-[#0C0A09] font-bold">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#005F26] ring-2 ring-[#F4ECE8] dark:ring-[#292524]" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-[#1C1917] dark:text-[#F5F5F4] truncate">
                  {user.name ?? t("pengurusRole")}
                </span>
                <span className="mt-1 inline-flex self-start text-[11px] px-2 py-0.5 rounded-full bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] leading-none">
                  {user.accessLevel === "SUPER_ADMIN" ? t("superAdminRole") : t("pengurusRole")}
                </span>
              </div>
              <button
                type="button"
                title="Keluar"
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="text-[#57534E] dark:text-[#A8A29E] hover:text-[#DC2626] transition-colors p-1.5 rounded-lg hover:bg-[#FEE2E2] dark:hover:bg-[#7F1D1D]"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
