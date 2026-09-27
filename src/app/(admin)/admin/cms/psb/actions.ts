"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const psbStatusSchema = z.object({
  status: z.enum(["BARU", "DIPROSES", "SELESAI", "DITOLAK"]),
});

export async function updatePsbStatus(id: string, formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = psbStatusSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.psbSubmission.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  revalidatePath("/admin/psb");
  return { success: true };
}

export async function deletePsbSubmission(id: string) {
  await prisma.psbSubmission.delete({ where: { id } });
  revalidatePath("/admin/psb");
  return { success: true };
}
