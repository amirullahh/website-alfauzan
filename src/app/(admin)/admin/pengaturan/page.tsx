"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { t } from "@/lib/i18n";

const KNOWN_KEYS = [
  "toleransi_terlambat_menit",
  "radius_geofence_default_meter",
  "kontak_hubungi_admin",
  "jam_layanan_admin",
  "tema_default",
] as const;

const LABEL_KEY: Record<string, string> = {
  toleransi_terlambat_menit: "labelToleransi",
  radius_geofence_default_meter: "labelRadius",
  kontak_hubungi_admin: "labelKontak",
  jam_layanan_admin: "labelJamLayanan",
  tema_default: "labelTema",
};

type Notice = { tone: "ok" | "err"; text: string } | null;

export default function AdminPengaturanPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    setExpired(false);
    try {
      const [settingsRes, probeRes] = await Promise.all([
        fetch("/api/admin/pengaturan", { credentials: "same-origin" }),
        // Capability probe: only Super Admin can list users. 403 → Pengurus biasa → read-only.
        fetch("/api/admin/users?limit=1", { credentials: "same-origin" }),
      ]);
      const payload = await settingsRes.json().catch(() => null);
      if (settingsRes.status === 401) {
        setExpired(true);
        setLoadError(t("sessionExpired"));
        return;
      }
      if (!settingsRes.ok) {
        setLoadError(payload?.error ?? t("loadFailed"));
        return;
      }
      const map: Record<string, string> = {};
      for (const s of payload.data as { key: string; value: string }[]) map[s.key] = s.value;
      setValues(map);
      setReadOnly(probeRes.status === 403);
    } catch {
      setLoadError(t("loadFailed"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setNotice(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/pengaturan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ settings: values }),
      });
      const payload = await res.json().catch(() => null);
      if (res.status === 403) {
        setReadOnly(true);
        setNotice({ tone: "err", text: t("superOnlyNote") });
        return;
      }
      if (!res.ok) {
        setNotice({ tone: "err", text: payload?.error ?? t("loadFailed") });
        return;
      }
      const map: Record<string, string> = {};
      for (const s of payload.data as { key: string; value: string }[]) map[s.key] = s.value;
      setValues(map);
      setNotice({ tone: "ok", text: t("settingsSaved") });
    } catch {
      setNotice({ tone: "err", text: t("loadFailed") });
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "h-11 px-3 rounded-xl bg-[#FAFAF9] dark:bg-[#292524] border border-[#E7E5E4] dark:border-[#44403C] text-sm text-[#1C1917] dark:text-[#F5F5F4] focus:outline-none focus:ring-2 focus:ring-[#0F766E] w-full disabled:opacity-60";

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-[#1C1917] dark:text-[#F5F5F4]">
          {t("settingsTitle")}
        </h1>
        <p className="text-sm text-[#57534E] dark:text-[#A8A29E] mt-1">{t("settingsDesc")}</p>
      </div>

      {notice && (
        <div
          role={notice.tone === "err" ? "alert" : "status"}
          className={`rounded-2xl border p-4 flex items-center gap-3 text-sm font-medium ${
            notice.tone === "ok"
              ? "border-[#BBF7D0] dark:border-[#14532D] bg-[#F0FDF4] dark:bg-[#1C1917] text-[#166534] dark:text-[#86EFAC]"
              : "border-[#FECACA] dark:border-[#7F1D1D] bg-[#FEF2F2] dark:bg-[#1C1917] text-[#7F1D1D] dark:text-[#FECACA]"
          }`}
        >
          <span className="material-symbols-outlined">
            {notice.tone === "ok" ? "check_circle" : "error"}
          </span>
          {notice.text}
        </div>
      )}

      {readOnly && !loading && !loadError && (
        <div
          className="rounded-2xl border border-[#FDE68A] dark:border-[#78350F] bg-[#FFFBEB] dark:bg-[#1C1917] p-4 flex items-center gap-3"
          role="note"
        >
          <span className="material-symbols-outlined text-[#D97706]">lock</span>
          <p className="text-sm font-medium text-[#92400E] dark:text-[#FBBF24]">
            {t("superOnlyNote")}
          </p>
        </div>
      )}

      <section className="bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] rounded-2xl p-5">
        {loading ? (
          <div className="flex flex-col gap-3" aria-live="polite" aria-busy="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-[#F4ECE8] dark:bg-[#292524] animate-pulse" />
            ))}
            <span className="sr-only">{t("loadingData")}</span>
          </div>
        ) : loadError ? (
          <div className="flex flex-wrap items-center justify-between gap-4" role="alert">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#DC2626]">error</span>
              <p className="text-sm font-medium text-[#7F1D1D] dark:text-[#FECACA]">{loadError}</p>
            </div>
            {expired ? (
              <Link
                href="/admin/login"
                className="h-10 px-4 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold inline-flex items-center"
              >
                {t("loginAgain")}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => void load()}
                className="h-10 px-4 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold"
              >
                {t("retry")}
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={onSave} className="flex flex-col gap-4">
            {KNOWN_KEYS.map((key) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label
                  htmlFor={`set-${key}`}
                  className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E]"
                >
                  {t(LABEL_KEY[key])}
                </label>
                <span className="text-xs font-mono text-[#57534E]/70 dark:text-[#A8A29E]/70">
                  {key}
                </span>
                {key === "tema_default" ? (
                  <select
                    id={`set-${key}`}
                    value={values[key] ?? "light"}
                    disabled={readOnly}
                    onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                    className={`${inputCls} max-w-xs`}
                  >
                    <option value="light">{t("light")}</option>
                    <option value="dark">{t("dark")}</option>
                  </select>
                ) : (
                  <input
                    id={`set-${key}`}
                    value={values[key] ?? ""}
                    disabled={readOnly}
                    onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                    autoComplete="off"
                    inputMode={
                      key === "toleransi_terlambat_menit" || key === "radius_geofence_default_meter"
                        ? "numeric"
                        : "text"
                    }
                    className={`${inputCls} max-w-md`}
                  />
                )}
              </div>
            ))}
            {!readOnly && (
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="h-10 px-5 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {saving ? t("loadingData") : t("saveSettings")}
                </button>
              </div>
            )}
          </form>
        )}
      </section>
    </div>
  );
}
