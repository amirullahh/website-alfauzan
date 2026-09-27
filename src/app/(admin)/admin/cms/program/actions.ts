"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const programSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  order: z.string().optional(),
});

export async function createProgram(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = programSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.program.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      order: parsed.data.order ? parseInt(parsed.data.order) : 0,
    },
  });

  revalidatePath("/admin/program");
  revalidatePath("/program");
  return { success: true };
}

export async function updateProgram(id: string, formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = programSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.program.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      order: parsed.data.order ? parseInt(parsed.data.order) : 0,
    },
  });

  revalidatePath("/admin/program");
  revalidatePath("/program");
  return { success: true };
}

export async function deleteProgram(id: string) {
  await prisma.program.delete({ where: { id } });
  revalidatePath("/admin/program");
  revalidatePath("/program");
  return { success: true };
}
