import Link from "next/link";

export function Sambutan() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden dark:bg-slate-900 transition-colors">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-emerald-300/20 dark:bg-emerald-900/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A017]/10 dark:bg-[#D4A017]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto rounded-3xl p-8 md:p-12 ring-1 ring-emerald-100 dark:ring-emerald-900 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Photo */}
            <div className="shrink-0 relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-50 dark:opacity-30"></div>
              <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full bg-emerald-100 dark:bg-emerald-900/50 ring-4 ring-emerald-500 dark:ring-emerald-600 flex items-center justify-center overflow-hidden">
                <span className="text-5xl font-bold text-emerald-700 dark:text-emerald-400">KH</span>
              </div>
            </div>

            {/* Text */}
            <div className="text-center md:text-left space-y-4">
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">KH. Khasanuri M.A</h2>
                <p className="text-emerald-600 dark:text-emerald-400 font-medium">Pimpinan Pondok Pesantren</p>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>Assalamu&apos;alaikum Warahmatullahi Wabarakatuh,</p>
                <p>
                  Segala puji bagi Allah SWT Tuhan semesta alam. Selamat datang di website resmi Pondok Pesantren Al-Fauzan Nusantara. Kami berkomitmen untuk mencetak generasi Qur&apos;ani yang tidak hanya cerdas secara intelektual, namun juga berakhlak mulia dan berwawasan luas.
                </p>
                <p>
                  Melalui perpaduan kurikulum modern dan pesantren salaf, kami berharap dapat melahirkan kader-kader umat yang siap menghadapi tantangan zaman.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-4">
                <Link
                  href="/profil"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors"
                >
                  Selengkapnya
                </Link>
                <Link
                  href="/visi-misi"
                  className="ring-1 ring-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:ring-emerald-400 dark:hover:bg-emerald-950/30 px-6 py-2.5 rounded-full font-medium transition-colors"
                >
                  Visi & Misi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
