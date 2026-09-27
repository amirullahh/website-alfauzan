"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const profilItems = [
  { title: "Sejarah", href: "/profil/sejarah" },
  { title: "Visi & Misi", href: "/profil/visi-misi" },
  { title: "Sapta Jiwa", href: "/profil/sapta-jiwa" },
  { title: "Struktur Organisasi", href: "/profil/struktur-organisasi" },
];

const menuItems = [
  { label: "Beranda", href: "/" },
  { label: "Program", href: "/program" },
  { label: "Fasilitas", href: "/fasilitas" },
  { label: "Ekstrakurikuler", href: "/ekstrakurikuler" },
  { label: "Prestasi", href: "/prestasi" },
  { label: "Berita", href: "/berita" },
  { label: "Agenda", href: "/agenda" },
  { label: "Guru", href: "/guru" },
  { label: "Galeri", href: "/galeri" },
  { label: "FAQ", href: "/faq" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [profilOpen, setProfilOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "lg:hidden h-11 w-11"
        )}
        aria-label="Buka menu navigasi"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] overflow-y-auto">
        <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
        <div className="flex flex-col gap-6 pt-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-heading text-lg font-bold leading-tight">PP Al Fauzan</span>
              <span className="block text-[10px] font-medium text-muted-foreground">Nusantara</span>
            </div>
          </Link>

          {/* Menu */}
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center rounded-md px-3 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              Beranda
            </Link>

            {/* Profil dropdown */}
            <button
              onClick={() => setProfilOpen(!profilOpen)}
              className="flex items-center justify-between rounded-md px-3 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              Profil
              {profilOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {profilOpen && (
              <div className="ml-3 flex flex-col gap-1 border-l border-border pl-3">
                {profilItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}

            {menuItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center rounded-md px-3 py-3 text-sm font-medium hover:bg-muted transition-colors"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link href="/psb" onClick={() => setOpen(false)} className="w-full">
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Daftar Sekarang
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
