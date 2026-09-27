import type { Metadata, Viewport } from "next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import Script from "next/script";
import { plusJakarta, inter } from "@/lib/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pondok Pesantren Al-Fauzan Nusantara",
    template: "%s | PP Al-Fauzan Nusantara",
  },
  description: "Website resmi & sistem absensi Pondok Pesantren Al-Fauzan Nusantara — Membentuk Generasi Qur'ani Berakhlak Mulia",
  icons: {
    icon: "/logo_redesign.jpg",
    apple: "/logo_redesign.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface font-sans text-on-surface flex flex-col min-h-screen pt-safe pb-safe antialiased">
        <Script id="google-translate-script" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="beforeInteractive" />
        <Script id="google-translate-init" strategy="beforeInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({pageLanguage: 'id', autoDisplay: false}, 'google_translate_element');
            }
          `}
        </Script>
        <SessionProvider>
          <LanguageProvider>
            <ThemeProvider>
              <div id="google_translate_element"></div>
              {children}
            </ThemeProvider>
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
