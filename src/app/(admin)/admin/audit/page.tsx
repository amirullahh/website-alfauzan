"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { t } from "@/lib/i18n";

interface AuditEntry {
  id: string;
  aksi: string;
  entitas: string;
  entitasId: string | null;
  detail: string | null;
  createdAt: string;
  actor: { id: string; name: string; email: string };
}

const LIMIT = 20;

const ENTITIES = [
  "AttendanceSession",
  "Location",
  "User",
  "IzinSakit",
  "SystemSetting",
  "AttendanceRecord",
];

function formatWaktu(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminAuditPage() {
  const [entitas, setEntitas] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);

  const load = useCallback(async (forEntitas: string, forSearch: string, forPage: number) => {
    setLoading(true);
    setLoadError(null);
    setExpired(false);
    try {
      const params = new URLSearchParams({ page: String(forPage), limit: String(LIMIT) });
      if (forEntitas) params.set("entitas", forEntitas);
      if (forSearch) params.set("search", forSearch);
      const res = await fetch(`/api/admin/audit?${params.toString()}`, {
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
      setLogs(payload.data as AuditEntry[]);
      setTotal(payload.meta.total as number);
    } catch {
      setLoadError(t("loadFailed"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(entitas, search, page);
  }, [entitas, search, page, load]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1917] dark:text-[#F5F5F4]">
            {t("auditTitle")}
          </h1>
          <p className="text-sm text-[#57534E] dark:text-[#A8A29E] mt-1">{t("auditDesc")}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F4ECE8] dark:bg-[#292524] text-[#57534E] dark:text-[#A8A29E]">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          {t("readonlyBadge")}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          aria-label={t("colEntity")}
          value={entitas}
          onChange={(e) => {
            setEntitas(e.target.value);
            setPage(1);
          }}
          className="h-10 px-3 rounded-xl bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] text-sm text-[#1C1917] dark:text-[#F5F5F4] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
        >
          <option value="">{t("filterEntity")}</option>
          {ENTITIES.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setSearch(searchInput.trim());
          }}
        >
          <label htmlFor="audit-search" className="sr-only">
            {t("search")}
          </label>
          <input
            id="audit-search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("adminSearchPlaceholder")}
            autoComplete="off"
            className="h-10 w-72 px-3 rounded-xl bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] text-sm text-[#1C1917] dark:text-[#F5F5F4] placeholder:text-[#57534E]/60 dark:placeholder:text-[#A8A29E]/60 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
          />
          <button
            type="submit"
            className="h-10 px-4 rounded-xl border border-[#E7E5E4] dark:border-[#44403C] text-sm font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:bg-[#F4ECE8] dark:hover:bg-[#292524]"
          >
            {t("search")}
          </button>
        </form>
      </div>

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
                onClick={() => void load(entitas, search, page)}
                className="h-10 px-4 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold"
              >
                {t("retry")}
              </button>
            )}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-6 flex items-center gap-3 text-sm text-[#57534E] dark:text-[#A8A29E]">
            <span className="material-symbols-outlined">inbox</span>
            {t("emptyAudit")}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] border-b border-[#E7E5E4] dark:border-[#292524] bg-[#FAFAF9] dark:bg-[#292524]/50">
                    <th scope="col" className="px-5 py-3 font-bold whitespace-nowrap">
                      {t("colTime")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-bold">
                      {t("colActor")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-bold">
                      {t("colAction")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-bold">
                      {t("colEntity")}
                    </th>
                    <th scope="col" className="px-5 py-3 font-bold">
                      {t("colDetail")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l) => (
                    <tr
                      key={l.id}
                      className="border-b border-[#F4ECE8] dark:border-[#292524] last:border-0 hover:bg-[#FFFBF7] dark:hover:bg-[#292524]/40 align-top"
                    >
                      <td className="px-5 py-3 tabular-nums text-[#57534E] dark:text-[#A8A29E] whitespace-nowrap">
                        {formatWaktu(l.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[#1C1917] dark:text-[#F5F5F4]">
                          {l.actor.name}
                        </div>
                        <div className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                          {l.actor.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs font-mono px-2 py-1 rounded-lg bg-[#F4ECE8] dark:bg-[#292524] text-[#0F766E] dark:text-[#2DD4BF]">
                          {l.aksi}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-[#57534E] dark:text-[#A8A29E]">
                        {l.entitas}
                        {l.entitasId && (
                          <div className="text-xs font-mono opacity-70">{l.entitasId}</div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-[#1C1917] dark:text-[#F5F5F4] max-w-md break-words">
                        {l.detail ?? "—"}
                      </td>
                    </tr>
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
