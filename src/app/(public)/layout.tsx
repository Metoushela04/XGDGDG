// Vendix - Public Layout
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DotGridBackground } from "@/components/ui/DotGridBackground";
import { AmbientLights } from "@/components/ui/AmbientLights";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative">
      <AmbientLights />
      <DotGridBackground />
      <Header />
      <main className="relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
