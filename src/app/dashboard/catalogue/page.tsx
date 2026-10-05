// Vendix - Dashboard Catalogue
"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";

export default function DashboardCatalogue() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Catalogue <span className="text-accent">PLR</span>
        </h1>
        <p className="text-muted">Parcourez et téléchargez les produits</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
        <div className="flex flex-wrap gap-2">
          {["Tous", "Ebooks", "Formations", "Templates Canva", "Scripts", "Kits Marketing"].map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                cat === "Tous"
                  ? "bg-accent text-background font-medium"
                  : "border border-[#222222] text-muted hover:text-text hover:border-accent/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Empty state */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="rounded-2xl border border-[#222222] bg-surface/50 p-16 text-center">
          <Package className="w-12 h-12 text-muted mx-auto mb-4" />
          <div className="font-display font-medium text-lg mb-2">Aucun produit disponible pour le moment</div>
          <p className="text-sm text-muted max-w-md mx-auto">
            Les produits apparaîtront ici dès qu&apos;ils seront ajoutés au catalogue par l&apos;administrateur.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
