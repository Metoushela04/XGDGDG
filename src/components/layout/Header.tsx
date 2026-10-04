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

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <motion.div
        className={`mx-4 mt-4 rounded-2xl border transition-all duration-300 ${
          isScrolled
            ? "border-[#222222]/50 bg-surface/80 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-8 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <img src="/logo-mark.png" alt="Vendix" className="h-10 w-auto" style={{ mixBlendMode: "screen" }} />
            <span className="font-display font-semibold text-xl tracking-tight">Vendix</span>
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

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <Link
              href="/connexion"
              className="text-sm text-muted hover:text-text transition-colors px-4 py-2"
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="text-base bg-accent text-background font-bold px-8 py-3 rounded-xl hover:bg-accent-dim transition-all whitespace-nowrap border-0"
            >
              S'abonner
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-[#222222]/50"
            >
              <nav className="flex flex-col p-4 gap-4">
                <Link href="/tarifs" className="text-sm text-muted hover:text-text transition-colors">
                  Tarifs
                </Link>
                <Link href="/comment-ca-marche" className="text-sm text-muted hover:text-text transition-colors">
                  Comment ça marche
                </Link>
                <Link href="/catalogue-apercu" className="text-sm text-muted hover:text-text transition-colors">
                  Catalogue
                </Link>
                <Link href="/faq" className="text-sm text-muted hover:text-text transition-colors">
                  FAQ
                </Link>
                <div className="flex flex-col gap-2 pt-2 border-t border-[#222222]/50">
                  <Link href="/connexion" className="text-sm text-muted hover:text-text transition-colors px-4 py-2">
                    Connexion
                  </Link>
                  <Link
                    href="/inscription"
                    className="text-sm bg-accent text-background font-medium px-4 py-2 rounded-lg text-center"
                  >
                    S'abonner
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
