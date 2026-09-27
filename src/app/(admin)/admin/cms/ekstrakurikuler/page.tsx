import { prisma } from "@/lib/db";
import { EkskulClient } from "./client";

export default async function AdminEkskulPage() {
  const extracurriculars = await prisma.extracurricular.findMany({
    orderBy: { order: "asc" },
  });

  return <EkskulClient initialData={extracurriculars} />;
}
