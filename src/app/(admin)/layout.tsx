import { requirePengurus } from "@/lib/admin";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requirePengurus();

  return <AdminShell user={user}>{children}</AdminShell>;
}
