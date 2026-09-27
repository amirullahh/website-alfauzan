"use client";

import { useState, useEffect } from "react";
import { dummyGallery } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Play, Image as ImageIcon, Video } from "lucide-react";
import { useSearchParams } from "next/navigation";

const youtubeVideos = [
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

import { Suspense } from "react";

function GaleriContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") === "video" ? "video" : "foto";
  const [activeTab, setActiveTab] = useState<"foto" | "video">(defaultTab);
  
  const gallery = dummyGallery;
  const albums = Array.from(new Set(gallery.map((item) => item.album).filter(Boolean)));
  const [activeAlbum, setActiveAlbum] = useState<string>("Semua");

  const filteredPhotos = activeAlbum === "Semua" ? gallery : gallery.filter(g => g.album === activeAlbum);

  // Fallback images if dummy data doesn't have valid URLs
  const defaultPhotos = [
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511632765486-a01c80cb8704?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
  ];

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-12" data-aos="fade-down">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Galeri
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Dokumentasi kegiatan, fasilitas, dan momen berkesan di Pondok Pesantren Al-Fauzan Nusantara.
          </p>
          <div className="mx-auto mt-6 w-20 h-1.5 bg-emerald-500 rounded-full" />
        </div>

        {/* Main Tabs (Foto / Video) */}
        <div className="flex justify-center gap-4 mb-12" data-aos="fade-up">
          <button
            onClick={() => setActiveTab("foto")}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 border-2",
              activeTab === "foto" 
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20" 
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700"
            )}
          >
            <ImageIcon className="w-5 h-5" /> Foto Instagram
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 border-2",
              activeTab === "video" 
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20" 
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700"
            )}
          >
            <Video className="w-5 h-5" /> Video YouTube
          </button>
        </div>

        {activeTab === "foto" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Album tabs for photos */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {["Semua", ...albums].map((album) => (
                <button
                  key={album}
                  onClick={() => setActiveAlbum(album)}
                  className={cn(
                    "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all border",
                    activeAlbum === album
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                      : "border-slate-200 dark:border-slate-800 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                  )}
                >
                  {album}
                </button>
              ))}
            </div>

            <div className="mx-auto max-w-6xl grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPhotos.map((item, i) => (
                <div
                  key={item.id}
                  data-aos="zoom-in"
                  data-aos-delay={(i % 6) * 100}
                  className="group relative aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer shadow-sm hover:shadow-xl dark:shadow-[0_0_15px_rgba(16,185,129,0.05)] dark:hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] transition-all duration-300"
                >
                  <Image 
                    src={defaultPhotos[i % defaultPhotos.length]} 
                    alt={item.caption || "Galeri"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <p className="text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">{item.album}</p>
                    <p className="text-lg text-white font-bold leading-tight">{item.caption || "Dokumentasi"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mx-auto max-w-6xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {youtubeVideos.map((vid, i) => (
                <a
                  key={vid.id}
                  href={`https://www.youtube.com/watch?v=${vid.id}`}
                  target="_blank"
                  rel="noreferrer"
                  data-aos="fade-up"
                  data-aos-delay={(i % 6) * 100}
                  className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img 
                      src={`https://i.ytimg.com/vi/${vid.id}/hqdefault.jpg`} 
                      alt={vid.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-10 bg-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-500 transition-colors shadow-lg">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-heading font-bold text-slate-800 dark:text-white leading-snug line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {vid.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-auto pt-4">Pondok Pesantren Al-Fauzan Nusantara</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GaleriPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-24 text-center">Loading...</div>}>
      <GaleriContent />
    </Suspense>
  );
}
