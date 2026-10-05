// Vendix - Public Layout
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DotGridBackground } from "@/components/ui/DotGridBackground";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative">
      <DotGridBackground />
      <Header />
      <main className="relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
