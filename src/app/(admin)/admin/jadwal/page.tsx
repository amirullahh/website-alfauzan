"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { SESI_DEFAULTS, defaultWindowFor, jamRange } from "@/lib/admin-ui";
import { t } from "@/lib/i18n";

interface Sesi {
  id: string;
  name: string;
  jamMulai: string;
  jamSelesai: string;
  batasToleransiMenit: number;
  locationId: string | null;
  location?: { id: string; name: string } | null;
  _count?: { records: number };
}

interface FormState {
  name: string;
  jamMulai: string;
  jamSelesai: string;
  toleransi: string;
}

const EMPTY_FORM: FormState = { name: "", jamMulai: "", jamSelesai: "", toleransi: "15" };

type Notice = { tone: "ok" | "err"; text: string } | null;

export default function AdminJadwalPage() {
  const [sesi, setSesi] = useState<Sesi[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Sesi | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    setExpired(false);
    try {
      const res = await fetch("/api/admin/sesi", { credentials: "same-origin" });
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
      setSesi(payload.data as Sesi[]);
    } catch {
      setLoadError(t("loadFailed"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setNotice(null);
    setShowForm(true);
  }

  function openEdit(s: Sesi) {
    setEditing(s);
    setForm({
      name: s.name,
      jamMulai: s.jamMulai,
      jamSelesai: s.jamSelesai,
      toleransi: String(s.batasToleransiMenit),
    });
    setFormError(null);
    setNotice(null);
    setShowForm(true);
  }

  /** When the name matches a §5.2 default, prefill its window (still editable). */
  function onNameChange(name: string) {
    setForm((f) => {
      const next = { ...f, name };
      if (!editing) {
        const win = defaultWindowFor(name);
        if (win) {
          next.jamMulai = win.jamMulai;
          next.jamSelesai = win.jamSelesai;
        }
      }
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const toleransi = Number(form.toleransi);
    if (!form.name.trim()) {
      setFormError(t("formName") + ": " + t("formNameHint"));
      return;
    }
    if (!/^\d{2}:\d{2}$/.test(form.jamMulai) || !/^\d{2}:\d{2}$/.test(form.jamSelesai)) {
      setFormError(`${t("formStart")}/${t("formEnd")}: HH:mm`);
      return;
    }
    if (!Number.isInteger(toleransi) || toleransi <= 0) {
      setFormError(t("formTolerance") + ": > 0");
      return;
    }

    setSaving(true);
    try {
      const url = editing ? `/api/admin/sesi/${editing.id}` : "/api/admin/sesi";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          name: form.name.trim(),
          jamMulai: form.jamMulai,
          jamSelesai: form.jamSelesai,
          batasToleransiMenit: toleransi,
        }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        setFormError(payload?.error ?? t("loadFailed"));
        return;
      }
      setShowForm(false);
      setEditing(null);
      setNotice({ tone: "ok", text: t("savedOk") });
      await load();
    } catch {
      setFormError(t("loadFailed"));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    setDeleting(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/sesi/${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        // 409 = still has records → surfaced verbatim so admin knows the count.
        setNotice({ tone: "err", text: payload?.error ?? t("loadFailed") });
        setConfirmId(null);
        return;
      }
      setConfirmId(null);
      setNotice({ tone: "ok", text: t("deletedOk") });
      await load();
    } catch {
      setNotice({ tone: "err", text: t("loadFailed") });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1917] dark:text-[#F5F5F4]">
            {t("scheduleTitle")}
          </h1>
          <p className="text-sm text-[#57534E] dark:text-[#A8A29E] mt-1">
            {t("scheduleDesc")}
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="h-10 px-4 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {t("addSession")}
        </button>
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

      {showForm && (
        <section
          aria-label={editing ? t("editSession") : t("addSession")}
          className="bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] rounded-2xl p-5"
        >
          <h2 className="text-base font-bold text-[#1C1917] dark:text-[#F5F5F4] mb-4">
            {editing ? t("editSession") : t("addSession")}
          </h2>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="sesi-name"
                className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E]"
              >
                {t("formName")}
              </label>
              <input
                id="sesi-name"
                list="sesi-defaults"
                value={form.name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Subuh"
                autoComplete="off"
                className="h-11 px-3 rounded-xl bg-[#FAFAF9] dark:bg-[#292524] border border-[#E7E5E4] dark:border-[#44403C] text-sm text-[#1C1917] dark:text-[#F5F5F4] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
              <datalist id="sesi-defaults">
                {SESI_DEFAULTS.map((s) => (
                  <option key={s.name} value={s.name}>
                    {jamRange(s.jamMulai, s.jamSelesai)}
                  </option>
                ))}
              </datalist>
              <span className="text-xs text-[#57534E] dark:text-[#A8A29E]">{t("formNameHint")}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="sesi-start"
                className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E]"
              >
                {t("formStart")}
              </label>
              <input
                id="sesi-start"
                type="time"
                value={form.jamMulai}
                onChange={(e) => setForm((f) => ({ ...f, jamMulai: e.target.value }))}
                className="h-11 px-3 rounded-xl bg-[#FAFAF9] dark:bg-[#292524] border border-[#E7E5E4] dark:border-[#44403C] text-sm text-[#1C1917] dark:text-[#F5F5F4] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="sesi-end"
                className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E]"
              >
                {t("formEnd")}
              </label>
              <input
                id="sesi-end"
                type="time"
                value={form.jamSelesai}
                onChange={(e) => setForm((f) => ({ ...f, jamSelesai: e.target.value }))}
                className="h-11 px-3 rounded-xl bg-[#FAFAF9] dark:bg-[#292524] border border-[#E7E5E4] dark:border-[#44403C] text-sm text-[#1C1917] dark:text-[#F5F5F4] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="sesi-toleransi"
                className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E]"
              >
                {t("formTolerance")}
              </label>
              <input
                id="sesi-toleransi"
                type="number"
                min={1}
                value={form.toleransi}
                onChange={(e) => setForm((f) => ({ ...f, toleransi: e.target.value }))}
                className="h-11 px-3 rounded-xl bg-[#FAFAF9] dark:bg-[#292524] border border-[#E7E5E4] dark:border-[#44403C] text-sm text-[#1C1917] dark:text-[#F5F5F4] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
              <span className="text-xs text-[#57534E] dark:text-[#A8A29E]">{t("toleranceHint")}</span>
            </div>
          </form>
          {formError && (
            <p role="alert" className="mt-3 text-sm font-medium text-[#DC2626]">
              {formError}
            </p>
          )}
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={onSubmit}
              disabled={saving}
              className="h-10 px-5 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving ? t("loadingData") : t("save")}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="h-10 px-5 rounded-xl border border-[#E7E5E4] dark:border-[#44403C] text-sm font-semibold text-[#57534E] dark:text-[#A8A29E] hover:bg-[#F4ECE8] dark:hover:bg-[#292524]"
            >
              {t("cancel")}
            </button>
          </div>
        </section>
      )}

      <section className="bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-5 flex flex-col gap-3" aria-live="polite" aria-busy="true">
            {Array.from({ length: 5 }).map((_, i) => (
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
                onClick={() => void load()}
                className="h-10 px-4 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold"
              >
                {t("retry")}
              </button>
            )}
          </div>
        ) : sesi.length === 0 ? (
          <div className="p-6 flex items-center gap-3 text-sm text-[#57534E] dark:text-[#A8A29E]">
            <span className="material-symbols-outlined">inbox</span>
            {t("emptySessions")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] border-b border-[#E7E5E4] dark:border-[#292524] bg-[#FAFAF9] dark:bg-[#292524]/50">
                  <th scope="col" className="px-5 py-3 font-bold">
                    {t("colSession")}
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    {t("hoursCol")}
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    {t("toleranceCol")}
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    {t("locationCol")}
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold text-right">
                    {t("recordsCol")}
                  </th>
                  <th scope="col" className="px-5 py-3 font-bold text-right">
                    {t("actionsCol")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sesi.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-[#F4ECE8] dark:border-[#292524] last:border-0 hover:bg-[#FFFBF7] dark:hover:bg-[#292524]/40"
                  >
                    <td className="px-5 py-3 font-semibold text-[#1C1917] dark:text-[#F5F5F4]">
                      {s.name}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-[#1C1917] dark:text-[#F5F5F4]">
                      {jamRange(s.jamMulai, s.jamSelesai)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-[#57534E] dark:text-[#A8A29E]">
                      {s.batasToleransiMenit} mnt
                    </td>
                    <td className="px-4 py-3 text-[#57534E] dark:text-[#A8A29E]">
                      {s.location?.name ?? t("noLocation")}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-[#1C1917] dark:text-[#F5F5F4]">
                      {s._count?.records ?? 0}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {confirmId === s.id ? (
                          <>
                            <span className="text-xs font-medium text-[#7F1D1D] dark:text-[#FECACA]">
                              {t("confirmRemove")}
                            </span>
                            <button
                              type="button"
                              disabled={deleting}
                              onClick={() => void onDelete(s.id)}
                              className="h-9 px-3 rounded-xl bg-[#DC2626] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                            >
                              {t("yesDelete")}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmId(null)}
                              className="h-9 px-3 rounded-xl border border-[#E7E5E4] dark:border-[#44403C] text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]"
                            >
                              {t("cancel")}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => openEdit(s)}
                              className="h-9 px-3 rounded-xl border border-[#E7E5E4] dark:border-[#44403C] text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:bg-[#F4ECE8] dark:hover:bg-[#292524] inline-flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                              {t("edit")}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmId(s.id)}
                              className="h-9 px-3 rounded-xl border border-[#FECACA] dark:border-[#7F1D1D] text-xs font-semibold text-[#DC2626] hover:bg-[#FEF2F2] dark:hover:bg-[#7F1D1D]/30 inline-flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                              {t("remove")}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
