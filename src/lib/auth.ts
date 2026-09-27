import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { authConfig } from "@/auth.config";
import {
  clearLoginFailures,
  isLoginBlocked,
  normalizeLoginKey,
  recordLoginFailure,
} from "./login-rate-limit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Email atau NIS/NIP", type: "text" },
        password: { label: "Kata Sandi", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("authorize called with:", credentials?.identifier);
        if (!credentials?.identifier || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        const identifier = credentials.identifier as string;
        const loginKey = normalizeLoginKey(identifier);

        // Blokir brute-force dengan respons generik (tanpa user enumeration).
        if (isLoginBlocked(loginKey)) {
          console.log("Login blocked by rate limit:", loginKey);
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { nis: identifier },
              { nip: identifier },
            ],
          },
        });

        if (!user) {
          console.log("User not found:", identifier);
          recordLoginFailure(loginKey);
          return null;
        }

        if (user.statusAkun !== "AKTIF") {
          console.log("User not AKTIF:", user.statusAkun);
          recordLoginFailure(loginKey);
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          console.log("Invalid password for user:", identifier);
          recordLoginFailure(loginKey);
          return null;
        }

        clearLoginFailures(loginKey);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          accessLevel: user.accessLevel,
          jabatan: user.jabatan,
          photoUrl: user.photoUrl,
          nis: user.nis,
          nip: user.nip,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessLevel = user.accessLevel;
        token.jabatan = user.jabatan;
        token.photoUrl = user.photoUrl;
        token.nis = user.nis;
        token.nip = user.nip;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.accessLevel = (token.accessLevel as string | null) ?? null;
        session.user.jabatan = token.jabatan as string | null;
        session.user.photoUrl = token.photoUrl as string | null;
        session.user.nis = token.nis as string | null;
        session.user.nip = token.nip as string | null;
      }
      return session;
    },
  },
});
