import Link from "next/link";
import { BookOpen, GraduationCap, Users, Images, Trophy, ClipboardList } from "lucide-react";

export function QuickNav() {
  const links = [
    { name: "Program Tahfidz", href: "/program", icon: BookOpen },
    { name: "Pendidikan Formal", href: "/program", icon: GraduationCap },
    { name: "Guru & Ustadz", href: "/guru", icon: Users },
    { name: "Galeri", href: "/galeri", icon: Images },
    { name: "Prestasi", href: "/prestasi", icon: Trophy },
    { name: "PSB", href: "/psb", icon: ClipboardList },
  ];

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Navigasi</h2>
          <p className="text-slate-600 dark:text-slate-400">Akses Fitur Website Lebih Cepat</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="group flex flex-col items-center justify-center p-6 rounded-xl ring-1 ring-emerald-400/30 bg-white/60 dark:bg-slate-900/50 backdrop-blur-md shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
