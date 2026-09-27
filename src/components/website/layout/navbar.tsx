"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, X, ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: language === "id" ? "Beranda" : "Home", href: "/" },
    { 
      name: language === "id" ? "Profil" : "Profile", 
      href: "#",
      dropdown: [
        { name: language === "id" ? "Visi & Misi" : "Vision & Mission", href: "/profil/visi-misi" },
        { name: language === "id" ? "Sejarah" : "History", href: "/profil/sejarah" },
        { name: language === "id" ? "Struktur Organisasi" : "Organization Structure", href: "/profil/struktur-organisasi" },
      ]
    },
    { name: language === "id" ? "Program" : "Programs", href: "/program" },
    { name: language === "id" ? "Berita" : "News", href: "/berita" },
    { name: language === "id" ? "Galeri" : "Gallery", href: "/galeri" },
    { name: language === "id" ? "Prestasi" : "Achievements", href: "/prestasi" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id");
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-white/80 backdrop-blur-md dark:bg-slate-900/70 shadow-sm" : "bg-white dark:bg-slate-900"
    )}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
              <Image src="/logo_redesign.jpg" alt="Logo Al-Fauzan" width={36} height={36} className="rounded-full relative z-10" />
            </div>
            <span className="font-bold text-lg text-emerald-900 dark:text-emerald-400 hidden sm:block group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
              Pondok Pesantren Al-Fauzan Nusantara
            </span>
            <span className="font-bold text-lg text-emerald-900 dark:text-emerald-400 block sm:hidden group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
              Al-Fauzan
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-3">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group py-2">
                {link.dropdown ? (
                  <button className={cn(
                    "flex items-center gap-1 px-4 py-2 rounded-md font-bold transition-all duration-300",
                    pathname.startsWith("/profil") 
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                      : "bg-transparent text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  )}>
                    {link.name} <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>
                ) : (
                  <Link href={link.href} className={cn(
                    "flex px-4 py-2 rounded-md font-bold transition-all duration-300",
                    pathname === link.href 
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                      : "bg-transparent text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  )}>
                    {link.name}
                  </Link>
                )}

                {link.dropdown && (
                  <div className="absolute top-full left-0 mt-0 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {link.dropdown.map((dropLink) => (
                      <Link key={dropLink.name} href={dropLink.href} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">
                        {dropLink.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

            <Link href="/login" className="flex items-center gap-1 px-4 py-2 rounded-md bg-transparent text-slate-700 dark:text-slate-200 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-300">
              Login
            </Link>

            <Link href="/psb" className="px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all duration-300">
              PSB
            </Link>
            
            <button onClick={toggleLanguage} className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors" title={language === "id" ? "Switch to English" : "Ganti ke Indonesia"}>
              <Globe className="w-4 h-4" />
              <span className="text-[10px] font-bold absolute mt-5 ml-4 bg-emerald-500 text-white px-1 rounded-sm">{language.toUpperCase()}</span>
            </button>

            <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="text-sm font-bold">Mode</span>
            </button>
          </nav>

          {/* Mobile Toggle */}
          <div className="flex xl:hidden items-center gap-3">
            <button onClick={toggleLanguage} className="flex items-center justify-center p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 relative">
              <Globe className="w-5 h-5" />
              <span className="text-[9px] font-bold absolute bottom-0 right-0 bg-emerald-500 text-white px-1 rounded-sm">{language.toUpperCase()}</span>
            </button>
            <button onClick={toggleTheme} className="flex items-center gap-2 p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden absolute top-20 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <div key={link.name}>
              {link.dropdown ? (
                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">{link.name}</span>
                  <div className="flex flex-col pl-4 gap-2 border-l-2 border-emerald-100 dark:border-slate-700">
                    {link.dropdown.map(dropLink => (
                      <Link key={dropLink.name} href={dropLink.href} className="text-slate-600 dark:text-slate-400" onClick={() => setIsMobileMenuOpen(false)}>
                        {dropLink.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link href={link.href} className="font-semibold text-slate-900 dark:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                  {link.name}
                </Link>
              )}
            </div>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link href="/login" className="font-semibold text-slate-900 dark:text-white" onClick={() => setIsMobileMenuOpen(false)}>
              Login
            </Link>
          </div>
          <Link href="/psb" className="mt-2 text-center w-full px-5 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold" onClick={() => setIsMobileMenuOpen(false)}>
            {language === "id" ? "Pendaftaran Santri Baru (PSB)" : "New Student Admission (PSB)"}
          </Link>
        </div>
      )}
    </header>
  );
}
