"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { t } from "@/lib/i18n";

type Role = "SANTRI" | "USTADZ" | "PENGURUS";

interface Account {
  id: string;
  email: string;
  name: string;
  role: Role;
  accessLevel: string | null;
  nis: string | null;
  nip: string | null;
  phone: string | null;
  jabatan: string | null;
  statusAkun: "AKTIF" | "NONAKTIF" | "SUSPENDED";
}

interface AddForm {
  email: string;
  password: string;
  name: string;
  role: Role;
  accessLevel: "SUPER_ADMIN" | "PENGURUS";
  nis: string;
  nip: string;
  phone: string;
  jabatan: string;
}

interface EditForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  jabatan: string;
  statusAkun: "AKTIF" | "NONAKTIF" | "SUSPENDED";
  accessLevel: "" | "SUPER_ADMIN" | "PENGURUS";
  nis: string;
  nip: string;
}

const EMPTY_ADD: AddForm = {
  email: "",
  password: "",
  name: "",
  role: "SANTRI",
  accessLevel: "PENGURUS",
  nis: "",
  nip: "",
  phone: "",
  jabatan: "",
};

const TABS: Role[] = ["SANTRI", "USTADZ", "PENGURUS"];
const LIMIT = 20;

type Notice = { tone: "ok" | "err"; text: string } | null;

const STATUS_PILL: Record<Account["statusAkun"], string> = {
  AKTIF: "bg-[#DCFCE7] text-[#166534]",
  NONAKTIF: "bg-[#F4ECE8] dark:bg-[#292524] text-[#57534E] dark:text-[#A8A29E]",
  SUSPENDED: "bg-[#FEE2E2] text-[#991B1B]",
};

const STATUS_DOT: Record<Account["statusAkun"], string> = {
  AKTIF: "#16A34A",
  NONAKTIF: "#A8A29E",
  SUSPENDED: "#DC2626",
};

export default function AdminAkunPage() {
  const [tab, setTab] = useState<Role>("SANTRI");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<Account[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [addForm, setAddForm] = useState<AddForm>(EMPTY_ADD);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const load = useCallback(async (forTab: Role, forSearch: string, forPage: number) => {
    setLoading(true);
    setLoadError(null);
    setExpired(false);
    setForbidden(false);
    try {
      const params = new URLSearchParams({
        role: forTab,
        page: String(forPage),
        limit: String(LIMIT),
      });
      if (forSearch) params.set("search", forSearch);
      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        credentials: "same-origin",
      });
      const payload = await res.json().catch(() => null);
      if (res.status === 401) {
        setExpired(true);
        setLoadError(t("sessionExpired"));
        return;
      }
      if (res.status === 403) {
        setForbidden(true);
        return;
      }
      if (!res.ok) {
        setLoadError(payload?.error ?? t("loadFailed"));
        return;
      }
      setUsers(payload.data as Account[]);
      setTotal(payload.meta.total as number);
    } catch {
      setLoadError(t("loadFailed"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(tab, search, page);
  }, [tab, search, page, load]);

  function switchTab(r: Role) {
    setTab(r);
    setPage(1);
    setConfirmId(null);
  }

  function openAdd() {
    setEditing(null);
    setEditForm(null);
    setAddForm({ ...EMPTY_ADD, role: tab });
    setFormError(null);
    setNotice(null);
    setShowForm(true);
  }

  function openEdit(u: Account) {
    setEditing(u);
    setEditForm({
      name: u.name,
      email: u.email,
      password: "",
      phone: u.phone ?? "",
      jabatan: u.jabatan ?? "",
      statusAkun: u.statusAkun,
      accessLevel:
        u.accessLevel === "SUPER_ADMIN" || u.accessLevel === "PENGURUS" ? u.accessLevel : "",
      nis: u.nis ?? "",
      nip: u.nip ?? "",
    });
    setFormError(null);
    setNotice(null);
    setShowForm(true);
  }

  async function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!addForm.email.includes("@")) {
      setFormError(t("formEmail") + ": tidak valid.");
      return;
    }
    if (addForm.password.length < 8) {
      setFormError(t("formPassword") + ": minimal 8 karakter.");
      return;
    }
    if (!addForm.name.trim()) {
      setFormError(t("formFullName") + ": wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          email: addForm.email.trim(),
          password: addForm.password,
          name: addForm.name.trim(),
          role: addForm.role,
          ...(addForm.role === "PENGURUS" ? { accessLevel: addForm.accessLevel } : {}),
          ...(addForm.nis.trim() ? { nis: addForm.nis.trim() } : {}),
          ...(addForm.nip.trim() ? { nip: addForm.nip.trim() } : {}),
          ...(addForm.phone.trim() ? { phone: addForm.phone.trim() } : {}),
          ...(addForm.jabatan.trim() ? { jabatan: addForm.jabatan.trim() } : {}),
        }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        setFormError(payload?.error ?? t("loadFailed"));
        return;
      }
      setShowForm(false);
      setNotice({ tone: "ok", text: t("savedOk") });
      await load(tab, search, page);
    } catch {
      setFormError(t("loadFailed"));
    } finally {
      setSaving(false);
    }
  }

  async function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing || !editForm) return;
    setFormError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          name: editForm.name.trim(),
          email: editForm.email.trim(),
          ...(editForm.password ? { password: editForm.password } : {}),
          phone: editForm.phone.trim() || null,
          jabatan: editForm.jabatan.trim() || null,
          statusAkun: editForm.statusAkun,
          ...(editing.role === "PENGURUS" && editForm.accessLevel
            ? { accessLevel: editForm.accessLevel }
            : {}),
          nis: editForm.nis.trim() || null,
          nip: editForm.nip.trim() || null,
        }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        setFormError(payload?.error ?? t("loadFailed"));
        return;
      }
      setShowForm(false);
      setEditing(null);
      setEditForm(null);
      setNotice({ tone: "ok", text: t("savedOk") });
      await load(tab, search, page);
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
      const res = await fetch(`/api/admin/users/${id}`, {
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
      await load(tab, search, page);
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
            {t("accountTitle")}
          </h1>
          <p className="text-sm text-[#57534E] dark:text-[#A8A29E] mt-1">{t("accountDesc")}</p>
        </div>
        {!forbidden && (
          <button
            type="button"
            onClick={openAdd}
            className="h-10 px-4 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            {t("addAccount")}
          </button>
        )}
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

      {forbidden ? (
        <div
          className="rounded-2xl border border-[#FDE68A] dark:border-[#78350F] bg-[#FFFBEB] dark:bg-[#1C1917] p-6 flex items-center gap-3"
          role="alert"
        >
          <span className="material-symbols-outlined text-[#D97706]">lock</span>
          <p className="text-sm font-medium text-[#92400E] dark:text-[#FBBF24]">
            {t("superOnlyNote")}
          </p>
        </div>
      ) : (
        <>
          {/* Tabs + search */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              className="inline-flex p-1 rounded-xl bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C]"
              role="tablist"
              aria-label={t("accountTitle")}
            >
              {TABS.map((r) => (
                <button
                  key={r}
                  role="tab"
                  aria-selected={tab === r}
                  type="button"
                  onClick={() => switchTab(r)}
                  className={`h-9 px-4 rounded-lg text-sm font-semibold transition-colors ${
                    tab === r
                      ? "bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09]"
                      : "text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4]"
                  }`}
                >
                  {r === "SANTRI" ? t("tabSantri") : r === "USTADZ" ? t("tabUstadz") : t("tabPengurus")}
                </button>
              ))}
            </div>
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setPage(1);
                setSearch(searchInput.trim());
              }}
            >
              <label htmlFor="akun-search" className="sr-only">
                {t("searchAccounts")}
              </label>
              <input
                id="akun-search"
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

          {showForm && !editing && (
            <section
              aria-label={t("addAccount")}
              className="bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] rounded-2xl p-5 flex flex-col gap-4"
            >
              <h2 className="text-base font-bold text-[#1C1917] dark:text-[#F5F5F4]">
                {t("addAccount")}
              </h2>
              <form
                onSubmit={submitAdd}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="akun-add-nama" className={labelCls}>
                    {t("formFullName")}
                  </label>
                  <input
                    id="akun-add-nama"
                    value={addForm.name}
                    onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                    autoComplete="off"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="akun-add-email" className={labelCls}>
                    {t("formEmail")}
                  </label>
                  <input
                    id="akun-add-email"
                    type="email"
                    value={addForm.email}
                    onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                    autoComplete="off"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="akun-add-pw" className={labelCls}>
                    {t("formPassword")}
                  </label>
                  <input
                    id="akun-add-pw"
                    type="password"
                    value={addForm.password}
                    onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))}
                    autoComplete="new-password"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="akun-add-role" className={labelCls}>
                    {t("formRole")}
                  </label>
                  <select
                    id="akun-add-role"
                    value={addForm.role}
                    onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value as Role }))}
                    className={inputCls}
                  >
                    <option value="SANTRI">{t("tabSantri")}</option>
                    <option value="USTADZ">{t("tabUstadz")}</option>
                    <option value="PENGURUS">{t("tabPengurus")}</option>
                  </select>
                </div>
                {addForm.role === "PENGURUS" ? (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="akun-add-access" className={labelCls}>
                      {t("formAccess")}
                    </label>
                    <select
                      id="akun-add-access"
                      value={addForm.accessLevel}
                      onChange={(e) =>
                        setAddForm((f) => ({
                          ...f,
                          accessLevel: e.target.value as AddForm["accessLevel"],
                        }))
                      }
                      className={inputCls}
                    >
                      <option value="PENGURUS">{t("pengurusRole")}</option>
                      <option value="SUPER_ADMIN">{t("superAdminRole")}</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="akun-add-nis" className={labelCls}>
                      {addForm.role === "SANTRI" ? t("formNis") : t("formNip")}
                    </label>
                    <input
                      id="akun-add-nis"
                      value={addForm.role === "SANTRI" ? addForm.nis : addForm.nip}
                      onChange={(e) =>
                        setAddForm((f) =>
                          f.role === "SANTRI" ? { ...f, nis: e.target.value } : { ...f, nip: e.target.value },
                        )
                      }
                      autoComplete="off"
                      className={inputCls}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="akun-add-phone" className={labelCls}>
                    {t("formPhone")}
                  </label>
                  <input
                    id="akun-add-phone"
                    value={addForm.phone}
                    onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))}
                    autoComplete="off"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2 xl:col-span-3">
                  <label htmlFor="akun-add-jabatan" className={labelCls}>
                    {t("formJabatan")}
                  </label>
                  <input
                    id="akun-add-jabatan"
                    value={addForm.jabatan}
                    onChange={(e) => setAddForm((f) => ({ ...f, jabatan: e.target.value }))}
                    autoComplete="off"
                    className={inputCls}
                  />
                </div>
              </form>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">info</span>
                {t("credentialHint")}
              </p>
              {formError && (
                <p role="alert" className="text-sm font-medium text-[#DC2626]">
                  {formError}
                </p>
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={submitAdd}
                  disabled={saving}
                  className="h-10 px-5 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {saving ? t("loadingData") : t("save")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="h-10 px-5 rounded-xl border border-[#E7E5E4] dark:border-[#44403C] text-sm font-semibold text-[#57534E] dark:text-[#A8A29E] hover:bg-[#F4ECE8] dark:hover:bg-[#292524]"
                >
                  {t("cancel")}
                </button>
              </div>
            </section>
          )}

          {showForm && editing && editForm && (
            <section
              aria-label={t("editAccount")}
              className="bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] rounded-2xl p-5 flex flex-col gap-4"
            >
              <h2 className="text-base font-bold text-[#1C1917] dark:text-[#F5F5F4]">
                {t("editAccount")}: {editing.name}
              </h2>
              <form
                onSubmit={submitEdit}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="akun-edit-nama" className={labelCls}>
                    {t("formFullName")}
                  </label>
                  <input
                    id="akun-edit-nama"
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => f && { ...f, name: e.target.value })}
                    autoComplete="off"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="akun-edit-email" className={labelCls}>
                    {t("formEmail")}
                  </label>
                  <input
                    id="akun-edit-email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm((f) => f && { ...f, email: e.target.value })}
                    autoComplete="off"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="akun-edit-pw" className={labelCls}>
                    {t("formPasswordOptional")}
                  </label>
                  <input
                    id="akun-edit-pw"
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm((f) => f && { ...f, password: e.target.value })}
                    autoComplete="new-password"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="akun-edit-status" className={labelCls}>
                    {t("formStatus")}
                  </label>
                  <select
                    id="akun-edit-status"
                    value={editForm.statusAkun}
                    onChange={(e) =>
                      setEditForm(
                        (f) => f && { ...f, statusAkun: e.target.value as EditForm["statusAkun"] },
                      )
                    }
                    className={inputCls}
                  >
                    <option value="AKTIF">AKTIF</option>
                    <option value="NONAKTIF">NONAKTIF</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
                {editing.role === "PENGURUS" ? (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="akun-edit-access" className={labelCls}>
                      {t("formAccess")}
                    </label>
                    <select
                      id="akun-edit-access"
                      value={editForm.accessLevel}
                      onChange={(e) =>
                        setEditForm(
                          (f) => f && { ...f, accessLevel: e.target.value as EditForm["accessLevel"] },
                        )
                      }
                      className={inputCls}
                    >
                      <option value="">{t("pengurusRole")} (default)</option>
                      <option value="PENGURUS">{t("pengurusRole")}</option>
                      <option value="SUPER_ADMIN">{t("superAdminRole")}</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="akun-edit-nis" className={labelCls}>
                      {editing.role === "SANTRI" ? t("formNis") : t("formNip")}
                    </label>
                    <input
                      id="akun-edit-nis"
                      value={editing.role === "SANTRI" ? editForm.nis : editForm.nip}
                      onChange={(e) =>
                        setEditForm((f) =>
                          f && editing.role === "SANTRI"
                            ? { ...f, nis: e.target.value }
                            : f && { ...f, nip: e.target.value },
                        )
                      }
                      autoComplete="off"
                      className={inputCls}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="akun-edit-phone" className={labelCls}>
                    {t("formPhone")}
                  </label>
                  <input
                    id="akun-edit-phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm((f) => f && { ...f, phone: e.target.value })}
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
                  onClick={submitEdit}
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
                    setEditForm(null);
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
                  <div
                    key={i}
                    className="h-12 rounded-xl bg-[#F4ECE8] dark:bg-[#292524] animate-pulse"
                  />
                ))}
                <span className="sr-only">{t("loadingData")}</span>
              </div>
            ) : loadError ? (
              <div className="p-6 flex flex-wrap items-center justify-between gap-4" role="alert">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#DC2626]">error</span>
                  <p className="text-sm font-medium text-[#7F1D1D] dark:text-[#FECACA]">
                    {loadError}
                  </p>
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
                    onClick={() => void load(tab, search, page)}
                    className="h-10 px-4 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold"
                  >
                    {t("retry")}
                  </button>
                )}
              </div>
            ) : users.length === 0 ? (
              <div className="p-6 flex items-center gap-3 text-sm text-[#57534E] dark:text-[#A8A29E]">
                <span className="material-symbols-outlined">inbox</span>
                {t("emptyAccounts")}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] border-b border-[#E7E5E4] dark:border-[#292524] bg-[#FAFAF9] dark:bg-[#292524]/50">
                        <th scope="col" className="px-5 py-3 font-bold">
                          {t("formFullName")}
                        </th>
                        <th scope="col" className="px-4 py-3 font-bold">
                          {t("formEmail")} / {tab === "SANTRI" ? t("formNis") : t("formNip")}
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
                      {users.map((u) => (
                        <tr
                          key={u.id}
                          className="border-b border-[#F4ECE8] dark:border-[#292524] last:border-0 hover:bg-[#FFFBF7] dark:hover:bg-[#292524]/40"
                        >
                          <td className="px-5 py-3">
                            <div className="font-semibold text-[#1C1917] dark:text-[#F5F5F4]">
                              {u.name}
                            </div>
                            <div className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-0.5">
                              {u.role === "PENGURUS"
                                ? u.accessLevel === "SUPER_ADMIN"
                                  ? t("superAdminRole")
                                  : t("pengurusRole")
                                : (u.jabatan ?? u.role)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-[#1C1917] dark:text-[#F5F5F4]">{u.email}</div>
                            <div className="text-xs tabular-nums text-[#57534E] dark:text-[#A8A29E] mt-0.5">
                              {u.nis ?? u.nip ?? "—"}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_PILL[u.statusAkun]}`}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: STATUS_DOT[u.statusAkun] }}
                                aria-hidden
                              />
                              {u.statusAkun === "AKTIF"
                                ? t("activeBadge")
                                : u.statusAkun === "NONAKTIF"
                                  ? t("inactiveBadge")
                                  : t("suspendedBadge")}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-2">
                              {confirmId === u.id ? (
                                <>
                                  <span className="text-xs font-medium text-[#7F1D1D] dark:text-[#FECACA]">
                                    {t("confirmRemove")}
                                  </span>
                                  <button
                                    type="button"
                                    disabled={busyId === u.id}
                                    onClick={() => void onDelete(u.id)}
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
                                    onClick={() => openEdit(u)}
                                    className="h-9 px-3 rounded-xl border border-[#E7E5E4] dark:border-[#44403C] text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:bg-[#F4ECE8] dark:hover:bg-[#292524] inline-flex items-center gap-1"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                    {t("edit")}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmId(u.id)}
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
        </>
      )}
    </div>
  );
}
