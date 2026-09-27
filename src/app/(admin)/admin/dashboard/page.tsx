"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  STATUS_ORDER,
  STATUS_STYLE,
  formatTanggalID,
  todayLocalISO,
  type StatusKey,
} from "@/lib/admin-ui";
import { t } from "@/lib/i18n";

interface SessionBreakdown {
  sessionId: string;
  sessionName: string;
  HADIR: number;
  TERLAMBAT: number;
  IZIN: number;
  SAKIT: number;
  ALPA: number;
}

interface StatsData {
  tanggal: string;
  byStatus: Record<StatusKey, number>;
  bySession: SessionBreakdown[];
  totalSantri: number;
  totalUstadz: number;
}

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string; expired: boolean }
  | { kind: "ready"; data: StatsData };

function StatCard({
  label,
  value,
  dot,
}: {
  label: string;
  value: number | string;
  dot: string;
}) {
  return (
    <div className="bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] rounded-2xl p-5">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dot }} aria-hidden />
        <p className="text-xs uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] font-bold truncate">
          {label}
        </p>
      </div>
      <p className="text-3xl font-bold text-[#1C1917] dark:text-[#F5F5F4] mt-2 tabular-nums">
        {value}
      </p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [tanggal, setTanggal] = useState<string>(() => todayLocalISO());
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  const load = useCallback(async (forTanggal: string) => {
    setState({ kind: "loading" });
    try {
      const res = await fetch(`/api/admin/stats?tanggal=${encodeURIComponent(forTanggal)}`, {
        credentials: "same-origin",
      });
      const payload = await res.json().catch(() => null);
      if (res.status === 401) {
        setState({ kind: "error", message: t("sessionExpired"), expired: true });
        return;
      }
      if (!res.ok) {
        setState({
          kind: "error",
          message: payload?.error ?? t("loadFailed"),
          expired: false,
        });
        return;
      }
      setState({ kind: "ready", data: payload.data as StatsData });
    } catch {
      setState({ kind: "error", message: t("loadFailed"), expired: false });
    }
  }, []);

  useEffect(() => {
    void load(tanggal);
  }, [tanggal, load]);

  const isEmpty =
    state.kind === "ready" &&
    STATUS_ORDER.every((s) => (state.data.byStatus[s] ?? 0) === 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header + controls */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1917] dark:text-[#F5F5F4]">
            {t("summaryTitle")}
          </h1>
          <p className="text-sm text-[#57534E] dark:text-[#A8A29E] mt-1">
            {t("summaryDesc")} · {formatTanggalID(tanggal)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="ringkasan-tanggal" className="sr-only">
            {t("pickDate")}
          </label>
          <input
            id="ringkasan-tanggal"
            type="date"
            value={tanggal}
            max={todayLocalISO()}
            onChange={(e) => e.target.value && setTanggal(e.target.value)}
            className="h-10 px-3 rounded-xl bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] text-sm text-[#1C1917] dark:text-[#F5F5F4] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
          />
          <button
            type="button"
            onClick={() => void load(tanggal)}
            className="h-10 px-4 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            {t("refresh")}
          </button>
        </div>
      </div>

      {state.kind === "loading" && (
        <div className="flex flex-col gap-6" aria-live="polite" aria-busy="true">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 h-[104px] bg-[#F4ECE8] dark:bg-[#292524] animate-pulse"
              />
            ))}
          </div>
          <div className="rounded-2xl h-48 bg-[#F4ECE8] dark:bg-[#292524] animate-pulse" />
          <span className="sr-only">{t("loadingData")}</span>
        </div>
      )}

      {state.kind === "error" && (
        <div
          className="rounded-2xl border border-[#FECACA] dark:border-[#7F1D1D] bg-[#FEF2F2] dark:bg-[#1C1917] p-6 flex flex-wrap items-center justify-between gap-4"
          role="alert"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#DC2626]">error</span>
            <p className="text-sm font-medium text-[#7F1D1D] dark:text-[#FECACA]">
              {state.message}
            </p>
          </div>
          {state.expired ? (
            <Link
              href="/admin/login"
              className="h-10 px-4 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold inline-flex items-center"
            >
              {t("loginAgain")}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => void load(tanggal)}
              className="h-10 px-4 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold"
            >
              {t("retry")}
            </button>
          )}
        </div>
      )}

      {state.kind === "ready" && (
        <>
          <section aria-label={t("statusToday")}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] mb-3">
              {t("statusToday")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {STATUS_ORDER.map((s) => (
                <StatCard
                  key={s}
                  label={t(
                    s === "HADIR"
                      ? "present"
                      : s === "TERLAMBAT"
                        ? "late"
                        : s === "IZIN"
                          ? "permission"
                          : s === "SAKIT"
                            ? "sick"
                            : "absent",
                  )}
                  value={state.data.byStatus[s] ?? 0}
                  dot={STATUS_STYLE[s].dot}
                />
              ))}
            </div>
          </section>

          <section aria-label={t("totalPopulation")}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] mb-3">
              {t("totalPopulation")}
            </h2>
            <div className="grid grid-cols-2 gap-4 max-w-xl">
              <StatCard label={t("totalSantri")} value={state.data.totalSantri} dot="#0F766E" />
              <StatCard label={t("totalUstadz")} value={state.data.totalUstadz} dot="#D4A017" />
            </div>
          </section>

          <section className="bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] rounded-2xl overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <h2 className="text-base font-bold text-[#1C1917] dark:text-[#F5F5F4]">
                {t("perSessionTitle")}
              </h2>
              <p className="text-sm text-[#57534E] dark:text-[#A8A29E] mt-0.5">
                {t("perSessionDesc")}
              </p>
            </div>
            {isEmpty ? (
              <div className="px-5 pb-6 pt-2 flex items-center gap-3 text-sm text-[#57534E] dark:text-[#A8A29E]">
                <span className="material-symbols-outlined">inbox</span>
                {t("emptyDay")}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] border-y border-[#E7E5E4] dark:border-[#292524] bg-[#FAFAF9] dark:bg-[#292524]/50">
                      <th scope="col" className="px-5 py-3 font-bold">
                        {t("colSession")}
                      </th>
                      {STATUS_ORDER.map((s) => (
                        <th scope="col" key={s} className="px-4 py-3 font-bold text-right">
                          <StatusBadge status={s} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {state.data.bySession.map((row) => (
                      <tr
                        key={row.sessionId}
                        className="border-b border-[#F4ECE8] dark:border-[#292524] last:border-0 hover:bg-[#FFFBF7] dark:hover:bg-[#292524]/40"
                      >
                        <td className="px-5 py-3 font-semibold text-[#1C1917] dark:text-[#F5F5F4]">
                          {row.sessionName}
                        </td>
                        {STATUS_ORDER.map((s) => (
                          <td
                            key={s}
                            className="px-4 py-3 text-right tabular-nums text-[#1C1917] dark:text-[#F5F5F4]"
                          >
                            {row[s] ?? 0}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
