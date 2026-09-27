"use client";

import { useEffect, useRef, useState } from "react";

function Counter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, isVisible]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400">
      {count}{suffix}
    </div>
  );
}

export function Statistik() {
  const stats = [
    { label: "Santri Aktif", value: 25, suffix: "+" },
    { label: "Guru & Ustadz", value: 5, suffix: "+" },
    { label: "Tahun Berdiri", value: 2019, suffix: "" },
    { label: "Alumni", value: 1759, suffix: "+" },
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group relative bg-white dark:bg-slate-900 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden text-center"
            >
              <Counter end={stat.value} suffix={stat.suffix} />
              <div className="mt-2 text-sm md:text-base font-medium text-slate-600 dark:text-slate-400">
                {stat.label}
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
