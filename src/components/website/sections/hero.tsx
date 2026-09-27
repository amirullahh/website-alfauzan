"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="w-full h-[60vh] md:h-[70vh]"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="relative w-full h-full flex items-center justify-center bg-[url('/content1.jpeg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Selamat Datang di Pondok Pesantren Al-Fauzan Nusantara
              </h1>
              <p className="text-lg md:text-xl text-emerald-50">
                Membentuk Generasi Qur&apos;ani Berakhlak Mulia
              </p>
              <div className="pt-4">
                <Link
                  href="/psb"
                  className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg hover:shadow-emerald-500/30"
                >
                  Daftar Sekarang
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="relative w-full h-full flex items-center justify-center bg-[url('/content1.jpeg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Program Tahfidz 30 Juz
              </h1>
              <p className="text-lg md:text-xl text-teal-50">
                Target 30 juz dalam 3-6 tahun dengan bimbingan intensif
              </p>
              <div className="pt-4">
                <Link
                  href="/program"
                  className="inline-block bg-[#D4A017] hover:bg-[#b08513] text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg"
                >
                  Lihat Program
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div className="relative w-full h-full flex items-center justify-center bg-[url('/content1.jpeg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Pendaftaran Santri Baru
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Tahun Ajaran 2025/2026 Dibuka!
              </p>
              <div className="pt-4">
                <Link
                  href="/psb"
                  className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg hover:shadow-emerald-500/30"
                >
                  Daftar Sekarang
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}
