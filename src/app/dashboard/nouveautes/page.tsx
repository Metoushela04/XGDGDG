// Vendix - Nouveautés
"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function NouveautesPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          <span className="text-accent">Nouveautés</span> de la semaine
        </h1>
        <p className="text-muted">Les derniers produits ajoutés au catalogue</p>
      </motion.div>

      {/* Empty state */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="rounded-2xl border border-[#222222] bg-surface/50 p-16 text-center">
          <Sparkles className="w-12 h-12 text-muted mx-auto mb-4" />
          <div className="font-display font-medium text-lg mb-2">Aucune nouveauté pour le moment</div>
          <p className="text-sm text-muted max-w-md mx-auto">
            Les nouveautés apparaîtront ici dès qu&apos;un nouveau produit sera ajouté au catalogue.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
