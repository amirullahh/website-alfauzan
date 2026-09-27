# Website Pondok Pesantren Al-Fauzan

Welcome to the official repository for the **Pondok Pesantren Al-Fauzan** website. This project is built using modern web technologies to provide a fast, responsive, and user-friendly experience for students, parents, and the public.

## 🚀 Features

- **Modern UI/UX**: Designed with Tailwind CSS and Next.js for a sleek and responsive interface.
- **Performance Optimized**: Leverages Next.js App Router and server-side rendering for optimal load times.
- **Interactive Maps**: Integrated with Leaflet for accurate location tracking and display.
- **Database Driven**: Uses Prisma ORM and Supabase for reliable data management.
- **Authentication**: Secure login and session management powered by NextAuth.js.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/), Lucide Icons
- **Maps**: Leaflet & React Leaflet

## 🏃‍♂️ Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amirullahh/website-alfauzan.git
   cd website-alfauzan
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your Supabase and NextAuth credentials.
   ```bash
   cp .env.example .env
   ```

4. Run database migrations:
   ```bash
   npm run db:generate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License

This project is proprietary and intended for the internal use of Pondok Pesantren Al-Fauzan.
