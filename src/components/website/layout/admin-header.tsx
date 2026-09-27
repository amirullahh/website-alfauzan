"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/berita": "Kelola Berita",
  "/admin/agenda": "Kelola Agenda",
  "/admin/prestasi": "Kelola Prestasi",
  "/admin/program": "Kelola Program",
  "/admin/fasilitas": "Kelola Fasilitas",
  "/admin/ekstrakurikuler": "Kelola Ekstrakurikuler",
  "/admin/guru": "Kelola Guru",
  "/admin/galeri": "Kelola Galeri",
  "/admin/faq": "Kelola FAQ",
  "/admin/psb": "Pengelolaan PSB",
  "/admin/pengaturan": "Pengaturan",
};

interface AdminHeaderProps {
  user: { name?: string | null };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>
        <div className="hidden sm:block text-sm text-muted-foreground">
          Halo, {user.name || "Admin"}
        </div>
      </div>
    </header>
  );
}
