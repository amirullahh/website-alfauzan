"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const facilitySchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  description: z.string().optional(),
  order: z.string().optional(),
});

export async function createFacility(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = facilitySchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.facility.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      order: parsed.data.order ? parseInt(parsed.data.order) : 0,
    },
  });

  revalidatePath("/admin/fasilitas");
  revalidatePath("/fasilitas");
  return { success: true };
}

export async function updateFacility(id: string, formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = facilitySchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.facility.update({
    where: { id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      order: parsed.data.order ? parseInt(parsed.data.order) : 0,
    },
  });

  revalidatePath("/admin/fasilitas");
  revalidatePath("/fasilitas");
  return { success: true };
}

export async function deleteFacility(id: string) {
  await prisma.facility.delete({ where: { id } });
  revalidatePath("/admin/fasilitas");
  revalidatePath("/fasilitas");
  return { success: true };
}
