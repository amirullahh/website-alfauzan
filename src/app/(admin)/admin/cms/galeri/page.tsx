import { prisma } from "@/lib/db";
import { GaleriClient } from "./client";

export default async function AdminGaleriPage() {
  const gallery = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <GaleriClient initialData={gallery} />;
}
