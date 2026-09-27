import Link from "next/link";
import { dummyNews } from "@/lib/dummy-data";
import { ArrowRight, Calendar } from "lucide-react";

export default function BeritaPage() {
  const news = dummyNews;

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16" data-aos="fade-down">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Berita & Informasi
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Update terkini seputar kegiatan, prestasi, dan informasi penting Pondok Pesantren Al-Fauzan Nusantara.
          </p>
          <div className="mx-auto mt-6 w-20 h-1.5 bg-emerald-500 rounded-full" />
        </div>

        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item, index) => (
            <div 
              key={item.id} 
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-emerald-800/60 shadow-sm hover:shadow-xl dark:shadow-[0_0_15px_rgba(16,185,129,0.05)] dark:hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
            >
              <div className="aspect-[16/10] w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-900/10 dark:bg-emerald-500/20 mix-blend-overlay group-hover:bg-transparent transition-colors z-10"></div>
                <span className="text-sm font-medium text-slate-400 dark:text-slate-500 z-0">
                  Foto: {item.title}
                </span>
              </div>
              <div className="p-8 flex-1 flex flex-col relative z-20">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-100 dark:border-emerald-800/50">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <Link
                  href={`/berita/${item.slug}`}
                  className="font-heading text-xl font-bold text-slate-800 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-2 mb-3"
                >
                  {item.title}
                </Link>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                  {item.excerpt || item.content.slice(0, 150) + "..."}
                </p>
                <Link
                  href={`/berita/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 group/link"
                >
                  Baca selengkapnya
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
