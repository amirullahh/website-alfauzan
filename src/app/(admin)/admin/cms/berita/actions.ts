"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const newsSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Konten wajib diisi"),
  isPublished: z.boolean().optional(),
});

export async function createNews(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = newsSchema.safeParse({
    ...data,
    isPublished: data.isPublished === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.news.create({
    data: {
      ...parsed.data,
      publishedAt: parsed.data.isPublished ? new Date() : null,
    },
  });

  revalidatePath("/admin/berita");
  revalidatePath("/berita");
  return { success: true };
}

export async function updateNews(id: string, formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = newsSchema.safeParse({
    ...data,
    isPublished: data.isPublished === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.news.findUnique({ where: { id } });

  await prisma.news.update({
    where: { id },
    data: {
      ...parsed.data,
      publishedAt: parsed.data.isPublished
        ? existing?.publishedAt || new Date()
        : null,
    },
  });

  revalidatePath("/admin/berita");
  revalidatePath("/berita");
  revalidatePath(`/berita/${parsed.data.slug}`);
  return { success: true };
}

export async function deleteNews(id: string) {
  await prisma.news.delete({ where: { id } });
  revalidatePath("/admin/berita");
  revalidatePath("/berita");
  return { success: true };
}
