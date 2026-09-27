"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const gallerySchema = z.object({
  album: z.string().optional(),
  caption: z.string().optional(),
  imageUrl: z.string().min(1, "URL gambar wajib diisi"),
});

export async function createGalleryItem(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = gallerySchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.galleryItem.create({
    data: {
      album: parsed.data.album || null,
      caption: parsed.data.caption || null,
      imageUrl: parsed.data.imageUrl,
    },
  });

  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");
  return { success: true };
}

export async function updateGalleryItem(id: string, formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = gallerySchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.galleryItem.update({
    where: { id },
    data: {
      album: parsed.data.album || null,
      caption: parsed.data.caption || null,
      imageUrl: parsed.data.imageUrl,
    },
  });

  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");
  return { success: true };
}

export async function deleteGalleryItem(id: string) {
  await prisma.galleryItem.delete({ where: { id } });
  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");
  return { success: true };
}
