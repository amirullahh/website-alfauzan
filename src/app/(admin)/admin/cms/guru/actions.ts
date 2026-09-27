"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const teacherSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  role: z.string().optional(),
  bio: z.string().optional(),
  order: z.string().optional(),
});

export async function createTeacher(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = teacherSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.teacher.create({
    data: {
      name: parsed.data.name,
      role: parsed.data.role || null,
      bio: parsed.data.bio || null,
      order: parsed.data.order ? parseInt(parsed.data.order) : 0,
    },
  });

  revalidatePath("/admin/guru");
  revalidatePath("/guru");
  return { success: true };
}

export async function updateTeacher(id: string, formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = teacherSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.teacher.update({
    where: { id },
    data: {
      name: parsed.data.name,
      role: parsed.data.role || null,
      bio: parsed.data.bio || null,
      order: parsed.data.order ? parseInt(parsed.data.order) : 0,
    },
  });

  revalidatePath("/admin/guru");
  revalidatePath("/guru");
  return { success: true };
}

export async function deleteTeacher(id: string) {
  await prisma.teacher.delete({ where: { id } });
  revalidatePath("/admin/guru");
  revalidatePath("/guru");
  return { success: true };
}
