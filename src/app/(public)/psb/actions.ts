"use server";

import { z } from "zod";

const psbSchema = z.object({
  studentName: z.string().min(1, "Nama calon santri wajib diisi"),
  studentDob: z.string().optional(),
  parentName: z.string().min(1, "Nama wali wajib diisi"),
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export type PsbFormState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

export async function submitPsb(
  prevState: PsbFormState,
  formData: FormData
): Promise<PsbFormState> {
  const rawData = {
    studentName: formData.get("studentName") as string,
    studentDob: formData.get("studentDob") as string,
    parentName: formData.get("parentName") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    address: formData.get("address") as string,
    notes: formData.get("notes") as string,
  };

  const validated = psbSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Validasi gagal. Periksa kembali data yang diisi.",
    };
  }

  // Fase 1: Log to console instead of saving to database
  // Will be connected to Prisma in Fase 2
  console.log("[PSB Submission]", validated.data);

  return {
    success: true,
    message: "Pendaftaran berhasil dikirim. Tim kami akan menghubungi Anda.",
  };
}
