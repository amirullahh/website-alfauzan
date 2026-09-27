import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Hanya host storage resmi yang boleh di-load via next/image.
    // Foto profil user saat ini memakai <img> biasa sehingga tidak terdampak.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  async headers() {
    // Catatan: camera/geolocation dibuka untuk origin sendiri karena
    // check-in butuh GPS + kamera. HSTS diabaikan browser saat HTTP
    // (dev localhost) dan aktif saat HTTPS production.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://images.unsplash.com https://i.ytimg.com https://img.youtube.com",
      "connect-src 'self' https:",
      "frame-src 'self' https://maps.google.com https://www.google.com",
      "form-action 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
    ].join("; ");
    const securityHeaders = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(self), geolocation=(self), microphone=()",
      },
    ];
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
