// Vendix - 403 Accès refusé
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Accès refusé — Vendix", robots: { index: false } };

export default function AccesRefusePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
      <div className="max-w-md text-center">
        <p className="font-display text-6xl font-bold text-accent mb-4">403</p>
        <h1 className="font-display text-2xl font-bold mb-3">Accès refusé</h1>
        <p className="text-muted mb-8">Tu n&apos;as pas les droits nécessaires pour consulter cette page.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard" className="px-6 py-3 bg-accent text-background font-medium rounded-xl hover:bg-accent-dim transition-all">
            Retour au dashboard
          </Link>
          <Link href="/contact" className="px-6 py-3 border border-[#222222] rounded-xl hover:border-accent/30 transition-all">
            Contacter le support
          </Link>
        </div>
      </div>
    </div>
  );
}
