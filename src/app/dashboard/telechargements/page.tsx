// Vendix - Mes Téléchargements
"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";

export default function TelechargementsPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Mes <span className="text-accent">téléchargements</span>
        </h1>
        <p className="text-muted">Historique de tous vos produits téléchargés</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total téléchargé", value: "0" },
          { label: "Produits", value: "0" },
          { label: "Ce mois", value: "0" },
          { label: "Quota restant", value: "—" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="rounded-2xl border border-[#222222] bg-surface/50 p-4">
              <div className="text-xs text-muted mb-1">{stat.label}</div>
              <div className="font-display text-2xl font-bold text-muted">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="rounded-2xl border border-[#222222] bg-surface/50 p-16 text-center">
          <Download className="w-12 h-12 text-muted mx-auto mb-4" />
          <div className="font-display font-medium text-lg mb-2">Vous n&apos;avez encore rien téléchargé</div>
          <p className="text-sm text-muted">Vos téléchargements apparaîtront ici.</p>
        </div>
      </motion.div>
    </div>
  );
}
