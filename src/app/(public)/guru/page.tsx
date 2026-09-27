import { dummyTeachers } from "@/lib/dummy-data";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function GuruPage() {
  const teachers = dummyTeachers;

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl text-center mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Guru & Tenaga Kependidikan
        </h1>
        <p className="mt-3 text-muted-foreground">
          Tim pengajar berpengalaman yang membimbing santri dengan penuh dedikasi
        </p>
        <Separator className="mx-auto mt-4 w-16 bg-primary" />
      </div>

      <div className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="border-border">
            <CardContent className="p-6 text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4 border-2 border-primary/10">
                <AvatarFallback className="bg-primary/5 text-primary font-heading font-bold text-lg">
                  {teacher.name
                    .split(" ")
                    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-heading text-base font-semibold text-foreground">
                {teacher.name}
              </h3>
              <p className="text-sm text-primary font-medium mt-1">{teacher.role || "-"}</p>
              {teacher.subject && (
                <p className="text-xs text-muted-foreground mt-1">
                  {teacher.subject}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
