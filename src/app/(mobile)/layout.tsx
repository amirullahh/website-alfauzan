export default function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col relative w-full max-w-md mx-auto min-h-screen">
      {children}
    </main>
  );
}
