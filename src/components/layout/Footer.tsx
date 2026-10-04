// Footer component
import Link from "next/link";

export function Footer() {
  const legalLinks = [
    { label: "CGU", href: "/conditions-generales-utilisation" },
    { label: "CGV", href: "/conditions-generales-vente" },
    { label: "Licence PLR", href: "/licence-plr" },
    { label: "Confidentialité", href: "/politique-de-confidentialite" },
    { label: "Cookies", href: "/politique-de-cookies" },
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Remboursement", href: "/politique-de-remboursement" },
    { label: "Usage acceptable", href: "/politique-utilisation-acceptable" },
    { label: "Signaler un contenu", href: "/signaler-un-contenu" },
  ];

  return (
    <footer className="relative z-10 border-t border-[#222222]/50 bg-surface/30 mt-32">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo-mark.png" alt="Vendix" className="h-8 w-auto" style={{ mixBlendMode: "screen" }} />
              <span className="font-display font-semibold text-xl">Vendix</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Votre stock illimité de produits digitaux prêts à vendre.
            </p>
          </div>

          {/* Produit */}
          <div>
            <h4 className="font-display font-medium text-sm mb-4">Produit</h4>
            <ul className="space-y-2">
              <li><Link href="/tarifs" className="text-sm text-muted hover:text-text transition-colors">Tarifs</Link></li>
              <li><Link href="/catalogue-apercu" className="text-sm text-muted hover:text-text transition-colors">Catalogue</Link></li>
              <li><Link href="/comment-ca-marche" className="text-sm text-muted hover:text-text transition-colors">Comment ça marche</Link></li>
              <li><Link href="/faq" className="text-sm text-muted hover:text-text transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h4 className="font-display font-medium text-sm mb-4">Entreprise</h4>
            <ul className="space-y-2">
              <li><Link href="/a-propos" className="text-sm text-muted hover:text-text transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="text-sm text-muted hover:text-text transition-colors">Contact</Link></li>
              <li><Link href="/blog" className="text-sm text-muted hover:text-text transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-display font-medium text-sm mb-4">Légal</h4>
            <ul className="space-y-2">
              {legalLinks.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-text transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#222222]/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Vendix. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            {legalLinks.slice(5).map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-muted hover:text-text transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
