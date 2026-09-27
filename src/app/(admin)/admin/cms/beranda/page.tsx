import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Newspaper,
  CalendarDays,
  Trophy,
  BookOpen,
  Building2,
  Users,
  GraduationCap,
  ImageIcon,
  HelpCircle,
  ClipboardList,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    newsCount,
    agendaCount,
    achievementCount,
    programCount,
    facilityCount,
    extracurricularCount,
    teacherCount,
    galleryCount,
    faqCount,
    psbCount,
  ] = await Promise.all([
    prisma.news.count(),
    prisma.agenda.count(),
    prisma.achievement.count(),
    prisma.program.count(),
    prisma.facility.count(),
    prisma.extracurricular.count(),
    prisma.teacher.count(),
    prisma.galleryItem.count(),
    prisma.faq.count(),
    prisma.psbSubmission.count(),
  ]);

  const recentPsb = await prisma.psbSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Berita", value: newsCount, icon: Newspaper, href: "/admin/berita" },
    { label: "Agenda", value: agendaCount, icon: CalendarDays, href: "/admin/agenda" },
    { label: "Prestasi", value: achievementCount, icon: Trophy, href: "/admin/prestasi" },
    { label: "Program", value: programCount, icon: BookOpen, href: "/admin/program" },
    { label: "Fasilitas", value: facilityCount, icon: Building2, href: "/admin/fasilitas" },
    { label: "Ekskul", value: extracurricularCount, icon: Users, href: "/admin/ekstrakurikuler" },
    { label: "Guru", value: teacherCount, icon: GraduationCap, href: "/admin/guru" },
    { label: "Galeri", value: galleryCount, icon: ImageIcon, href: "/admin/galeri" },
    { label: "FAQ", value: faqCount, icon: HelpCircle, href: "/admin/faq" },
    { label: "PSB", value: psbCount, icon: ClipboardList, href: "/admin/psb" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <a key={stat.label} href={stat.href}>
              <Card className="border-border hover:border-primary/30 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="font-heading text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-heading text-base">Pendaftaran Santri Baru Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {recentPsb.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada pendaftaran</p>
          ) : (
            <div className="divide-y divide-border">
              {recentPsb.map((psb) => (
                <div key={psb.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{psb.studentName}</p>
                    <p className="text-xs text-muted-foreground">
                      Wali: {psb.parentName} · {psb.phone}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(psb.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
