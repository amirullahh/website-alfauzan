"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import type { AdminSessionUser } from "@/lib/admin";

export function AdminShell({
  user,
  children,
}: {
  user: AdminSessionUser;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? "72px" : "260px";

  return (
    <div className="min-w-[1280px] min-h-screen bg-[#FAFAF9] dark:bg-[#0C0A09]">
      {/* Global Admin Marquee */}
      <div className="fixed top-0 left-0 w-full h-8 bg-emerald-800 dark:bg-emerald-950 text-emerald-100 flex items-center z-[60] shadow-sm">
        <div className="w-full h-full overflow-hidden relative flex items-center">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes admin-marquee {
              0% { transform: translateX(100vw); }
              100% { transform: translateX(-100%); }
            }
            .animate-admin-marquee {
              animation: admin-marquee 60s linear infinite;
            }
          `}} />
          <div className="absolute whitespace-nowrap animate-admin-marquee text-xs font-medium tracking-wide flex items-center gap-8">
            <span>✨ Iman menenangkan hatimu, ilmu mempertajam fikiranmu, dan amal memberi arti pada keberadaanmu. Hilang salah satunya, pincanglah seluruh perjalanan.</span>
            <span>✨ Iman menenangkan hatimu, ilmu mempertajam fikiranmu, dan amal memberi arti pada keberadaanmu. Hilang salah satunya, pincanglah seluruh perjalanan.</span>
          </div>
        </div>
      </div>

      <Sidebar
        user={user}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
      />
      <Topbar sidebarWidth={sidebarWidth} />
      <div className="pt-24 transition-all duration-200" style={{ paddingLeft: sidebarWidth }}>
        <main className="w-full px-6 py-6 max-w-[1600px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
