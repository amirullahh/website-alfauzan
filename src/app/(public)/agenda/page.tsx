import { dummyAgenda } from "@/lib/dummy-data";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

export default function AgendaPage() {
  const agenda = dummyAgenda.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl text-center mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Agenda
        </h1>
        <p className="mt-3 text-muted-foreground">
          Jadwal kegiatan dan acara yang akan datang di pondok
        </p>
        <Separator className="mx-auto mt-4 w-16 bg-primary" />
      </div>

      <div className="mx-auto max-w-3xl space-y-4">
        {agenda.map((item) => {
          const startDate = new Date(item.startDate);
          startDate.setHours(0, 0, 0, 0);
          const endDate = item.endDate ? new Date(item.endDate) : null;
          const isUpcoming = startDate >= today;
          const isPast = endDate ? endDate < today : startDate < today;

          return (
            <Card key={item.id} className="border-border">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex flex-col items-center justify-center rounded-lg bg-primary/5 border border-primary/10 p-3 min-w-[80px]">
                    <span className="text-xs font-medium text-primary uppercase">
                      {startDate.toLocaleDateString("id-ID", { month: "short" })}
                    </span>
                    <span className="font-heading text-2xl font-bold text-primary">
                      {startDate.getDate()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {startDate.getFullYear()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {isUpcoming && (
                        <Badge className="bg-primary text-primary-foreground text-xs">Mendatang</Badge>
                      )}
                      {isPast && (
                        <Badge variant="secondary" className="text-xs">Selesai</Badge>
                      )}
                    </div>

                    <h3 className="font-heading text-base font-semibold text-foreground">
                      {item.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description || "-"}
                    </p>

                    <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{item.location || "-"}</span>
                    </div>

                    {endDate && endDate.toISOString().split("T")[0] !== startDate.toISOString().split("T")[0] && (
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          Sampai{" "}
                          {endDate.toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
