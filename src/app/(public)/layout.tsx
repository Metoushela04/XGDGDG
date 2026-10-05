// Vendix - Public Layout
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <main className="relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
