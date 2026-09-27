import { prisma } from "./db";

/**
 * Writes an audit trail entry (PRD §11.3 layar #12). Fire-and-forget safe:
 * callers should await it, but a logging failure must never break the
 * primary mutation, so errors are swallowed after console.error.
 */
export async function writeAudit(params: {
  actorId: string;
  aksi: string;
  entitas: string;
  entitasId?: string;
  detail?: string;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: params.actorId,
        aksi: params.aksi,
        entitas: params.entitas,
        entitasId: params.entitasId,
        detail: params.detail,
      },
    });
  } catch (err) {
    console.error("writeAudit failed:", err);
  }
}
