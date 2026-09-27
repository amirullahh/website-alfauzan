"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export function AosProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true, // whether animation should happen only once - while scrolling down
      offset: 100, // offset (in px) from the original trigger point
      easing: "ease-out-cubic",
    });
  }, []);

  return <>{children}</>;
}
