import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { VisitorCounter } from "../visitor-counter";

export function Footer() {
  return (
    <footer className="bg-emerald-900 dark:bg-slate-950 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Image src="/logo_redesign.jpg" alt="Logo" width={48} height={48} className="rounded-full bg-white p-1" />
              <span className="font-bold text-xl text-white">Al-Fauzan Nusantara</span>
            </div>
            <p className="text-emerald-100/80 mb-6 leading-relaxed">
              Membentuk Generasi Qur&apos;ani Berakhlak Mulia. Mendidik santri untuk berprestasi di dunia dan beramal untuk akhirat.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Link Cepat
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-amber-500 rounded-full"></span>
            </h3>
            <ul className="flex flex-col gap-3">
              {["Beranda", "Program", "Berita", "Galeri", "Prestasi", "FAQ"].map((item) => (
                <li key={item}>
                  <Link href={item === "Beranda" ? "/" : `/${item.toLowerCase()}`} className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Kontak Kami
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-amber-500 rounded-full"></span>
            </h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                <span>Jl. Gintung, Tanjung Barat, Jagakarsa, Jakarta Selatan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <span>(021) 786-1234</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <span>0857-7202-0667 (WhatsApp)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                <span>info@alfauzan.sch.id</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Sosial Media
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-amber-500 rounded-full"></span>
            </h3>
            <p className="mb-6">Ikuti kami di sosial media untuk mendapatkan informasi terbaru.</p>
            <div className="flex gap-4">
              <Link href="https://www.instagram.com/alfantra.official" target="_blank" className="w-10 h-10 rounded-full bg-emerald-800 dark:bg-slate-900 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors" title="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </Link>
              <Link href="https://www.tiktok.com/@ppalfauzannusantara" target="_blank" className="w-10 h-10 rounded-full bg-emerald-800 dark:bg-slate-900 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors text-sm font-bold font-sans" title="TikTok">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </Link>
              <Link href="https://www.youtube.com/@alfantra.official?sub_confirmation=1" target="_blank" className="w-10 h-10 rounded-full bg-emerald-800 dark:bg-slate-900 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors" title="YouTube">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M2.5 7.1C2.5 7.1 2.5 5 4.5 4c2-.9 8-.9 8-.9s6 0 8 .9c2 1 2 3.1 2 3.1s0 2.5 0 4.9c0 2.4 0 4.9 0 4.9s0 2.1-2 3.1c-2 .9-8 .9-8 .9s-6 0-8-.9c-2-1-2-3.1-2-3.1s0-2.5 0-4.9c0-2.4 0-4.9 0-4.9z"/><path d="M10 15l6-3-6-3z"/></svg>
              </Link>
              <Link href="https://www.threads.net/@alfantra.official" target="_blank" className="w-10 h-10 rounded-full bg-emerald-800 dark:bg-slate-900 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors" title="Threads">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22.09 11c0 5.52-4.52 10-10.09 10S2 16.52 2 11s4.48-10 10-10a10 10 0 0 1 10 10z"/><path d="M16 11c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z"/><path d="M16 11v3.5c0 1.9-1.6 3.5-3.5 3.5a3.5 3.5 0 0 1-3.5-3.5V11"/></svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-800 dark:border-slate-800 pt-8 mt-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Pondok Pesantren Al-Fauzan Nusantara. Hak cipta dilindungi.</p>
          <VisitorCounter />
        </div>
      </div>
    </footer>
  );
}
