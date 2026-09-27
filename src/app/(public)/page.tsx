import { Hero } from "@/components/website/sections/hero";
import { QuickNav } from "@/components/website/sections/quick-nav";
import { Sambutan } from "@/components/website/sections/sambutan";
import { Statistik } from "@/components/website/sections/statistik";
import { ProgramHighlight } from "@/components/website/sections/program-highlight";
import { BeritaTerbaru } from "@/components/website/sections/berita-terbaru";
import { CtaPsb } from "@/components/website/sections/cta-psb";
import { GaleriPreview } from "@/components/website/sections/galeri-preview";
import { dummyNews, dummyPrograms } from "@/lib/dummy-data";

export default function HomePage() {
  const latestNews = dummyNews.slice(0, 3);
  const programs = dummyPrograms.slice(0, 6);

  return (
    <>
      <Hero />
      <QuickNav />
      <ProgramHighlight programs={programs} />
      <Sambutan />
      <Statistik />
      <BeritaTerbaru news={latestNews} />
      <GaleriPreview />
      <CtaPsb />
    </>
  );
}
