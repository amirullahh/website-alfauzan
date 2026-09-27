"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
});

export async function changePassword(email: string, formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = passwordSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: { currentPassword: ["User tidak ditemukan"] } };
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.password);
  if (!valid) {
    return { error: { currentPassword: ["Password saat ini salah"] } };
  }

  const newHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { password: newHash },
  });

  return { success: true };
}
