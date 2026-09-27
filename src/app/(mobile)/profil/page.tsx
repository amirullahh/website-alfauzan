"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { t } from "@/lib/i18n";
import { useTheme } from "@/components/ThemeProvider";
import { ShieldCheck, GraduationCap, Building2, User, Mail, Phone, Fingerprint, Lock, Settings, Globe, Moon, Sun, Info, ChevronDown, ChevronUp, LogOut } from "lucide-react";

export default function ProfilPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [showAbout, setShowAbout] = useState(false);

  const user = session?.user;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <AppHeader title={t("profile")} />

      <main className="flex flex-col relative w-full px-6 pt-24 pb-28">
        <div className="flex flex-col w-full gap-6">
          {/* Account Status */}
          <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Status Akun: Aktif Terverifikasi</span>
            </div>
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          </div>

          {/* Profile Header */}
          <div className="flex flex-col items-center p-6 rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden" data-aos="fade-up">
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-yellow-500/10 blur-2xl pointer-events-none"></div>
            
            <div className="relative mb-4">
              <div className="w-[100px] h-[100px] rounded-full p-1.5 bg-emerald-50 dark:bg-emerald-900/30 shadow-md flex items-center justify-center ring-1 ring-emerald-200 dark:ring-emerald-800/50">
                {user?.photoUrl ? (
                  <img
                    alt={user.name || "User"}
                    className="w-full h-full rounded-full object-cover"
                    src={user.photoUrl}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300 text-3xl font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm border-2 border-white dark:border-slate-900">
                <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {user?.name || "Pengguna"}
            </h2>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <GraduationCap className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">{user?.jabatan || user?.role || "Santri"}</span>
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium">
              <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {t("institutionName")}
            </p>
          </div>

          {/* Account Info */}
          <div className="flex flex-col p-5 rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 gap-4" data-aos="fade-up" data-aos-delay="100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                {t("accountInfo")}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                {t("displayOnly")}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <InfoRow icon={Mail} label={t("email")} value={user?.email || "-"} />
              <InfoRow icon={Phone} label={t("phone")} value={"+62 812-3456-7890"} />
              <InfoRow
                icon={Fingerprint}
                label={(user as unknown as { nis?: string; nip?: string })?.nis ? t("nis") : t("nip")}
                value={(user as unknown as { nis?: string; nip?: string })?.nis || (user as unknown as { nis?: string; nip?: string })?.nip || "-"}
              />
            </div>
          </div>

          {/* Settings */}
          <div className="flex flex-col p-5 rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 gap-4" data-aos="fade-up" data-aos-delay="150">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{t("settings")}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{t("language")}</span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Bahasa Indonesia</span>
                </div>
              </div>
              <div className="inline-flex items-center bg-white dark:bg-slate-900 p-1 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
                <button className="flex items-center justify-center px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-sm">
                  ID
                </button>
                <button className="flex items-center justify-center px-4 py-1.5 rounded-full text-slate-500 dark:text-slate-400 text-xs font-bold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  EN
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                  {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{t("theme")}</span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{theme === "dark" ? t("dark") : t("light")}</span>
                </div>
              </div>
              <button
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${theme === "dark" ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"}`}
                onClick={toggleTheme}
              >
                <span
                  className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center ${
                    theme === "dark" ? "translate-x-7" : "translate-x-1"
                  }`}
                >
                  {theme === "dark" ? <Moon className="w-3 h-3 text-emerald-600" /> : <Sun className="w-3 h-3 text-slate-400" />}
                </span>
              </button>
            </div>
          </div>

          {/* About */}
          <button
            className="flex items-center justify-between p-5 rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            onClick={() => setShowAbout(!showAbout)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Info className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{t("about")}</span>
            </div>
            {showAbout ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
          </button>

          {showAbout && (
            <div className="flex flex-col items-center p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 text-center" data-aos="fade-down">
              <Image
                src="/logo_redesign.jpg"
                alt="Logo Pondok Pesantren Al-Fauzan Nusantara"
                width={120}
                height={120}
                className="w-24 h-24 object-contain rounded-2xl mb-4 shadow-sm"
              />
              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{t("institutionName")}</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">Yayasan Islam Al Fauzan Nusantara</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-500 font-bold mt-2">Membentuk Generasi Qur&apos;ani Berakhlak Mulia</p>
              <div className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400 space-y-1">
                <p>Jl. Gintung No. 200, RT.11/RW.2, Tanjung Barat</p>
                <p>Kec. Jagakarsa, Kota Jakarta Selatan, DKI Jakarta 12530</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400">
                <p>{t("version")}: 1.0.0 (MVP)</p>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            className="flex items-center justify-center w-full h-[56px] px-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-bold rounded-2xl shadow-sm hover:bg-red-100 dark:hover:bg-red-900/40 active:scale-[0.98] transition-all"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 w-5 h-5" />
            {t("logout")}
          </button>

          {/* Footer */}
          <div className="text-center pb-4 pt-4">
            <p className="text-[11px] font-medium text-slate-400">
              {t("appName")} v1.0.0 &copy; {new Date().getFullYear()} {t("institutionShort")}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Koneksi terenkripsi SSL/TLS</p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-sm">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{value}</span>
        </div>
      </div>
      <Lock className="text-slate-300 dark:text-slate-600 w-4 h-4 shrink-0 mx-2" />
    </div>
  );
}
