"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatTanggalID, todayLocalISO } from "@/lib/admin-ui";
import { t } from "@/lib/i18n";

type Jenis = "IZIN" | "SAKIT";

interface LeaveEntry {
  id: string;
  tanggalMulai: string;
  tanggalSelesai: string | null;
  jenis: Jenis;
  keterangan: string | null;
  user: { id: string; name: string; role: string; nis: string | null; nip: string | null };
  createdBy: { id: string; name: string };
}

interface UserOpt {
  id: string;
  name: string;
  role: string;
  nis: string | null;
  nip: string | null;
}

const LIMIT = 20;

type Notice = { tone: "ok" | "err"; text: string } | null;

export default function AdminIzinSakitPage() {
  const [jenis, setJenis] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<LeaveEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<LeaveEntry | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [userOpts, setUserOpts] = useState<UserOpt[]>([]);
  const [searchingUser, setSearchingUser] = useState(false);
  const [pickedUser, setPickedUser] = useState<UserOpt | null>(null);
  const [fMulai, setFMulai] = useState(todayLocalISO());
  const [fSelesai, setFSelesai] = useState("");
  const [fJenis, setFJenis] = useState<Jenis>("IZIN");
  const [fNote, setFNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (forJenis: string, forSearch: string, forPage: number) => {
    setLoading(true);
    setLoadError(null);
    setExpired(false);
    try {
      const params = new URLSearchParams({ page: String(forPage), limit: String(LIMIT) });
      if (forJenis) params.set("jenis", forJenis);
      if (forSearch) params.set("search", forSearch);
      const res = await fetch(`/api/admin/izin-sakit?${params.toString()}`, {
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
      setItems(payload.data as LeaveEntry[]);
      setTotal(payload.meta.total as number);
    } catch {
      setLoadError(t("loadFailed"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(jenis, search, page);
  }, [jenis, search, page, load]);

  function resetList() {
    setPage(1);
    setConfirmId(null);
  }

  function openAdd() {
    setEditing(null);
    setUserQuery("");
    setUserOpts([]);
    setPickedUser(null);
    setFMulai(todayLocalISO());
    setFSelesai("");
    setFJenis("IZIN");
    setFNote("");
    setFormError(null);
    setNotice(null);
    setShowForm(true);
  }

  function openEdit(e: LeaveEntry) {
    setEditing(e);
    setPickedUser({
      id: e.user.id,
      name: e.user.name,
      role: e.user.role,
      nis: e.user.nis,
      nip: e.user.nip,
    });
    setFMulai(e.tanggalMulai);
    setFSelesai(e.tanggalSelesai ?? "");
    setFJenis(e.jenis);
    setFNote(e.keterangan ?? "");
    setFormError(null);
    setNotice(null);
    setShowForm(true);
  }

  async function findUser() {
    if (!userQuery.trim()) return;
    setSearchingUser(true);
    try {
      const params = new URLSearchParams({ search: userQuery.trim(), limit: "20" });
      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        credentials: "same-origin",
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        setFormError(payload?.error ?? t("loadFailed"));
        return;
      }
      // Izin/sakit hanya untuk Santri/Ustadz (aturan API) — saring di klien.
      setUserOpts(
        (payload.data as UserOpt[]).filter((u) => u.role === "SANTRI" || u.role === "USTADZ"),
      );
    } catch {
      setFormError(t("loadFailed"));
    } finally {
      setSearchingUser(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!pickedUser) {
      setFormError(t("formUser") + ": " + t("pickUser"));
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fMulai)) {
      setFormError(t("leaveFrom") + ": YYYY-MM-DD");
      return;
    }
    if (fSelesai && (fSelesai < fMulai || !/^\d{4}-\d{2}-\d{2}$/.test(fSelesai))) {
      setFormError(t("leaveTo") + ": ≥ " + t("leaveFrom"));
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/admin/izin-sakit/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            tanggalMulai: fMulai,
            tanggalSelesai: fSelesai || null,
            jenis: fJenis,
            keterangan: fNote.trim() || null,
          }),
        });
        const payload = await res.json().catch(() => null);
        if (!res.ok) {
          setFormError(payload?.error ?? t("loadFailed"));
          return;
        }
      } else {
        const res = await fetch("/api/admin/izin-sakit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            userId: pickedUser.id,
            tanggalMulai: fMulai,
            ...(fSelesai ? { tanggalSelesai: fSelesai } : {}),
            jenis: fJenis,
            ...(fNote.trim() ? { keterangan: fNote.trim() } : {}),
          }),
        });
        const payload = await res.json().catch(() => null);
        if (!res.ok) {
          setFormError(payload?.error ?? t("loadFailed"));
          return;
        }
      }
      setShowForm(false);
      setEditing(null);
      setNotice({ tone: "ok", text: t("savedOk") });
      await load(jenis, search, page);
    } catch {
      setFormError(t("loadFailed"));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    setBusyId(id);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/izin-sakit/${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        setNotice({ tone: "err", text: payload?.error ?? t("loadFailed") });
        setConfirmId(null);
        return;
      }
      setConfirmId(null);
      setNotice({ tone: "ok", text: t("deletedOk") });
      await load(jenis, search, page);
    } catch {
      setNotice({ tone: "err", text: t("loadFailed") });
    } finally {
      setBusyId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const inputCls =
    "h-11 px-3 rounded-xl bg-[#FAFAF9] dark:bg-[#292524] border border-[#E7E5E4] dark:border-[#44403C] text-sm text-[#1C1917] dark:text-[#F5F5F4] focus:outline-none focus:ring-2 focus:ring-[#0F766E] w-full";
  const labelCls =
    "text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E]";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1917] dark:text-[#F5F5F4]">
            {t("leaveTitle")}
          </h1>
          <p className="text-sm text-[#57534E] dark:text-[#A8A29E] mt-1">{t("leaveDesc")}</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="h-10 px-4 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">event_available</span>
          {t("addLeave")}
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
          aria-label={editing ? t("editLeave") : t("addLeave")}
          className="bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] rounded-2xl p-5 flex flex-col gap-4"
        >
          <h2 className="text-base font-bold text-[#1C1917] dark:text-[#F5F5F4]">
            {editing ? t("editLeave") : t("addLeave")}
          </h2>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <span className={labelCls}>{t("formUser")}</span>
              {editing ? (
                <p className="text-sm font-semibold text-[#1C1917] dark:text-[#F5F5F4]">
                  {editing.user.name}{" "}
                  <span className="font-normal tabular-nums text-[#57534E] dark:text-[#A8A29E]">
                    ({editing.user.nis ?? editing.user.nip ?? editing.user.role})
                  </span>
                </p>
              ) : pickedUser ? (
                <div className="flex items-center justify-between gap-2 rounded-xl bg-[#F0FDF4] dark:bg-[#292524] border border-[#BBF7D0] dark:border-[#44403C] px-3 py-2.5">
                  <p className="text-sm font-semibold text-[#166534] dark:text-[#86EFAC]">
                    {pickedUser.name}{" "}
                    <span className="font-normal tabular-nums">
                      ({pickedUser.nis ?? pickedUser.nip ?? pickedUser.role})
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setPickedUser(null)}
                    className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] hover:text-[#DC2626]"
                  >
                    {t("cancel")}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      placeholder={t("pickUser")}
                      autoComplete="off"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() => void findUser()}
                      disabled={searchingUser || !userQuery.trim()}
                      className="h-11 px-4 shrink-0 rounded-xl border border-[#E7E5E4] dark:border-[#44403C] text-sm font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:bg-[#F4ECE8] dark:hover:bg-[#292524] disabled:opacity-40"
                    >
                      {searchingUser ? t("loadingData") : t("findUser")}
                    </button>
                  </div>
                  {userOpts.length > 0 && (
                    <ul className="rounded-xl border border-[#E7E5E4] dark:border-[#44403C] divide-y divide-[#F4ECE8] dark:divide-[#292524] max-h-44 overflow-y-auto">
                      {userOpts.map((u) => (
                        <li key={u.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setPickedUser(u);
                              setUserOpts([]);
                            }}
                            className="w-full text-left px-3 py-2.5 text-sm hover:bg-[#FFFBF7] dark:hover:bg-[#292524]/60"
                          >
                            <span className="font-semibold text-[#1C1917] dark:text-[#F5F5F4]">
                              {u.name}
                            </span>{" "}
                            <span className="tabular-nums text-[#57534E] dark:text-[#A8A29E]">
                              ({u.nis ?? u.nip ?? u.role})
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cuti-mulai" className={labelCls}>
                {t("leaveFrom")}
              </label>
              <input
                id="cuti-mulai"
                type="date"
                value={fMulai}
                max={fSelesai || undefined}
                onChange={(e) => setFMulai(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cuti-selesai" className={labelCls}>
                {t("leaveTo")}
              </label>
              <input
                id="cuti-selesai"
                type="date"
                value={fSelesai}
                min={fMulai || undefined}
                onChange={(e) => setFSelesai(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cuti-jenis" className={labelCls}>
                {t("leaveType")}
              </label>
              <select
                id="cuti-jenis"
                value={fJenis}
                onChange={(e) => setFJenis(e.target.value as Jenis)}
                className={inputCls}
              >
                <option value="IZIN">{t("permission")}</option>
                <option value="SAKIT">{t("sick")}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cuti-note" className={labelCls}>
                {t("leaveNote")}
              </label>
              <input
                id="cuti-note"
                value={fNote}
                onChange={(e) => setFNote(e.target.value)}
                autoComplete="off"
                className={inputCls}
              />
            </div>
          </form>
          {formError && (
            <p role="alert" className="text-sm font-medium text-[#DC2626]">
              {formError}
            </p>
          )}
          <div className="flex items-center gap-2">
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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          aria-label={t("leaveType")}
          value={jenis}
          onChange={(e) => {
            setJenis(e.target.value);
            resetList();
          }}
          className="h-10 px-3 rounded-xl bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] text-sm text-[#1C1917] dark:text-[#F5F5F4] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
        >
          <option value="">{t("filterJenis")}</option>
          <option value="IZIN">{t("permission")}</option>
          <option value="SAKIT">{t("sick")}</option>
        </select>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            resetList();
            setSearch(searchInput.trim());
          }}
        >
          <label htmlFor="cuti-search" className="sr-only">
            {t("searchAccounts")}
          </label>
          <input
            id="cuti-search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("searchAccounts")}
            autoComplete="off"
            className="h-10 w-64 px-3 rounded-xl bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] text-sm text-[#1C1917] dark:text-[#F5F5F4] placeholder:text-[#57534E]/60 dark:placeholder:text-[#A8A29E]/60 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
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
                onClick={() => void load(jenis, search, page)}
                className="h-10 px-4 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold"
              >
                {t("retry")}
              </button>
            )}
          </div>
        ) : items.length === 0 ? (
          <div className="p-6 flex items-center gap-3 text-sm text-[#57534E] dark:text-[#A8A29E]">
            <span className="material-symbols-outlined">inbox</span>
            {t("emptyLeave")}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] border-b border-[#E7E5E4] dark:border-[#292524] bg-[#FAFAF9] dark:bg-[#292524]/50">
                    <th scope="col" className="px-5 py-3 font-bold">
                      {t("colName")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-bold">
                      {t("leaveType")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-bold">
                      {t("periodCol")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-bold">
                      {t("createdBy")}
                    </th>
                    <th scope="col" className="px-5 py-3 font-bold text-right">
                      {t("actionsCol")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-[#F4ECE8] dark:border-[#292524] last:border-0 hover:bg-[#FFFBF7] dark:hover:bg-[#292524]/40"
                    >
                      <td className="px-5 py-3">
                        <div className="font-semibold text-[#1C1917] dark:text-[#F5F5F4]">
                          {e.user.name}
                        </div>
                        <div className="text-xs tabular-nums text-[#57534E] dark:text-[#A8A29E]">
                          {e.user.nis ?? e.user.nip ?? e.user.role}
                        </div>
                        {e.keterangan && (
                          <div className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-0.5 italic">
                            “{e.keterangan}”
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: "#FEF3C7",
                            color: "#92400E",
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: "#D97706" }}
                            aria-hidden
                          />
                          {e.jenis === "IZIN" ? t("permission") : t("sick")}
                        </span>
                      </td>
                      <td className="px-4 py-3 tabular-nums text-[#1C1917] dark:text-[#F5F5F4] whitespace-nowrap">
                        {formatTanggalID(e.tanggalMulai)}
                        {e.tanggalSelesai ? (
                          <>
                            {" — "}
                            {formatTanggalID(e.tanggalSelesai)}
                          </>
                        ) : (
                          <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] font-bold">
                            {t("ongoingBadge")}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#57534E] dark:text-[#A8A29E]">
                        {e.createdBy.name}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {confirmId === e.id ? (
                            <>
                              <span className="text-xs font-medium text-[#7F1D1D] dark:text-[#FECACA]">
                                {t("confirmRemove")}
                              </span>
                              <button
                                type="button"
                                disabled={busyId === e.id}
                                onClick={() => void onDelete(e.id)}
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
                                onClick={() => openEdit(e)}
                                className="h-9 px-3 rounded-xl border border-[#E7E5E4] dark:border-[#44403C] text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:bg-[#F4ECE8] dark:hover:bg-[#292524] inline-flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                {t("edit")}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmId(e.id)}
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
