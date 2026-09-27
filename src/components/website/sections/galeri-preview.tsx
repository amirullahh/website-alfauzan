import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";

export function GaleriPreview() {
  const videoList = [
    { id: "rJ5y-bE9K5w", title: "Kegiatan Pondok Pesantren Al-Fauzan 1" },
    { id: "jWJMXcRUJmI", title: "Kegiatan Pondok Pesantren Al-Fauzan 2" },
    { id: "ojkXD-vw5xY", title: "Kegiatan Pondok Pesantren Al-Fauzan 3" },
    { id: "306La4JLTPs", title: "Kegiatan Pondok Pesantren Al-Fauzan 4" },
    { id: "sEeXz_EYf4Y", title: "Kegiatan Pondok Pesantren Al-Fauzan 5" },
    { id: "CWcM-aJQJ5Y", title: "Kegiatan Pondok Pesantren Al-Fauzan 6" },
    { id: "cpozuFVrI5g", title: "Kegiatan Pondok Pesantren Al-Fauzan 7" },
    { id: "O28ORaHEQXM", title: "Kegiatan Pondok Pesantren Al-Fauzan 8" },
    { id: "4S2_M-T1ock", title: "Kegiatan Pondok Pesantren Al-Fauzan 9" },
    { id: "d2NQ3uvf-wA", title: "Kegiatan Pondok Pesantren Al-Fauzan 10" },
    { id: "Z2dJjg_jzZY", title: "Kegiatan Pondok Pesantren Al-Fauzan 11" },
    { id: "s6PaLGSWAyQ", title: "Kegiatan Pondok Pesantren Al-Fauzan 12" },
  ];

  const videos = videoList.map((v) => ({
    id: v.id,
    title: v.title,
    channel: "Pondok Pesantren Al-Fauzan Nusantara",
    youtubeId: v.id,
    thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
  }));

  const photos = [
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511632765486-a01c80cb8704?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-900 text-white transition-colors">
      <div className="container mx-auto px-4 space-y-16">
        
        {/* Galeri Video */}
        <div>
          <div className="flex justify-between items-end mb-8" data-aos="fade-right">
            <h2 className="text-2xl md:text-3xl font-bold">Galeri Video</h2>
            <Link href="/galeri?tab=video" className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors">
              Lihat galeri <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((vid, i) => (
              <a
                key={vid.id}
                href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                data-aos="zoom-in"
                data-aos-delay={i * 100}
                className="group flex flex-col bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-500/50 transition-colors"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image 
                    src={vid.thumbnailUrl} 
                    alt={vid.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                  
                  {/* YouTube Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-10 bg-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-500 transition-colors shadow-lg">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                  
                  {/* Channel Info Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white p-0.5">
                      <div className="w-full h-full rounded-full bg-emerald-600 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">AF</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-tight drop-shadow-md line-clamp-1">{vid.title}</p>
                      <p className="text-xs text-white/90 drop-shadow-md">{vid.channel}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm md:text-base line-clamp-2">{vid.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Galeri Foto */}
        <div>
          <div className="flex justify-between items-end mb-8" data-aos="fade-right">
            <h2 className="text-2xl md:text-3xl font-bold">Galeri Foto</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            {photos.map((src, i) => (
              <a 
                key={i}
                href="https://www.instagram.com/alfantra.official"
                target="_blank"
                rel="noreferrer"
                data-aos="zoom-in"
                data-aos-delay={i * 100}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-700/50"
              >
                <Image 
                  src={src}
                  alt={`Galeri foto ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                    Lihat di Instagram
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8" data-aos="fade-up">
            <Link href="/galeri?tab=foto" className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors">
              Lihat galeri <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
