"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PONDOK_DEFAULT, STATUS_ORDER, formatTanggalID, todayLocalISO, type StatusKey } from "@/lib/admin-ui";
import { t } from "@/lib/i18n";

const GeofenceMap = dynamic(
  () => import("@/components/admin/GeofenceMap").then((m) => m.GeofenceMap),
  { ssr: false },
);

interface RekapRecord {
  id: string;
  tanggal: string;
  jamMasuk: string | null;
  jamPulang: string | null;
  status: StatusKey;
  fotoMasukUrl: string | null;
  fotoPulangUrl: string | null;
  lokasiMasukLat: number | null;
  lokasiMasukLng: number | null;
  lokasiMasukJarak: number | null;
  lokasiPulangLat: number | null;
  lokasiPulangLng: number | null;
  user: { id: string; name: string; role: string; nis: string | null; nip: string | null };
  session: { id: string; name: string; jamMulai: string; jamSelesai: string };
}

interface SesiOpt {
  id: string;
  name: string;
}

interface Filters {
  dari: string;
  sampai: string;
  sessionId: string;
  status: string;
  role: string;
  search: string;
}

const LIMIT = 20;

function defaultFilters(): Filters {
  const today = todayLocalISO();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);
  return {
    dari: todayLocalISO(weekAgo),
    sampai: today,
    sessionId: "",
    status: "",
    role: "",
    search: "",
  };
}

export default function AdminRekapPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [draft, setDraft] = useState<Filters>(defaultFilters);
  const [sesiOpts, setSesiOpts] = useState<SesiOpt[]>([]);
  const [records, setRecords] = useState<RekapRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async (f: Filters, forPage: number) => {
    setLoading(true);
    setLoadError(null);
    setExpired(false);
    try {
      const params = new URLSearchParams({ page: String(forPage), limit: String(LIMIT) });
      if (f.dari) params.set("tanggalDari", f.dari);
      if (f.sampai) params.set("tanggalSampai", f.sampai);
      if (f.sessionId) params.set("sessionId", f.sessionId);
      if (f.status) params.set("status", f.status);
      if (f.role) params.set("role", f.role);
      if (f.search.trim()) params.set("search", f.search.trim());
      const res = await fetch(`/api/admin/rekap?${params.toString()}`, {
        credentials: "same-origin",
      });
      const payload = await res.json().catch(() => null);
      if (res.status === 401) {
        setExpired(true);
        setLoadError(t("sessionExpired"));
        return;
      }
      if (!res.ok) {
        setLoadError(payload?.error ?? t("loadFailed"));
        return;
      }
      setRecords(payload.data as RekapRecord[]);
      setTotal(payload.meta.total as number);
    } catch {
      setLoadError(t("loadFailed"));
    } finally {
      setLoading(false);
    }
  }, []);

  // Session options for the filter dropdown (best-effort; table works without it).
  useEffect(() => {
    fetch("/api/admin/sesi", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => {
        if (p?.data) setSesiOpts(p.data.map((s: SesiOpt) => ({ id: s.id, name: s.name })));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    void load(filters, page);
  }, [filters, page, load]);

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setExpandedId(null);
    setFilters(draft);
  }

  function resetFilters() {
    const d = defaultFilters();
    setDraft(d);
    setPage(1);
    setExpandedId(null);
    setFilters(d);
  }

  function exportUrl(format: "csv" | "pdf"): string {
    const params = new URLSearchParams({ format });
    if (filters.dari) params.set("tanggalDari", filters.dari);
    if (filters.sampai) params.set("tanggalSampai", filters.sampai);
    if (filters.sessionId) params.set("sessionId", filters.sessionId);
    if (filters.status) params.set("status", filters.status);
    if (filters.role) params.set("role", filters.role);
    if (filters.search.trim()) params.set("search", filters.search.trim());
    return `/api/admin/rekap/export?${params.toString()}`;
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const inputCls =
    "h-10 px-3 rounded-xl bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] text-sm text-[#1C1917] dark:text-[#F5F5F4] focus:outline-none focus:ring-2 focus:ring-[#0F766E]";
  const labelCls =
    "text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E]";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1917] dark:text-[#F5F5F4]">
            {t("recapTitle")}
          </h1>
          <p className="text-sm text-[#57534E] dark:text-[#A8A29E] mt-1">{t("recapDesc")}</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={exportUrl("csv")}
            className="h-10 px-4 rounded-xl border border-[#0F766E] dark:border-[#2DD4BF] text-sm font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:bg-[#0F766E]/5 dark:hover:bg-[#2DD4BF]/10 inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">table_view</span>
            {t("exportCsv")}
          </a>
          <a
            href={exportUrl("pdf")}
            className="h-10 px-4 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            {t("exportPdf")}
          </a>
        </div>
      </div>

      {/* Filters */}
      <section
        aria-label={t("recapTitle")}
        className="bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] rounded-2xl p-4"
      >
        <form onSubmit={applyFilters} className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="rekap-dari" className={labelCls}>
              {t("filterFrom")}
            </label>
            <input
              id="rekap-dari"
              type="date"
              value={draft.dari}
              max={draft.sampai || undefined}
              onChange={(e) => setDraft((d) => ({ ...d, dari: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="rekap-sampai" className={labelCls}>
              {t("filterTo")}
            </label>
            <input
              id="rekap-sampai"
              type="date"
              value={draft.sampai}
              min={draft.dari || undefined}
              max={todayLocalISO()}
              onChange={(e) => setDraft((d) => ({ ...d, sampai: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="rekap-sesi" className={labelCls}>
              {t("colSession")}
            </label>
            <select
              id="rekap-sesi"
              value={draft.sessionId}
              onChange={(e) => setDraft((d) => ({ ...d, sessionId: e.target.value }))}
              className={`${inputCls} min-w-36`}
            >
              <option value="">{t("filterSession")}</option>
              {sesiOpts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="rekap-status" className={labelCls}>
              {t("statusCol")}
            </label>
            <select
              id="rekap-status"
              value={draft.status}
              onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
              className={`${inputCls} min-w-32`}
            >
              <option value="">{t("filterStatus")}</option>
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="rekap-role" className={labelCls}>
              {t("formRole")}
            </label>
            <select
              id="rekap-role"
              value={draft.role}
              onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
              className={`${inputCls} min-w-32`}
            >
              <option value="">{t("filterRole")}</option>
              <option value="SANTRI">{t("tabSantri")}</option>
              <option value="USTADZ">{t("tabUstadz")}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="rekap-search" className={labelCls}>
              {t("search")}
            </label>
            <input
              id="rekap-search"
              value={draft.search}
              onChange={(e) => setDraft((d) => ({ ...d, search: e.target.value }))}
              placeholder={t("searchAccounts")}
              autoComplete="off"
              className={`${inputCls} w-56`}
            />
          </div>
          <button
            type="submit"
            className="h-10 px-5 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {t("search")}
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="h-10 px-4 rounded-xl border border-[#E7E5E4] dark:border-[#44403C] text-sm font-semibold text-[#57534E] dark:text-[#A8A29E] hover:bg-[#F4ECE8] dark:hover:bg-[#292524]"
          >
            {t("resetFilter")}
          </button>
        </form>
      </section>

      {/* Table */}
      <section className="bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-5 flex flex-col gap-3" aria-live="polite" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-[#F4ECE8] dark:bg-[#292524] animate-pulse" />
            ))}
            <span className="sr-only">{t("loadingData")}</span>
          </div>
        ) : loadError ? (
          <div className="p-6 flex flex-wrap items-center justify-between gap-4" role="alert">
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
                onClick={() => void load(filters, page)}
                className="h-10 px-4 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold"
              >
                {t("retry")}
              </button>
            )}
          </div>
        ) : records.length === 0 ? (
          <div className="p-6 flex items-center gap-3 text-sm text-[#57534E] dark:text-[#A8A29E]">
            <span className="material-symbols-outlined">inbox</span>
            {t("emptyRecap")}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] border-b border-[#E7E5E4] dark:border-[#292524] bg-[#FAFAF9] dark:bg-[#292524]/50">
                    <th scope="col" className="px-5 py-3 font-bold">
                      {t("colDate")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-bold">
                      {t("colName")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-bold">
                      {t("colSession")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-bold">
                      {t("colIn")} / {t("colOut")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-bold">
                      {t("statusCol")}
                    </th>
                    <th scope="col" className="px-5 py-3 font-bold text-right">
                      {t("actionsCol")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <Fragment key={r.id}>
                      <tr className="border-b border-[#F4ECE8] dark:border-[#292524] hover:bg-[#FFFBF7] dark:hover:bg-[#292524]/40">
                        <td className="px-5 py-3 tabular-nums text-[#1C1917] dark:text-[#F5F5F4] whitespace-nowrap">
                          {formatTanggalID(r.tanggal)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-[#1C1917] dark:text-[#F5F5F4]">
                            {r.user.name}
                          </div>
                          <div className="text-xs tabular-nums text-[#57534E] dark:text-[#A8A29E]">
                            {r.user.nis ?? r.user.nip ?? r.user.role}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#57534E] dark:text-[#A8A29E]">{r.session.name}</td>
                        <td className="px-4 py-3 tabular-nums text-[#1C1917] dark:text-[#F5F5F4] whitespace-nowrap">
                          {r.jamMasuk ?? "–"} / {r.jamPulang ?? t("checkedOutMissing")}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setExpandedId((v) => (v === r.id ? null : r.id))}
                            className="h-9 px-3 rounded-xl border border-[#E7E5E4] dark:border-[#44403C] text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:bg-[#F4ECE8] dark:hover:bg-[#292524] inline-flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {expandedId === r.id ? "expand_less" : "expand_more"}
                            </span>
                            {expandedId === r.id ? t("closeDetail") : t("viewDetail")}
                          </button>
                        </td>
                      </tr>
                      {expandedId === r.id && (
                        <tr className="bg-[#FAFAF9] dark:bg-[#292524]/30">
                          <td colSpan={6} className="px-5 py-4">
                            <RecordDetail record={r} />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-[#E7E5E4] dark:border-[#292524]">
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] tabular-nums">
                {total} · {t("pageLabel")} {page} {t("of")} {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-9 px-3 rounded-xl border border-[#E7E5E4] dark:border-[#44403C] text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] disabled:opacity-40 hover:bg-[#F4ECE8] dark:hover:bg-[#292524]"
                >
                  {t("prevPage")}
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-9 px-3 rounded-xl border border-[#E7E5E4] dark:border-[#44403C] text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] disabled:opacity-40 hover:bg-[#F4ECE8] dark:hover:bg-[#292524]"
                >
                  {t("nextPage")}
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function RecordDetail({ record: r }: { record: RekapRecord }) {
  const center =
    r.lokasiMasukLat !== null && r.lokasiMasukLng !== null
      ? { lat: r.lokasiMasukLat, lng: r.lokasiMasukLng }
      : r.lokasiPulangLat !== null && r.lokasiPulangLng !== null
        ? { lat: r.lokasiPulangLat, lng: r.lokasiPulangLng }
        : { lat: PONDOK_DEFAULT.lat, lng: PONDOK_DEFAULT.lng };
  const points = [
    ...(r.lokasiMasukLat !== null && r.lokasiMasukLng !== null
      ? [{ lat: r.lokasiMasukLat, lng: r.lokasiMasukLng, label: `${t("detailIn")}: ${r.jamMasuk ?? "–"}` }]
      : []),
    ...(r.lokasiPulangLat !== null && r.lokasiPulangLng !== null
      ? [{ lat: r.lokasiPulangLat, lng: r.lokasiPulangLng, label: `${t("detailOut")}: ${r.jamPulang ?? "–"}` }]
      : []),
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] p-3">
            <p className="text-xs uppercase tracking-wider font-bold text-[#57534E] dark:text-[#A8A29E]">
              {t("detailIn")}
            </p>
            <p className="mt-1 font-semibold tabular-nums text-[#1C1917] dark:text-[#F5F5F4]">
              {r.jamMasuk ?? "–"}
            </p>
            {r.lokasiMasukJarak !== null && (
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] tabular-nums">
                {t("distance")}: {Math.round(r.lokasiMasukJarak)} {t("meters")}
              </p>
            )}
          </div>
          <div className="rounded-xl bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] p-3">
            <p className="text-xs uppercase tracking-wider font-bold text-[#57534E] dark:text-[#A8A29E]">
              {t("detailOut")}
            </p>
            <p className="mt-1 font-semibold tabular-nums text-[#1C1917] dark:text-[#F5F5F4]">
              {r.jamPulang ?? t("checkedOutMissing")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { url: r.fotoMasukUrl, label: t("detailIn") },
            { url: r.fotoPulangUrl, label: t("detailOut") },
          ].map((p, i) => (
            <figure
              key={i}
              className="rounded-xl overflow-hidden bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C]"
            >
              {p.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.url} alt={`${t("photoProof")} — ${p.label}`} className="w-full h-44 object-cover" />
              ) : (
                <div className="w-full h-44 flex items-center justify-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E]">
                  <span className="material-symbols-outlined">no_photography</span>
                  {t("noPhoto")}
                </div>
              )}
              <figcaption className="px-3 py-2 text-xs font-medium text-[#57534E] dark:text-[#A8A29E]">
                {t("photoProof")} · {p.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wider font-bold text-[#57534E] dark:text-[#A8A29E]">
          {t("locationMap")}
        </p>
        {points.length > 0 ? (
          <GeofenceMap center={center} radiusMeter={PONDOK_DEFAULT.radiusMeter} points={points} height={300} />
        ) : (
          <div className="rounded-xl border border-[#E7E5E4] dark:border-[#44403C] h-[300px] flex items-center justify-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E]">
            <span className="material-symbols-outlined">location_off</span>
            {t("emptyDay")}
          </div>
        )}
      </div>
    </div>
  );
}
