import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import {
  clearLoginFailures,
  isLoginBlocked,
  normalizeLoginKey,
  recordLoginFailure,
} from "@/lib/login-rate-limit";
import { encode } from "next-auth/jwt";

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/NIS/NIP dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const loginKey = normalizeLoginKey(identifier);

    if (isLoginBlocked(loginKey)) {
      return NextResponse.json(
        { error: "Terlalu banyak percobaan. Coba lagi nanti." },
        { status: 429 }
      );
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
      return NextResponse.json(
        { error: "Email/NIS/NIP atau kata sandi salah." },
        { status: 401 }
      );
    }

    if (user.statusAkun !== "AKTIF") {
      recordLoginFailure(loginKey);
      return NextResponse.json(
        { error: "Akun tidak aktif. Hubungi admin." },
        { status: 403 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      recordLoginFailure(loginKey);
      return NextResponse.json(
        { error: "Email/NIS/NIP atau kata sandi salah." },
        { status: 401 }
      );
    }

    clearLoginFailures(loginKey);

    // Determine the session cookie name based on next-auth v5 conventions
    const useSecureCookie = process.env.AUTH_URL?.startsWith("https://");
    const cookieName = useSecureCookie
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

    // Create JWT token manually using next-auth's encode
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
      maxAge: 24 * 60 * 60, // 1 day
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessLevel: user.accessLevel,
        jabatan: user.jabatan,
        photoUrl: user.photoUrl,
        nis: user.nis,
        nip: user.nip,
      },
    });

    response.cookies.set(cookieName, token, {
      httpOnly: true,
      secure: !!useSecureCookie,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 1 day
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
