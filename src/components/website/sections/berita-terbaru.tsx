import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  image?: string;
}

export function BeritaTerbaru({ news }: { news: NewsItem[] }) {
  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4" data-aos="fade-down">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Berita & Artikel</h2>
            <p className="text-slate-600 dark:text-slate-400">Kabar terbaru dari Pondok Pesantren Al-Fauzan Nusantara</p>
          </div>
          <Link
            href="/berita"
            className="inline-flex items-center font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, i) => (
            <Link key={item.id} data-aos="fade-up" data-aos-delay={i * 100} href={`/berita/${item.slug}`} className="group flex flex-col bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="aspect-[16/9] w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-slate-200 dark:from-emerald-900/40 dark:to-slate-800 transition-transform duration-500 group-hover:scale-105"></div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  {item.date}
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mt-auto">
                  {item.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
