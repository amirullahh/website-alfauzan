import { Separator } from "@/components/ui/separator";
import { Heart, Mountain, HandHelping, Users, Lightbulb, Shield, Moon } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Keikhlasan",
    description: "Segala aktivitas dilakukan semata-mata karena Allah SWT, tanpa mengharapkan balasan duniawi.",
  },
  {
    icon: Mountain,
    title: "Kesederhanaan",
    description: "Hidup sederhana dalam pakaian, makanan, dan gaya hidup sebagai bentuk penghambaan kepada Allah.",
  },
  {
    icon: HandHelping,
    title: "Kemandirian",
    description: "Santri dibiasakan untuk mandiri dalam menjalani kehidupan sehari-hari dan tidak bergantung pada orang lain.",
  },
  {
    icon: Users,
    title: "Ukhuwah Islamiyah",
    description: "Membangun persaudaraan Islam yang kuat antar santri, guru, dan seluruh komponen pondok.",
  },
  {
    icon: Lightbulb,
    title: "Kebebasan Berfikir",
    description: "Santri didorong untuk berpikir kritis dan kreatif dalam mengkaji ilmu-ilmu keislaman.",
  },
  {
    icon: Shield,
    title: "Kedisiplinan",
    description: "Ketaatan terhadap aturan dan jadwal pondok sebagai fondasi pembentukan karakter kuat.",
  },
  {
    icon: Moon,
    title: "Ketaqwaan",
    description: "Menjadikan ketakwaan kepada Allah sebagai landasan utama dalam setiap aspek kehidupan.",
  },
];

export default function SaptaJiwaPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16" data-aos="fade-down">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Sapta Jiwa Pondok
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Tujuh nilai inti yang membentuk karakter dan jati diri setiap santri Al-Fauzan Nusantara
          </p>
          <div className="mx-auto mt-6 w-20 h-1.5 bg-emerald-500 rounded-full" />
        </div>

        <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-2">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div 
                key={value.title} 
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-emerald-800/60 shadow-sm hover:shadow-xl dark:shadow-[0_0_15px_rgba(16,185,129,0.05)] dark:hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex items-start gap-5"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-150"></div>
                
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/50 ring-1 ring-emerald-100 dark:ring-emerald-800 shrink-0 relative z-10">
                  <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-heading text-lg font-bold text-slate-800 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {value.description}
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
