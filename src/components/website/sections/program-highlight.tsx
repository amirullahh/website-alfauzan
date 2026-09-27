import Link from "next/link";
import * as Icons from "lucide-react";

interface Program {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export function ProgramHighlight({ programs }: { programs: Program[] }) {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-down">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Program Unggulan</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Kami menawarkan berbagai program pendidikan komprehensif untuk mencetak generasi yang cerdas dan berakhlakul karimah.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, i) => {
            // @ts-ignore
            const Icon = Icons[program.icon] || Icons.BookOpen;
            
            return (
              <div key={program.id} data-aos="fade-up" data-aos-delay={i * 100} className="group relative rounded-2xl p-6 bg-gradient-to-br from-emerald-600 to-emerald-700 overflow-hidden text-white shadow-lg hover:shadow-emerald-500/30 transition-shadow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-150"></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/10 ring-1 ring-white/30 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{program.name}</h3>
                  <p className="text-emerald-50 text-sm leading-relaxed mb-6 line-clamp-3">
                    {program.description}
                  </p>
                  <Link
                    href={`/program/${program.slug}`}
                    className="inline-flex items-center text-sm font-medium text-white hover:text-emerald-200 transition-colors"
                  >
                    Pelajari lebih lanjut <Icons.ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/program"
            className="inline-flex items-center justify-center font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            Lihat Semua Program &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
