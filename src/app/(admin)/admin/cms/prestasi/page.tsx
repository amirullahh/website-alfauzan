import { prisma } from "@/lib/db";
import { PrestasiClient } from "./client";

export default async function AdminPrestasiPage() {
  const achievements = await prisma.achievement.findMany({
    orderBy: { year: "desc" },
  });

  return <PrestasiClient initialData={achievements} />;
}
