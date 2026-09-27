import { prisma } from "@/lib/db";
import { FasilitasClient } from "./client";

export default async function AdminFasilitasPage() {
  const facilities = await prisma.facility.findMany({
    orderBy: { order: "asc" },
  });

  return <FasilitasClient initialData={facilities} />;
}
