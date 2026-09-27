import { dummyAchievements } from "@/lib/dummy-data";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const levelColors: Record<string, string> = {
  Sekolah: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/50",
  Kota: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50",
  Provinsi: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800/50",
  Nasional: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/50",
  Internasional: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/50",
};

const categoryColors: Record<string, string> = {
  Akademik: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50",
  "Non-Akademik": "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800/50",
};

export default function PrestasiPage() {
  const achievements = [...dummyAchievements].sort((a, b) => b.year - a.year);

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16" data-aos="fade-down">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Prestasi Santri
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Berbagai pencapaian gemilang yang diraih oleh santri Pondok Pesantren Al-Fauzan Nusantara di berbagai tingkat.
          </p>
          <div className="mx-auto mt-6 w-20 h-1.5 bg-emerald-500 rounded-full" />
        </div>

        <div className="mx-auto max-w-4xl grid gap-6">
          {achievements.map((achievement, index) => (
            <div 
              key={achievement.id}
              data-aos="fade-up"
              data-aos-delay={index * 50}
              className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-emerald-800/60 shadow-sm hover:shadow-xl dark:shadow-[0_0_15px_rgba(16,185,129,0.05)] dark:hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-150"></div>
              
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/50 ring-1 ring-emerald-100 dark:ring-emerald-800 shrink-0">
                  <Trophy className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-xl font-bold text-slate-800 dark:text-white mb-2">
                    {achievement.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {achievement.category && (
                      <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", categoryColors[achievement.category] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300")}>
                        {achievement.category}
                      </span>
                    )}
                    {achievement.level && (
                      <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", levelColors[achievement.level] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300")}>
                        {achievement.level}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900">
                      Tahun {achievement.year}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
