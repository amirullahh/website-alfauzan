"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { t } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock send reset link — in production this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSent(true);
    setLoading(false);
    setCooldown(60);

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full px-margin min-h-screen justify-center">
      <div className="flex flex-col items-center text-center mt-2 mb-6">
        <div className="relative flex items-center justify-center w-20 h-20 bg-surface-container-lowest rounded-2xl shadow-sm mb-4 p-2 overflow-hidden">
          <Image
            src="/logo_redesign.jpg"
            alt="Absensi Pondok Logo"
            width={72}
            height={72}
            className="w-full h-full object-contain rounded-lg"
            priority
          />
        </div>
        <h1 className="text-lg font-semibold text-primary tracking-tight">
          {t("forgotPasswordTitle")}
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          {t("forgotPasswordDesc")}
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
        {sent ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full bg-tertiary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px] text-on-tertiary-fixed-variant">
                check_circle
              </span>
            </div>
            <p className="text-sm text-on-surface text-center">
              Link reset password telah dikirim ke email Anda. Periksa inbox atau folder spam.
            </p>
            <p className="text-xs text-on-surface-variant">
              {cooldown > 0
                ? `${t("resendIn")} ${cooldown}s`
                : "Link belum diterima?"}
            </p>
            {cooldown === 0 && (
              <button
                className="text-sm font-semibold text-primary hover:underline"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
              >
                Kirim Ulang
              </button>
            )}
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface" htmlFor="email">
                Email
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-[20px] pointer-events-none">
                  mail
                </span>
                <input
                  className="w-full h-[52px] pl-11 pr-4 bg-surface-container-low text-on-surface text-sm rounded-2xl placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
                  id="email"
                  inputMode="email"
                  placeholder="email@contoh.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              className="flex items-center justify-center w-full h-[52px] px-6 bg-primary text-on-primary text-sm font-semibold rounded-full shadow-md hover:bg-primary-container active:scale-[0.99] transition-all disabled:opacity-50"
              disabled={loading}
              type="submit"
            >
              <span>{loading ? "Mengirim..." : t("sendResetLink")}</span>
            </button>
          </form>
        )}
      </div>

      <div className="flex items-center justify-center text-center mt-6 px-4 pb-6">
        <Link
          className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
          href="/login"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {t("backToLogin")}
        </Link>
      </div>

      {/* Contact Info */}
      <div className="bg-surface-container-low rounded-xl p-4 mx-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">support_agent</span>
          <div>
            <p className="text-sm font-semibold text-on-surface">Sekretariat Akademik Pondok</p>
            <p className="text-xs text-on-surface-variant mt-1">
              Senin–Ahad, 07.00–20.30 WIB
            </p>
            <a
              className="text-xs text-primary font-semibold mt-1 inline-block"
              href="tel:+6285720206674"
            >
              +62 857-2020-6674
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
