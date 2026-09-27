"use client";

import { useState, useActionState } from "react";
import Image from "next/image";
import { t } from "@/lib/i18n";
import { loginAction } from "@/app/actions";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen min-w-[1280px] flex items-center justify-center bg-[#FAFAF9] dark:bg-[#0C0A09] px-8 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative flex items-center justify-center w-20 h-20 bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] rounded-2xl shadow-sm mb-4 p-2 overflow-hidden">
            <Image
              src="/logo_redesign.jpg"
              alt="Logo Pondok Pesantren Al-Fauzan Nusantara"
              width={72}
              height={72}
              className="w-full h-full object-contain rounded-lg"
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-[#1C1917] dark:text-[#F5F5F4]">
            {t("institutionName")}
          </h1>
          <p className="text-sm text-[#57534E] dark:text-[#A8A29E] mt-1">
            Dashboard Pengurus · {t("motto")}
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1C1917] dark:text-[#F5F5F4]">
            {t("adminLoginTitle")}
          </h2>
          <p className="text-sm text-[#57534E] dark:text-[#A8A29E] mt-1 mb-5">
            {t("adminLoginSubtitle")}
          </p>

          <form className="flex flex-col gap-4" action={formAction}>
            <input type="hidden" name="redirectUrl" value="/admin/dashboard" />
            {state?.error && (
              <div className="bg-[#FEE2E2] dark:bg-[#7F1D1D] text-[#DC2626] dark:text-[#F87171] text-sm p-3 rounded-xl">
                {state.error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#1C1917] dark:text-[#F5F5F4]" htmlFor="identifier">
                {t("adminIdentifierLabel")}
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-[#57534E] dark:text-[#A8A29E] text-[20px] pointer-events-none">
                  mail
                </span>
                <input
                  className="w-full h-12 pl-11 pr-4 bg-[#FAF2EE] dark:bg-[#292524] border border-[#E7E5E4] dark:border-[#44403C] text-[#1C1917] dark:text-[#F5F5F4] text-sm rounded-xl placeholder:text-[#6E7977] focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all"
                  id="identifier"
                  name="identifier"
                  placeholder="contoh: pengurus@alfauzan.id"
                  required
                  type="text"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#1C1917] dark:text-[#F5F5F4]" htmlFor="password">
                {t("passwordLabel")}
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-[#57534E] dark:text-[#A8A29E] text-[20px] pointer-events-none">
                  lock
                </span>
                <input
                  className="w-full h-12 pl-11 pr-12 bg-[#FAF2EE] dark:bg-[#292524] border border-[#E7E5E4] dark:border-[#44403C] text-[#1C1917] dark:text-[#F5F5F4] text-sm rounded-xl placeholder:text-[#6E7977] focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                />
                <button
                  aria-label="Tampilkan atau sembunyikan kata sandi"
                  className="absolute right-1 w-10 h-10 flex items-center justify-center text-[#57534E] dark:text-[#A8A29E] hover:text-[#0F766E] dark:hover:text-[#2DD4BF] transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              className="flex items-center justify-center w-full h-12 px-6 bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold rounded-full hover:bg-[#0D655E] transition-all disabled:opacity-50"
              disabled={isPending}
              type="submit"
            >
              <span>{isPending ? "Memuat..." : t("adminLoginButton")}</span>
              <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#57534E] dark:text-[#A8A29E] mt-6">
          {t("adminLoginHelp")}
        </p>
      </div>
    </div>
  );
}
