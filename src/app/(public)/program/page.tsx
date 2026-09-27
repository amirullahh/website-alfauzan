import { dummyPrograms } from "@/lib/dummy-data";
import { BookOpen, GraduationCap, Languages, Globe, ScrollText, Wrench } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  GraduationCap,
  Languages,
  Globe,
  ScrollText,
  Wrench,
};

export default function ProgramPage() {
  const programs = dummyPrograms;

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16" data-aos="fade-down">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Program Pendidikan
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Berbagai program unggulan yang dirancang untuk membentuk santri berprestasi
          </p>
          <div className="mx-auto mt-6 w-20 h-1.5 bg-emerald-500 rounded-full" />
        </div>

        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, index) => {
            const Icon = iconMap[program.icon] || BookOpen;
            return (
              <div 
                key={program.id} 
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-emerald-800/60 shadow-sm hover:shadow-xl dark:shadow-[0_0_15px_rgba(16,185,129,0.08)] dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Glow accent inside card in dark mode */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-150"></div>
                
                <div className="relative z-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/50 mb-6 ring-1 ring-emerald-100 dark:ring-emerald-800">
                    <Icon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-slate-800 dark:text-white mb-3">
                    {program.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {program.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
