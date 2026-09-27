import { prisma } from "@/lib/db";
import { FaqClient } from "./client";

export default async function AdminFaqPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: { order: "asc" },
  });

  return <FaqClient initialData={faqs} />;
}
