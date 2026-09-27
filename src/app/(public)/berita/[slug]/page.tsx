import { notFound } from "next/navigation";
import { dummyNews } from "@/lib/dummy-data";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function generateStaticParams() {
  return dummyNews.map((n) => ({ slug: n.slug }));
}

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = dummyNews.find((n) => n.slug === slug);

  if (!news) {
    notFound();
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/berita"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Berita
        </Link>

        <Badge variant="secondary" className="mb-4">
          <Calendar className="mr-1 h-3 w-3" />
          {new Date(news.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Badge>

        <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
          {news.title}
        </h1>

        <div className="aspect-[16/9] w-full mt-6 rounded-xl bg-muted border border-border flex items-center justify-center">
          <span className="text-sm text-muted-foreground">
            Cover: {news.title}
          </span>
        </div>

        <div className="mt-8 prose prose-stone max-w-none">
          {news.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Ditulis oleh Admin Pondok
          </span>
          <Link
            href="/berita"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-3 w-3" />
            Kembali ke daftar berita
          </Link>
        </div>
      </div>
    </div>
  );
}
