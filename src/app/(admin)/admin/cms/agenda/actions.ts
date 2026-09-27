"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const agendaSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
  endDate: z.string().optional(),
});

export async function createAgenda(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = agendaSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.agenda.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      location: parsed.data.location || null,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
    },
  });

  revalidatePath("/admin/agenda");
  revalidatePath("/agenda");
  return { success: true };
}

export async function updateAgenda(id: string, formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = agendaSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.agenda.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      location: parsed.data.location || null,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
    },
  });

  revalidatePath("/admin/agenda");
  revalidatePath("/agenda");
  return { success: true };
}

export async function deleteAgenda(id: string) {
  await prisma.agenda.delete({ where: { id } });
  revalidatePath("/admin/agenda");
  revalidatePath("/agenda");
  return { success: true };
}
