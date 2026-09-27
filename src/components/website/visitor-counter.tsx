"use client";

import { useEffect, useState } from "react";

export function VisitorCounter({ initialCount = 15739 }: { initialCount?: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    // Basic simulation of a visitor counter
    const stored = localStorage.getItem('visitor_count');
    if (stored) {
      setCount(Math.max(initialCount, parseInt(stored, 10) + 1));
    } else {
      setCount(initialCount + 1);
    }
  }, [initialCount]);

  useEffect(() => {
    localStorage.setItem('visitor_count', count.toString());
  }, [count]);

  const digits = count.toString().split('');

  return (
    <div className="flex flex-col items-center sm:items-end justify-center space-y-1">
      <p className="text-sm font-medium text-emerald-100/80 dark:text-slate-400">
        Website ini telah dikunjungi
      </p>
      <div className="flex gap-0.5">
        {digits.map((digit, i) => (
          <div 
            key={i} 
            className="w-7 h-9 sm:w-8 sm:h-10 bg-gradient-to-b from-[#198d1a] to-[#0d590e] rounded flex items-center justify-center shadow-sm border border-[#115b13] overflow-hidden relative"
          >
            {/* Top reflection for 3D effect */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 rounded-t"></div>
            
            <span 
              className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-400 drop-shadow-md z-10" 
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              {digit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
