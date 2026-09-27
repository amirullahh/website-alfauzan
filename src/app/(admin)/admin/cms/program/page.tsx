import { prisma } from "@/lib/db";
import { ProgramClient } from "./client";

export default async function AdminProgramPage() {
  const programs = await prisma.program.findMany({
    orderBy: { order: "asc" },
  });

  return <ProgramClient initialData={programs} />;
}
