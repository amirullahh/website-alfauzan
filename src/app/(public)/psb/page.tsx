import { Separator } from "@/components/ui/separator";
import { PsbForm } from "@/components/website/sections/psb-form";
import { CheckCircle, FileText, Calendar, ClipboardList, MapPin, Phone, Mail } from "lucide-react";

const requirements = [
  "Mengisi formulir pendaftaran secara online atau di tempat",
  "Fotokopi akta kelahiran dan kartu keluarga",
  "Fotokopi raport 2 semester terakhir (dilegalisir)",
  "Surat keterangan sehat dari dokter setempat",
  "Pas foto 3x4 berwarna (4 lembar)",
  "Lulus seleksi wawancara dan tes baca tulis Al-Qur'an",
];

const schedule = [
  { phase: "Pendaftaran Gelombang 1", date: "1 Mei - 30 Juni 2026" },
  { phase: "Tes Masuk Calon Santri", date: "5 - 10 Juli 2026" },
  { phase: "Pengumuman Kelulusan", date: "15 Juli 2026" },
  { phase: "Daftar Ulang & Administrasi", date: "20 - 25 Juli 2026" },
  { phase: "Masa Ta'aruf (Orientasi)", date: "1 - 7 Agustus 2026" },
  { phase: "Awal Kegiatan Belajar", date: "10 Agustus 2026" },
];

export default function PsbPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
      {/* Hero Section */}
      <div className="relative bg-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-emerald-900/80 to-transparent"></div>
        </div>
        <div className="container relative mx-auto px-4 py-20 md:py-28 text-center" data-aos="fade-down">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-800 border border-emerald-700 text-emerald-100 text-sm font-semibold mb-5 uppercase tracking-wider">
            Tahun Ajaran 2026/2027
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Penerimaan Santri Baru
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto">
            Mari bergabung bersama kami membentuk generasi Qur&apos;ani yang cerdas secara intelektual dan berakhlakul karimah.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-12 max-w-7xl mx-auto">
          
          {/* Left Column: Info & Requirements */}
          <div className="lg:col-span-5 space-y-8" data-aos="fade-right">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-slate-800 dark:text-white">
                  Alur Pendaftaran
                </h2>
              </div>
              <div className="space-y-6">
                {schedule.map((item, index) => (
                  <div key={item.phase} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                        {index + 1}
                      </div>
                      {index !== schedule.length - 1 && (
                        <div className="w-0.5 h-full bg-emerald-100 dark:bg-emerald-900/50 my-2"></div>
                      )}
                    </div>
                    <div className="pb-4">
                      <h3 className="font-bold text-slate-800 dark:text-slate-200">{item.phase}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-500">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-slate-800 dark:text-white">
                  Persyaratan
                </h2>
              </div>
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7" data-aos="fade-left">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100 dark:border-slate-800 sticky top-28">
              <div className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                <h2 className="font-heading text-3xl font-bold text-slate-800 dark:text-white mb-2">
                  Formulir Pendaftaran
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Silakan lengkapi data calon santri di bawah ini. Tim kami akan segera menghubungi Anda untuk tahap selanjutnya.
                </p>
              </div>
              
              <div className="psb-form-container">
                <PsbForm />
              </div>
            </div>
          </div>
        </div>

        {/* Location & Map */}
        <div className="mt-20 max-w-7xl mx-auto" data-aos="fade-up">
          <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row">
            <div className="md:w-1/3 p-8 md:p-10 bg-emerald-900 text-white flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-6">Kontak & Lokasi</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-emerald-300 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-emerald-100 mb-1">Alamat Pesantren</h3>
                    <p className="text-sm text-emerald-50/80 leading-relaxed">Jl. Raya Pondok Pesantren Al-Fauzan Nusantara, Jakarta, Indonesia</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-emerald-300 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-emerald-100 mb-1">Telepon / WhatsApp</h3>
                    <p className="text-sm text-emerald-50/80 leading-relaxed">0857-7202-0667</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-emerald-300 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-emerald-100 mb-1">Email</h3>
                    <p className="text-sm text-emerald-50/80 leading-relaxed">info@alfauzan-nusantara.sch.id</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-2/3 min-h-[400px] relative">
              <iframe 
                src="https://maps.google.com/maps?q=Pondok%20Pesantren%20Al-Fauzan%20Nusantara&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: '400px' }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
