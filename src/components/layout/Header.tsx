// Header component - atmospheric dark with lime accents
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40">
        <motion.div
          className={`mx-3 mt-3 md:mx-4 md:mt-4 rounded-2xl border transition-all duration-300 ${
            isScrolled || isMobileMenuOpen
              ? "border-[#222222]/50 bg-surface/90 backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
            <Link href="/" className="flex items-center gap-3 group shrink-0" onClick={closeMenu}>
              <img src="/logo-mark.png" alt="Vendix" className="h-8 md:h-10 w-auto" style={{ mixBlendMode: "screen" }} />
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
                className="text-base bg-accent text-background font-bold px-8 py-3 rounded-xl hover:bg-accent-dim transition-all whitespace-nowrap"
              >
                S'abonner
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
        </motion.div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 md:hidden bg-background/95 backdrop-blur-xl pt-24 px-6 pb-8 overflow-y-auto"
          >
            <nav className="flex flex-col space-y-1">
              {[
                { href: "/tarifs", label: "Tarifs" },
                { href: "/comment-ca-marche", label: "Comment ça marche" },
                { href: "/catalogue-apercu", label: "Catalogue" },
                { href: "/faq", label: "FAQ" },
              ].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="block py-4 text-lg font-medium text-text hover:text-accent transition-colors border-b border-[#222222]/50"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-8 space-y-3">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Link
                  href="/connexion"
                  onClick={closeMenu}
                  className="block text-center py-4 border border-[#222222] rounded-xl text-lg font-medium hover:border-accent/50 transition-all"
                >
                  Connexion
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Link
                  href="/inscription"
                  onClick={closeMenu}
                  className="block text-center py-4 bg-accent text-background rounded-xl text-lg font-bold hover:bg-accent-dim transition-all"
                >
                  S'abonner
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
