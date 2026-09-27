import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PsbClient } from "./client";

export default async function AdminPsbPage() {
  const submissions = await prisma.psbSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-heading text-base">Pendaftaran Santri Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <PsbClient initialData={submissions} />
        </CardContent>
      </Card>
    </div>
  );
}
