import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      accessLevel: string | null;
      jabatan: string | null;
      photoUrl: string | null;
      nis: string | null;
      nip: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    accessLevel: string | null;
    jabatan: string | null;
    photoUrl: string | null;
    nis: string | null;
    nip: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    accessLevel: string | null;
    jabatan: string | null;
    photoUrl: string | null;
    nis: string | null;
    nip: string | null;
  }
}
