"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const extracurricularSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  description: z.string().optional(),
  order: z.string().optional(),
});

export async function createExtracurricular(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = extracurricularSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.extracurricular.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      order: parsed.data.order ? parseInt(parsed.data.order) : 0,
    },
  });

  revalidatePath("/admin/ekstrakurikuler");
  revalidatePath("/ekstrakurikuler");
  return { success: true };
}

export async function updateExtracurricular(id: string, formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = extracurricularSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.extracurricular.update({
    where: { id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      order: parsed.data.order ? parseInt(parsed.data.order) : 0,
    },
  });

  revalidatePath("/admin/ekstrakurikuler");
  revalidatePath("/ekstrakurikuler");
  return { success: true };
}

export async function deleteExtracurricular(id: string) {
  await prisma.extracurricular.delete({ where: { id } });
  revalidatePath("/admin/ekstrakurikuler");
  revalidatePath("/ekstrakurikuler");
  return { success: true };
}
