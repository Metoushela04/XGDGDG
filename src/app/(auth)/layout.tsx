// Vendix - Auth Layout
import { DotGridBackground } from "@/components/ui/DotGridBackground";
import { AmbientLights } from "@/components/ui/AmbientLights";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative">
      <AmbientLights />
      <DotGridBackground />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
