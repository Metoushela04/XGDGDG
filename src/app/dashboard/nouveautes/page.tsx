// Vendix - Nouveautés
"use client";

import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Sparkles, Clock, TrendingUp } from "lucide-react";

export default function NouveautesPage() {
  const newProducts = [
    { title: "Guide Instagram 2026", category: "Ebooks", added: "Il y a 2h", badge: "Nouveau", hot: true },
    { title: "Pack Stories Animées", category: "Templates", added: "Il y a 1 jour", badge: "Nouveau", hot: false },
    { title: "Script de Vente WhatsApp", category: "Scripts", added: "Il y a 2 jours", badge: "Nouveau", hot: true },
    { title: "Formation TikTok Business", category: "Formations", added: "Il y a 3 jours", badge: "Nouveau", hot: false },
    { title: "Templates Notion Business", category: "Templates", added: "Il y a 4 jours", badge: "Nouveau", hot: false },
    { title: "Pack Landing Pages", category: "Templates", added: "Il y a 5 jours", badge: "Nouveau", hot: true },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          <span className="text-accent">Nouveautés</span> de la semaine
        </h1>
        <p className="text-muted">Les derniers produits ajoutés au catalogue</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
        <SpotlightCard className="p-6 border-accent/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <div className="font-display font-semibold">6 nouveaux produits cette semaine</div>
              <div className="text-sm text-muted">Catalogue mis à jour en continu</div>
            </div>
            <TrendingUp className="w-5 h-5 text-accent hidden md:block" />
          </div>
        </SpotlightCard>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {newProducts.map((product, i) => (
          <motion.div key={product.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <SpotlightCard className="p-6 group hover:border-accent/30 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded-full border border-accent/20">
                  {product.category}
                </span>
                {product.hot && (
                  <span className="flex items-center gap-1 text-xs text-accent">
                    <TrendingUp className="w-3 h-3" /> Tendance
                  </span>
                )}
              </div>
              <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-accent transition-colors">{product.title}</h3>
              <div className="flex items-center gap-2 text-xs text-muted">
                <Clock className="w-3 h-3" />
                {product.added}
              </div>
              <button className="mt-4 w-full py-2.5 bg-accent text-background font-medium rounded-xl text-sm hover:bg-accent-dim transition-all">
                Télécharger
              </button>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
