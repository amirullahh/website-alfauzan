import { dummyFacilities } from "@/lib/dummy-data";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export default function FasilitasPage() {
  const facilities = dummyFacilities;

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl text-center mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Fasilitas
        </h1>
        <p className="mt-3 text-muted-foreground">
          Fasilitas lengkap untuk menunjang kegiatan belajar dan pembinaan santri
        </p>
        <Separator className="mx-auto mt-4 w-16 bg-primary" />
      </div>

      <div className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {facilities.map((facility) => (
          <Card key={facility.id} className="overflow-hidden border-border">
            <div className="aspect-[4/3] w-full bg-muted border-b border-border flex items-center justify-center">
              <span className="text-xs text-muted-foreground px-4 text-center">
                Gambar: {facility.name}
              </span>
            </div>
            <CardContent className="p-5">
              <h3 className="font-heading text-base font-semibold text-foreground">
                {facility.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {facility.description || "-"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
