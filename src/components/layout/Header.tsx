// Header component - lightweight, zero mobile lag
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/90 border-b border-[#222222]/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3.5">
          <Link href="/" className="flex items-center gap-3 shrink-0" onClick={closeMenu}>
            <img src="/logo-mark.png" alt="Vendix" className="h-8 md:h-9 w-auto" />
            <span className="font-display font-semibold text-lg md:text-xl tracking-tight">Vendix</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center">
            <Link href="/tarifs" className="text-sm text-muted hover:text-text transition-colors px-4 py-2 whitespace-nowrap">
              Tarifs
            </Link>
            <Link href="/comment-ca-marche" className="text-sm text-muted hover:text-text transition-colors px-4 py-2 whitespace-nowrap">
              Comment ça marche
            </Link>
            <Link href="/catalogue-apercu" className="text-sm text-muted hover:text-text transition-colors px-4 py-2 whitespace-nowrap">
              Catalogue
            </Link>
            <Link href="/faq" className="text-sm text-muted hover:text-text transition-colors px-4 py-2 whitespace-nowrap">
              FAQ
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <Link href="/connexion" className="text-sm text-muted hover:text-text transition-colors px-4 py-2">
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="text-sm bg-accent text-background font-bold px-6 py-2.5 rounded-xl hover:bg-accent-dim transition-all whitespace-nowrap"
            >
              S&apos;abonner
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -mr-2 text-text hover:text-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-[#050505] pt-20 px-6 pb-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#222222]">
            <span className="font-display font-semibold text-lg">Menu</span>
            <button onClick={closeMenu} className="p-2 text-muted hover:text-text" aria-label="Fermer">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col space-y-2">
            {[
              { href: "/tarifs", label: "Tarifs" },
              { href: "/comment-ca-marche", label: "Comment ça marche" },
              { href: "/catalogue-apercu", label: "Catalogue" },
              { href: "/faq", label: "FAQ" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="block py-3.5 text-lg font-medium text-text hover:text-accent transition-colors border-b border-[#222222]/40"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 space-y-3">
            <Link
              href="/connexion"
              onClick={closeMenu}
              className="block text-center py-3.5 border border-[#222222] rounded-xl text-base font-medium hover:border-accent/50 transition-all"
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              onClick={closeMenu}
              className="block text-center py-3.5 bg-accent text-background rounded-xl text-base font-bold hover:bg-accent-dim transition-all"
            >
              S&apos;abonner
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
