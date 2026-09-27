import { Separator } from "@/components/ui/separator";
import { Target, BookOpen, Users, Heart, Globe, Award, Sun } from "lucide-react";

const missions = [
  {
    icon: BookOpen,
    title: "Pendidikan Qur'ani",
    description: "Menyelenggarakan pendidikan berbasis Al-Qur'an dengan program tahfidz intensif dan pemahaman tafsir yang mendalam.",
  },
  {
    icon: Users,
    title: "Pembinaan Akhlak",
    description: "Membentuk santri yang berakhlak mulia melalui pembiasaan adab Islami dalam kehidupan sehari-hari.",
  },
  {
    icon: Heart,
    title: "Kecintaan kepada Ulama",
    description: "Menanamkan rasa hormat dan cinta kepada para ulama serta semangat mengaji kitab kuning.",
  },
  {
    icon: Globe,
    title: "Penguasaan Bahasa",
    description: "Melatih santri menguasai bahasa Arab dan bahasa Inggris untuk mengakses ilmu secara global.",
  },
  {
    icon: Award,
    title: "Prestasi Akademik",
    description: "Mendorong santri meraih prestasi akademik dan non-akademik di tingkat kota hingga nasional.",
  },
  {
    icon: Sun,
    title: "Kemandirian",
    description: "Membekali santri dengan keterampilan life skills agar mampu mandiri dan bermanfaat bagi masyarakat.",
  },
];

export default function VisiMisiPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl" data-aos="fade-down">
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Visi & Misi
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Landasan spiritual dan komitmen kami dalam mendidik santri
            </p>
            <div className="mx-auto mt-6 w-20 h-1.5 bg-emerald-500 rounded-full" />
          </div>

          {/* Visi */}
          <div className="relative bg-emerald-900 rounded-3xl p-8 md:p-12 mb-16 overflow-hidden shadow-xl" data-aos="zoom-in">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-800/80 ring-1 ring-emerald-700 mb-6 shadow-inner">
                <Target className="h-8 w-8 text-emerald-300" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-emerald-50 mb-6">Visi Kami</h2>
              <p className="text-xl md:text-2xl text-emerald-100 font-medium leading-relaxed max-w-2xl">
                &ldquo;Menjadi lembaga pendidikan Islam yang unggul dalam membentuk generasi Qur&apos;ani, 
                berakhlak mulia, berilmu luas, dan bermanfaat bagi umat.&rdquo;
              </p>
            </div>
          </div>

          {/* Misi */}
          <div data-aos="fade-up">
            <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">
              Misi Kami
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {missions.map((misi, index) => {
                const Icon = misi.icon;
                return (
                  <div 
                    key={misi.title} 
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-emerald-800/60 shadow-sm hover:shadow-xl dark:shadow-[0_0_15px_rgba(16,185,129,0.05)] dark:hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex items-start gap-4"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-150"></div>
                    
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/50 ring-1 ring-emerald-100 dark:ring-emerald-800 shrink-0 relative z-10">
                      <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-heading text-lg font-bold text-slate-800 dark:text-white mb-2">
                        {misi.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {misi.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
