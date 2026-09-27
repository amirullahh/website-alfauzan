import { redirect } from "next/navigation";
import { auth } from "./auth";

export interface AdminSessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
  accessLevel: string | null;
  jabatan: string | null;
  photoUrl: string | null;
}

export async function getAdminSession(): Promise<AdminSessionUser | null> {
  const session = await auth();
  if (!session?.user) return null;
  return session.user as AdminSessionUser;
}

/** Ensures the caller is logged in with the PENGURUS role. Redirects otherwise. */
export async function requirePengurus(): Promise<AdminSessionUser> {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  if (user.role !== "PENGURUS") redirect("/home");
  return user;
}

/** Ensures the caller is a Super Admin. Redirects otherwise. */
export async function requireSuperAdmin(): Promise<AdminSessionUser> {
  const user = await requirePengurus();
  if (user.accessLevel !== "SUPER_ADMIN") redirect("/admin/dashboard");
  return user;
}

export function isSuperAdmin(user: AdminSessionUser | null): boolean {
  return user?.accessLevel === "SUPER_ADMIN";
}
