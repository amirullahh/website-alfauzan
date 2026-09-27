"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const faqSchema = z.object({
  question: z.string().min(1, "Pertanyaan wajib diisi"),
  answer: z.string().min(1, "Jawaban wajib diisi"),
  order: z.string().optional(),
});

export async function createFaq(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = faqSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.faq.create({
    data: {
      question: parsed.data.question,
      answer: parsed.data.answer,
      order: parsed.data.order ? parseInt(parsed.data.order) : 0,
    },
  });

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  return { success: true };
}

export async function updateFaq(id: string, formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = faqSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.faq.update({
    where: { id },
    data: {
      question: parsed.data.question,
      answer: parsed.data.answer,
      order: parsed.data.order ? parseInt(parsed.data.order) : 0,
    },
  });

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  return { success: true };
}

export async function deleteFaq(id: string) {
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  return { success: true };
}
