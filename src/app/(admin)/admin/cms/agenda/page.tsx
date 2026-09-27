import { prisma } from "@/lib/db";
import { AgendaClient } from "./client";

export default async function AdminAgendaPage() {
  const agenda = await prisma.agenda.findMany({
    orderBy: { startDate: "desc" },
  });

  return <AgendaClient initialData={agenda} />;
}
