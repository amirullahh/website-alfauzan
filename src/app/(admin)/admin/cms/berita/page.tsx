import { prisma } from "@/lib/db";
import { BeritaClient } from "./client";

export default async function AdminBeritaPage() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <BeritaClient initialData={news} />;
}
