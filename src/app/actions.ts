"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import {
  clearLoginFailures,
  isLoginBlocked,
  normalizeLoginKey,
  recordLoginFailure,
} from "@/lib/login-rate-limit";
import { encode } from "next-auth/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const identifier = formData.get("identifier") as string;
  const password = formData.get("password") as string;
  const redirectUrl = formData.get("redirectUrl") as string || "/home";

  if (!identifier || !password) {
    return { error: "Email/NIS/NIP dan kata sandi wajib diisi." };
  }

  const loginKey = normalizeLoginKey(identifier);

  if (isLoginBlocked(loginKey)) {
    return { error: "Terlalu banyak percobaan. Coba lagi nanti." };
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { nis: identifier },
        { nip: identifier },
      ],
    },
  });

  if (!user) {
    recordLoginFailure(loginKey);
    return { error: "Email/NIS/NIP atau kata sandi salah." };
  }

  if (user.statusAkun !== "AKTIF") {
    recordLoginFailure(loginKey);
    return { error: "Akun tidak aktif. Hubungi admin." };
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    recordLoginFailure(loginKey);
    return { error: "Email/NIS/NIP atau kata sandi salah." };
  }

  clearLoginFailures(loginKey);

  const useSecureCookie = process.env.AUTH_URL?.startsWith("https://");
  const cookieName = useSecureCookie
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const secret = process.env.AUTH_SECRET!;
  const token = await encode({
    token: {
      sub: user.id,
      name: user.name,
      email: user.email,
      id: user.id,
      role: user.role,
      accessLevel: user.accessLevel,
      jabatan: user.jabatan,
      photoUrl: user.photoUrl,
      nis: user.nis,
      nip: user.nip,
    },
    secret,
    salt: cookieName,
    maxAge: 24 * 60 * 60,
  });

  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: !!useSecureCookie,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60,
  });

  if (user.role === "PENGURUS" && redirectUrl === "/home") {
    redirect("/admin/dashboard");
  } else {
    redirect(redirectUrl);
  }
}
