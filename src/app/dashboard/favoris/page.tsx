// Vendix - Favoris
"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function FavorisPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Mes <span className="text-accent">favoris</span>
        </h1>
        <p className="text-muted">Produits sauvegardés pour plus tard</p>
      </motion.div>

      {/* Empty state */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="rounded-2xl border border-[#222222] bg-surface/50 p-16 text-center">
          <Heart className="w-12 h-12 text-muted mx-auto mb-4" />
          <div className="font-display font-medium text-lg mb-2">Aucun favori pour le moment</div>
          <p className="text-sm text-muted max-w-md mx-auto mb-6">
            Parcourez le catalogue et ajoutez des produits à vos favoris.
          </p>
          <Link
            href="/dashboard/catalogue"
            className="inline-block px-6 py-3 bg-accent text-background font-medium rounded-xl hover:bg-accent-dim transition-all text-sm"
          >
            Parcourir le catalogue
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
