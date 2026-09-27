import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Email atau NIS/NIP", type: "text" },
        password: { label: "Kata Sandi", type: "password" },
      },
      authorize: async () => {
        // Actual authorization logic is in auth.ts
        // This stub is needed for Edge runtime compatibility in middleware
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const pathname = nextUrl.pathname;
      
      // Public website pages are accessible without auth
      const isPublicWebsite = 
        pathname === '/' ||
        pathname.startsWith('/berita') ||
        pathname.startsWith('/agenda') ||
        pathname.startsWith('/galeri') ||
        pathname.startsWith('/guru') ||
        pathname.startsWith('/program') ||
        pathname.startsWith('/fasilitas') ||
        pathname.startsWith('/faq') ||
        pathname.startsWith('/psb') ||
        pathname.startsWith('/prestasi') ||
        pathname.startsWith('/profil') ||
        pathname.startsWith('/ekstrakurikuler');
      if (isPublicWebsite) return true;

      const isLoggedIn = !!auth;
      const isAuthPage =
        pathname.startsWith("/login") ||
        pathname.startsWith("/forgot-password");
      const isAdminLogin = pathname === "/admin/login";
      const isAdminRoute =
        pathname.startsWith("/admin") && !isAdminLogin;
      const isApiAuthRoute = pathname.startsWith("/api/auth");
      const isApiLoginRoute = pathname === "/api/login";

      if (isApiAuthRoute || isApiLoginRoute) return true;
      // Admin login page is public; the page itself redirects
      // authenticated pengurus to /admin/dashboard.
      if (isAdminLogin) return true;
      if (isAuthPage) {
        if (isLoggedIn) return false; // redirect authenticated users away
        return true;
      }
      // Role enforcement (PENGURUS vs Santri/Ustadz, Super Admin vs
      // Pengurus) happens server-side in layouts and pages, where the
      // full session is available. Middleware only enforces login here.
      if (!isLoggedIn) {
        if (isAdminRoute) {
          return Response.redirect(new URL("/admin/login", nextUrl));
        }
        return false; // redirect to /login
      }
      if (isAdminRoute) return true;
      return true;
    },
  },
};
