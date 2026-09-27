"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const achievementSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  category: z.string().optional(),
  level: z.string().optional(),
  year: z.string().min(1, "Tahun wajib diisi"),
});

export async function createAchievement(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = achievementSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.achievement.create({
    data: {
      title: parsed.data.title,
      category: parsed.data.category || null,
      level: parsed.data.level || null,
      year: parseInt(parsed.data.year),
    },
  });

  revalidatePath("/admin/prestasi");
  revalidatePath("/prestasi");
  return { success: true };
}

export async function updateAchievement(id: string, formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = achievementSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.achievement.update({
    where: { id },
    data: {
      title: parsed.data.title,
      category: parsed.data.category || null,
      level: parsed.data.level || null,
      year: parseInt(parsed.data.year),
    },
  });

  revalidatePath("/admin/prestasi");
  revalidatePath("/prestasi");
  return { success: true };
}

export async function deleteAchievement(id: string) {
  await prisma.achievement.delete({ where: { id } });
  revalidatePath("/admin/prestasi");
  revalidatePath("/prestasi");
  return { success: true };
}
