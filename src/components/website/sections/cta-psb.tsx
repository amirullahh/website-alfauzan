import Link from "next/link";

export function CtaPsb() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-emerald-600 to-[#005F26]">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4A017]/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Pendaftaran Santri Baru Dibuka!
          </h2>
          <p className="text-lg md:text-xl text-emerald-50">
            Bergabunglah dengan keluarga besar Pondok Pesantren Al-Fauzan Nusantara. Mari bersama mencetak generasi tangguh, cerdas, dan berakhlakul karimah.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/psb"
              className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-slate-50 font-semibold px-8 py-3.5 rounded-full transition-colors shadow-lg"
            >
              Daftar Sekarang
            </Link>
            <Link
              href="https://wa.me/6285772020667?text=Assalamualaikum%20Wr%20Wb.%20Setelah%20melihat%20website%20alfantra%2C%20saya%20mau%20tanya%20mengenai%20pendaftaran%20SD%2FSMP%2FSMA%20di%20Pondok%20Pesantren%20AL-Fauzan"
              target="_blank"
              className="w-full sm:w-auto ring-2 ring-white/70 text-white hover:bg-white/10 font-semibold px-8 py-3.5 rounded-full transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
