// Vendix - Error Page
"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="font-display text-9xl font-bold text-accent mb-4">500</div>
        <h1 className="font-display text-3xl font-semibold mb-4">Erreur serveur</h1>
        <p className="text-muted mb-8 max-w-md mx-auto">
          Une erreur inattendue s'est produite. Veuillez réessayer.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 bg-accent text-background font-medium rounded-xl hover:bg-accent-dim transition-all"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-[#222222] rounded-xl hover:border-accent/50 transition-all"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
