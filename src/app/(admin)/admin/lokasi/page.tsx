"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { PONDOK_DEFAULT } from "@/lib/admin-ui";
import { t } from "@/lib/i18n";

const GeofenceMap = dynamic(
  () => import("@/components/admin/GeofenceMap").then((m) => m.GeofenceMap),
  { ssr: false },
);

interface Lokasi {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeter: number;
  isActive: boolean;
  isDefault: boolean;
  _count?: { sessions: number };
}

interface FormState {
  name: string;
  lat: string;
  lng: string;
  radius: string;
  isActive: boolean;
  isDefault: boolean;
}

const EMPTY_FORM: FormState = {
  name: "",
  lat: String(PONDOK_DEFAULT.lat),
  lng: String(PONDOK_DEFAULT.lng),
  radius: String(PONDOK_DEFAULT.radiusMeter),
  isActive: true,
  isDefault: false,
};

type Notice = { tone: "ok" | "err"; text: string } | null;

function parseNum(v: string): number | null {
  const n = Number(v);
  return v.trim() !== "" && Number.isFinite(n) ? n : null;
}

export default function AdminLokasiPage() {
  const [lokasi, setLokasi] = useState<Lokasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Lokasi | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    setExpired(false);
    try {
      const res = await fetch("/api/admin/lokasi", { credentials: "same-origin" });
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
      setLokasi(payload.data as Lokasi[]);
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

  function openEdit(l: Lokasi) {
    setEditing(l);
    setForm({
      name: l.name,
      lat: String(l.latitude),
      lng: String(l.longitude),
      radius: String(l.radiusMeter),
      isActive: l.isActive,
      isDefault: l.isDefault,
    });
    setFormError(null);
    setNotice(null);
    setShowForm(true);
  }

  const mapCenter = useMemo(() => {
    const lat = parseNum(form.lat) ?? PONDOK_DEFAULT.lat;
    const lng = parseNum(form.lng) ?? PONDOK_DEFAULT.lng;
    return { lat, lng };
  }, [form.lat, form.lng]);

  const mapRadius = useMemo(() => {
    const r = parseInt(form.radius, 10);
    return Number.isInteger(r) && r > 0 ? r : PONDOK_DEFAULT.radiusMeter;
  }, [form.radius]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const lat = parseNum(form.lat);
    const lng = parseNum(form.lng);
    const radius = parseInt(form.radius, 10);
    if (!form.name.trim()) {
      setFormError(t("formLocName") + ": wajib diisi.");
      return;
    }
    if (lat === null || lat < -90 || lat > 90 || lng === null || lng < -180 || lng > 180) {
      setFormError(t("formLat") + " (-90..90) / " + t("formLng") + " (-180..180) tidak valid.");
      return;
    }
    if (!Number.isInteger(radius) || radius <= 0) {
      setFormError(t("formRadius") + ": > 0");
      return;
    }

    setSaving(true);
    try {
      const url = editing ? `/api/admin/lokasi/${editing.id}` : "/api/admin/lokasi";
      const body: Record<string, unknown> = {
        name: form.name.trim(),
        latitude: lat,
        longitude: lng,
        radiusMeter: radius,
        isActive: form.isActive,
      };
      if (editing && form.isDefault !== editing.isDefault) body.isDefault = form.isDefault;
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body),
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

  async function toggleActive(l: Lokasi) {
    setBusyId(l.id);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/lokasi/${l.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ isActive: !l.isActive }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        setNotice({ tone: "err", text: payload?.error ?? t("loadFailed") });
        return;
      }
      await load();
    } catch {
      setNotice({ tone: "err", text: t("loadFailed") });
    } finally {
      setBusyId(null);
    }
  }

  async function onDelete(id: string) {
    setBusyId(id);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/lokasi/${id}`, {
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
      await load();
    } catch {
      setNotice({ tone: "err", text: t("loadFailed") });
    } finally {
      setBusyId(null);
    }
  }

  const inputCls =
    "h-11 px-3 rounded-xl bg-[#FAFAF9] dark:bg-[#292524] border border-[#E7E5E4] dark:border-[#44403C] text-sm text-[#1C1917] dark:text-[#F5F5F4] focus:outline-none focus:ring-2 focus:ring-[#0F766E] w-full";
  const labelCls =
    "text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E]";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1917] dark:text-[#F5F5F4]">
            {t("locationTitle")}
          </h1>
          <p className="text-sm text-[#57534E] dark:text-[#A8A29E] mt-1">{t("locationDesc")}</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="h-10 px-4 rounded-xl bg-[#0F766E] dark:bg-[#2DD4BF] text-white dark:text-[#0C0A09] text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add_location</span>
          {t("addLocation")}
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
          aria-label={editing ? t("editLocation") : t("addLocation")}
          className="bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] rounded-2xl p-5 flex flex-col gap-4"
        >
          <h2 className="text-base font-bold text-[#1C1917] dark:text-[#F5F5F4]">
            {editing ? t("editLocation") : t("addLocation")}
          </h2>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5 md:col-span-2 xl:col-span-1">
              <label htmlFor="lok-nama" className={labelCls}>
                {t("formLocName")}
              </label>
              <input
                id="lok-nama"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Masjid Jami' & Gedung Asrama"
                autoComplete="off"
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lok-lat" className={labelCls}>
                {t("formLat")}
              </label>
              <input
                id="lok-lat"
                type="number"
                step="any"
                value={form.lat}
                onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lok-lng" className={labelCls}>
                {t("formLng")}
              </label>
              <input
                id="lok-lng"
                type="number"
                step="any"
                value={form.lng}
                onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lok-radius" className={labelCls}>
                {t("formRadius")}
              </label>
              <input
                id="lok-radius"
                type="number"
                min={1}
                value={form.radius}
                onChange={(e) => setForm((f) => ({ ...f, radius: e.target.value }))}
                className={inputCls}
              />
            </div>
          </form>
          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-[#1C1917] dark:text-[#F5F5F4]">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="w-4 h-4 accent-[#0F766E]"
              />
              {t("formActive")}
            </label>
            {editing && (
              <label className="inline-flex items-center gap-2 text-sm font-medium text-[#1C1917] dark:text-[#F5F5F4]">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
                  className="w-4 h-4 accent-[#D4A017]"
                />
                {t("formDefault")}
              </label>
            )}
          </div>
          <div>
            <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">mouse</span>
              {t("pickHint")}
            </p>
            <GeofenceMap
              center={mapCenter}
              radiusMeter={mapRadius}
              height={300}
              onPick={(lat, lng) =>
                setForm((f) => ({ ...f, lat: lat.toFixed(7), lng: lng.toFixed(7) }))
              }
            />
          </div>
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

      <section className="bg-white dark:bg-[#1C1917] border border-[#E7E5E4] dark:border-[#44403C] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-5 flex flex-col gap-3" aria-live="polite" aria-busy="true">
            {Array.from({ length: 3 }).map((_, i) => (
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
        ) : lokasi.length === 0 ? (
          <div className="p-6 flex items-center gap-3 text-sm text-[#57534E] dark:text-[#A8A29E]">
            <span className="material-symbols-outlined">inbox</span>
            {t("emptyLocations")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] border-b border-[#E7E5E4] dark:border-[#292524] bg-[#FAFAF9] dark:bg-[#292524]/50">
                  <th scope="col" className="px-5 py-3 font-bold">
                    {t("formLocName")}
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    {t("coordsCol")}
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold text-right">
                    {t("radiusCol")}
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    {t("statusCol")}
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold text-right">
                    {t("sesiCol")}
                  </th>
                  <th scope="col" className="px-5 py-3 font-bold text-right">
                    {t("actionsCol")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {lokasi.map((l) => (
                  <Fragment key={l.id}>
                    <tr
                      className="border-b border-[#F4ECE8] dark:border-[#292524] last:border-0 hover:bg-[#FFFBF7] dark:hover:bg-[#292524]/40"
                    >
                      <td className="px-5 py-3 font-semibold text-[#1C1917] dark:text-[#F5F5F4]">
                        <span className="inline-flex items-center gap-2">
                          {l.name}
                          {l.isDefault && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#D4A017]/20 dark:bg-[#FACC15]/20 text-[#715300] dark:text-[#FACC15] font-bold">
                              {t("defaultBadge")}
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 tabular-nums text-[#57534E] dark:text-[#A8A29E]">
                        {l.latitude.toFixed(6)}, {l.longitude.toFixed(6)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-[#1C1917] dark:text-[#F5F5F4]">
                        {l.radiusMeter} m
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          title={l.isActive ? t("inactiveBadge") : t("activeBadge")}
                          disabled={busyId === l.id}
                          onClick={() => void toggleActive(l)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold disabled:opacity-50 ${
                            l.isActive
                              ? "bg-[#DCFCE7] text-[#166534]"
                              : "bg-[#F4ECE8] dark:bg-[#292524] text-[#57534E] dark:text-[#A8A29E]"
                          }`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: l.isActive ? "#16A34A" : "#A8A29E" }}
                            aria-hidden
                          />
                          {l.isActive ? t("activeBadge") : t("inactiveBadge")}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-[#1C1917] dark:text-[#F5F5F4]">
                        {l._count?.sessions ?? 0}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setExpandedId((v) => (v === l.id ? null : l.id))}
                            className="h-9 px-3 rounded-xl border border-[#E7E5E4] dark:border-[#44403C] text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] hover:bg-[#F4ECE8] dark:hover:bg-[#292524] inline-flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">map</span>
                            {t("showMap")}
                          </button>
                          <button
                            type="button"
                            onClick={() => openEdit(l)}
                            className="h-9 px-3 rounded-xl border border-[#E7E5E4] dark:border-[#44403C] text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:bg-[#F4ECE8] dark:hover:bg-[#292524] inline-flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                            {t("edit")}
                          </button>
                          {confirmId === l.id ? (
                            <>
                              <button
                                type="button"
                                disabled={busyId === l.id}
                                onClick={() => void onDelete(l.id)}
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
                            <button
                              type="button"
                              onClick={() => setConfirmId(l.id)}
                              className="h-9 px-3 rounded-xl border border-[#FECACA] dark:border-[#7F1D1D] text-xs font-semibold text-[#DC2626] hover:bg-[#FEF2F2] dark:hover:bg-[#7F1D1D]/30 inline-flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                              {t("remove")}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedId === l.id && (
                      <tr className="bg-[#FAFAF9] dark:bg-[#292524]/30">
                        <td colSpan={6} className="px-5 py-4">
                          <GeofenceMap
                            center={{ lat: l.latitude, lng: l.longitude }}
                            radiusMeter={l.radiusMeter}
                            height={280}
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
