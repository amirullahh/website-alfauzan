import { Separator } from "@/components/ui/separator";

const milestones = [
  { year: 2019, title: "Berdirinya Pondok", description: "Pondok Pesantren Al-Fauzan Nusantara didirikan oleh KH. Khasanuri M.A." },
  { year: 2021, title: "Pembangunan Masjid", description: "Masjid Agung Al-Fauzan selesai dibangun sebagai pusat kegiatan keagamaan santri." },
  { year: 2023, title: "Akreditasi Sekolah", description: "Pendidikan formal memperoleh akreditasi dari Badan Akreditasi Nasional." },
  { year: 2024, title: "Program Tahfidz Intensif", description: "Diluncurkannya program tahfidz intensif dengan bimbingan ustadz berpengalaman." },
  { year: 2025, title: "Asrama Baru", description: "Pembangunan gedung asrama baru untuk meningkatkan kenyamanan santri." },
  { year: 2026, title: "Wisuda Tahfidz", description: "Mencetak puluhan santri yang berhasil menyelesaikan hafalan Al-Qur'an." },
];

export default function SejarahPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl" data-aos="fade-down">
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Sejarah Pondok
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Perjalanan Pondok Pesantren Al-Fauzan Nusantara dari masa ke masa
            </p>
            <div className="mx-auto mt-6 w-20 h-1.5 bg-emerald-500 rounded-full" />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 mb-16 shadow-xl border border-slate-100 dark:border-emerald-800/60" data-aos="zoom-in">
            <div className="space-y-6 text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
              <p>
                Pondok Pesantren Al-Fauzan Nusantara didirikan pada tahun 2019 oleh <strong>KH. Khasanuri M.A</strong> 
                dengan visi besar membentuk generasi Qur&apos;ani yang cerdas, berakhlak mulia, dan bermanfaat bagi masyarakat.
                Berawal dari sebuah majelis kecil, pondok ini perlahan tumbuh seiring dengan tingginya antusiasme masyarakat.
              </p>
              <p>
                Dalam perjalanannya, pondok terus berbenah dan berkembang. Masjid Agung selesai 
                dibangun sebagai sentral ibadah dan kajian. Gedung-gedung asrama serta fasilitas sekolah 
                turut dibangun untuk menunjang pendidikan formal (SD/SMP/SMA) maupun diniyah santri.
              </p>
              <p>
                Dengan tekad kuat, pendidikan formal di bawah naungan pondok berhasil meraih 
                akreditasi unggul. Program tahfidz intensif menjadi salah satu program primadona, 
                mencetak puluhan hafidz dan hafidzah yang siap menyebarkan syiar Islam di seluruh Nusantara.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div data-aos="fade-up">
            <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">
              Perjalanan Kami
            </h2>
            <div className="relative border-l-2 border-emerald-500/30 ml-4 md:ml-12 space-y-12">
              {milestones.map((m, index) => (
                <div key={m.year} className="relative pl-8 md:pl-12" data-aos="fade-left" data-aos-delay={index * 100}>
                  <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-950 shadow-sm" />
                  
                  <div className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-emerald-800/60 shadow-sm hover:shadow-xl dark:shadow-[0_0_15px_rgba(16,185,129,0.05)] dark:hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-150"></div>
                    
                    <div className="relative z-10">
                      <div className="inline-block px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold rounded-lg mb-3 border border-emerald-200 dark:border-emerald-800/50 text-sm">
                        Tahun {m.year}
                      </div>
                      <h3 className="font-heading text-xl font-bold text-slate-800 dark:text-white mb-2">{m.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{m.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
