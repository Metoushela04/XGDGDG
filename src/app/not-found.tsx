// Vendix - 404 Page
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="font-display text-9xl font-bold text-accent mb-4">404</div>
        <h1 className="font-display text-3xl font-semibold mb-4">Page introuvable</h1>
        <p className="text-muted mb-8 max-w-md mx-auto">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-accent text-background font-medium rounded-xl hover:bg-accent-dim transition-all"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/catalogue-apercu"
            className="px-6 py-3 border border-[#222222] rounded-xl hover:border-accent/50 transition-all"
          >
            Voir le catalogue
          </Link>
        </div>
      </div>
    </div>
  );
}
