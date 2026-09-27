import { prisma } from "@/lib/db";
import { GuruClient } from "./client";

export default async function AdminGuruPage() {
  const teachers = await prisma.teacher.findMany({
    orderBy: { order: "asc" },
  });

  return <GuruClient initialData={teachers} />;
}
