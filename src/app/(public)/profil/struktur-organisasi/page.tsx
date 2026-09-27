import { Separator } from "@/components/ui/separator";

const orgStructure = [
  {
    level: 1,
    title: "Pimpinan Pondok",
    name: "KH. Khasanuri M.A",
    role: "Pimpinan Utama",
  },
  {
    level: 2,
    title: "Wakil Pimpinan",
    name: "Ustadz Hafiz Rahman",
    role: "Wakil Pimpinan",
  },
  {
    level: 3,
    title: "Kepala Bidang Pendidikan",
    name: "Ustadzah Aminah S.Pd",
    role: "Koordinator Kurikulum",
  },
  {
    level: 3,
    title: "Kepala Bidang Kesantrian",
    name: "Ustadz Budi Santoso",
    role: "Koordinator Asrama",
  },
  {
    level: 3,
    title: "Kepala Bidang Sarana",
    name: "Ustadz Dedi Kurniawan",
    role: "Koordinator Fasilitas",
  },
  {
    level: 3,
    title: "Bendahara",
    name: "Ustadzah Fitriani S.Pd",
    role: "Pengelola Keuangan",
  },
  {
    level: 3,
    title: "Sekretaris",
    name: "Ustadz Imam Syafii",
    role: "Administrasi & Dokumentasi",
  },
];

export default function StrukturOrganisasiPage() {
  const pimpinan = orgStructure.filter((o) => o.level === 1);
  const wakil = orgStructure.filter((o) => o.level === 2);
  const staff = orgStructure.filter((o) => o.level === 3);

  const getInitials = (name: string) => {
    const parts = name.replace(/KH\.|M\.A|S\.Pd/g, '').trim().split(" ");
    return parts.slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl" data-aos="fade-down">
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Struktur Organisasi
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Jajaran pengurus dan manajemen Pondok Pesantren Al-Fauzan Nusantara
            </p>
            <div className="mx-auto mt-6 w-20 h-1.5 bg-emerald-500 rounded-full" />
          </div>

          <div className="space-y-8 relative">
            {/* Level 1: Pimpinan */}
            <div className="flex justify-center" data-aos="zoom-in">
              {pimpinan.map((p) => (
                <div key={p.title} className="w-full max-w-md relative group bg-white dark:bg-slate-900 rounded-3xl p-8 border border-emerald-200 dark:border-emerald-700/50 shadow-lg dark:shadow-[0_0_20px_rgba(16,185,129,0.15)] text-center overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-4 ring-4 ring-emerald-50 dark:ring-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-2xl shadow-inner">
                      {getInitials(p.name)}
                    </div>
                    <h3 className="font-heading text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">{p.title}</h3>
                    <p className="font-heading text-2xl font-bold text-slate-800 dark:text-white mb-1">{p.name}</p>
                    <p className="text-slate-500 dark:text-slate-400">{p.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Connector */}
            <div className="flex justify-center" data-aos="fade-in">
              <div className="h-10 w-0.5 bg-emerald-200 dark:bg-emerald-800/50" />
            </div>

            {/* Level 2: Wakil */}
            <div className="flex justify-center" data-aos="zoom-in" data-aos-delay="100">
              {wakil.map((p) => (
                <div key={p.title} className="w-full max-w-sm relative group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md text-center overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-600 dark:text-slate-300 font-bold text-xl">
                      {getInitials(p.name)}
                    </div>
                    <h3 className="font-heading text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{p.title}</h3>
                    <p className="font-heading text-xl font-bold text-slate-800 dark:text-white mb-1">{p.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{p.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Connector */}
            <div className="flex justify-center" data-aos="fade-in">
              <div className="h-10 w-0.5 bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* Level 3: Staff */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-4 border-t-2 border-slate-100 dark:border-slate-800 relative">
              {/* Top connectors for the grid items */}
              <div className="absolute -top-[2px] left-1/4 right-1/4 h-[2px] bg-slate-100 dark:bg-slate-800 hidden sm:block"></div>
              
              {staff.map((p, i) => (
                <div key={p.title} data-aos="fade-up" data-aos-delay={i * 50} className="relative group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm text-center hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-3 text-slate-500 dark:text-slate-400 font-bold text-sm">
                      {getInitials(p.name)}
                    </div>
                    <h3 className="font-heading text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider mb-1.5">{p.title}</h3>
                    <p className="font-heading text-base font-bold text-slate-800 dark:text-white mb-1">{p.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{p.role}</p>
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
