import { NextResponse } from "next/server";
import { auth } from "./auth";

export interface ApiAdminUser {
  id: string;
  role: string;
  accessLevel: string | null;
}

type GuardResult =
  | { ok: true; user: ApiAdminUser }
  | { ok: false; response: NextResponse };

/**
 * Server-side guard for admin API routes. Returns the session user when the
 * caller is an authenticated PENGURUS, otherwise a 401/403 response.
 * When `superOnly` is true, only SUPER_ADMIN passes (PRD §11.2).
 */
export async function guardAdminApi(superOnly = false): Promise<GuardResult> {
  const session = await auth();
  const user = session?.user as unknown as ApiAdminUser | undefined;

  if (!user?.id) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 }),
    };
  }
  if (user.role !== "PENGURUS") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Akses ditolak. Khusus pengurus." }, { status: 403 }),
    };
  }
  if (superOnly && user.accessLevel !== "SUPER_ADMIN") {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Akses ditolak. Khusus Super Admin." },
        { status: 403 }
      ),
    };
  }
  return { ok: true, user };
}
