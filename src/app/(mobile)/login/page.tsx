"use client";

import { useState, useActionState } from "react";
import Image from "next/image";
import { t } from "@/lib/i18n";
import { loginAction } from "@/app/actions";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex flex-col w-full px-6 min-h-screen justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* Brand Identity */}
      <div className="flex flex-col items-center text-center mt-2 mb-8" data-aos="fade-down">
        <div className="relative flex items-center justify-center w-24 h-24 bg-white dark:bg-slate-900 rounded-3xl shadow-md border border-slate-100 dark:border-emerald-800/50 mb-6 p-2 overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 blur-xl"></div>
          <Image
            src="/logo_redesign.jpg"
            alt="Absensi Pondok Logo"
            width={80}
            height={80}
            className="w-full h-full object-contain rounded-2xl relative z-10"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
          {t("appName")}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
          {t("institutionName")}
        </p>
      </div>

      {/* Welcome Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 mb-8 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4" data-aos="fade-up">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/50 ring-1 ring-emerald-100 dark:ring-emerald-800 text-emerald-600 dark:text-emerald-400 shrink-0">
          <span className="material-symbols-outlined text-[24px]">mosque</span>
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            {t("loginTitle")}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {t("loginSubtitle")}
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800" data-aos="fade-up" data-aos-delay="100">
        <form className="flex flex-col gap-5" action={formAction}>
          {state?.error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 text-sm p-4 rounded-2xl font-medium">
              {state.error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300" htmlFor="identifier">
              {t("identifierLabel")}
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm rounded-2xl border border-slate-200 dark:border-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                id="identifier"
                name="identifier"
                inputMode="email"
                placeholder={t("identifierPlaceholder")}
                required
                type="text"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300" htmlFor="password">
              {t("passwordLabel")}
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                className="w-full h-14 pl-12 pr-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm rounded-2xl border border-slate-200 dark:border-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                type={showPassword ? "text" : "password"}
              />
              <button
                aria-label="Tampilkan atau sembunyikan kata sandi"
                className="absolute right-2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors focus:outline-none"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end -mt-2">
            <a
              className="inline-flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors py-2"
              href="/forgot-password"
            >
              {t("forgotPassword")}
            </a>
          </div>

          <button
            className="flex items-center justify-center w-full h-14 mt-2 bg-emerald-600 text-white text-sm font-bold rounded-2xl shadow-md hover:bg-emerald-700 hover:shadow-lg dark:shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-all disabled:opacity-70 group"
            disabled={isPending}
            type="submit"
          >
            <span>{isPending ? "Memuat..." : t("loginButton")}</span>
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>

      {/* Footer Help */}
      <div className="flex items-center justify-center text-center mt-10 px-4 pb-6" data-aos="fade-in" data-aos-delay="200">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {t("helpText")}{" "}
          <a
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            href="tel:+6285720206674"
          >
            {t("contactAdmin")}
          </a>
        </p>
      </div>
    </div>
  );
}
