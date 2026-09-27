import { Navbar } from "@/components/website/layout/navbar";
import { TopBar } from "@/components/website/layout/top-bar";
import { Footer } from "@/components/website/layout/footer";
import { FloatingWA } from "@/components/website/floating-wa";

import { AosProvider } from "@/components/AosProvider";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col relative">
      <TopBar />
      <Navbar />
      <AosProvider>
        <main className="flex-1">{children}</main>
      </AosProvider>
      <Footer />
      <FloatingWA />
    </div>
  );
}
