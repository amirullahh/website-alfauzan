import { STATUS_STYLE, type StatusKey } from "@/lib/admin-ui";
import { t } from "@/lib/i18n";

const LABEL_KEY: Record<StatusKey, string> = {
  HADIR: "present",
  TERLAMBAT: "late",
  IZIN: "permission",
  SAKIT: "sick",
  ALPA: "absent",
};

/** Small status pill shared by admin screens (Ringkasan, Rekap, …). */
export function StatusBadge({ status, count }: { status: StatusKey; count?: number }) {
  const style = STATUS_STYLE[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: style.softBg, color: style.softText }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: style.dot }}
        aria-hidden
      />
      {t(LABEL_KEY[status])}
      {count !== undefined && <span className="tabular-nums">· {count}</span>}
    </span>
  );
}
