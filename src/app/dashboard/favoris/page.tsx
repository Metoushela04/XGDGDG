// Vendix - Favoris
"use client";

import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Heart, Download } from "lucide-react";

export default function FavorisPage() {
  const favorites = [
    { title: "Formation Marketing Digital", category: "Formations", tools: ["Vidéo", "PDF"] },
    { title: "Templates Canva Pro", category: "Templates", tools: ["Canva"] },
    { title: "Kit Email Marketing", category: "Kits", tools: ["HTML", "PDF"] },
    { title: "Guide SEO 2026", category: "Ebooks", tools: ["PDF"] },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Mes <span className="text-accent">favoris</span>
        </h1>
        <p className="text-muted">Produits sauvegardés pour plus tard</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        {favorites.map((item, i) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <SpotlightCard className="p-6 group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="px-2 py-0.5 bg-surface2 text-muted text-xs rounded border border-[#222222]">{item.category}</span>
                </div>
                <Heart className="w-5 h-5 text-accent fill-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-3">{item.title}</h3>
              <div className="flex gap-2 mb-4">
                {item.tools.map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-surface2 rounded text-xs text-muted border border-[#222222]">{t}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 bg-accent text-background font-medium rounded-xl text-sm hover:bg-accent-dim transition-all flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Télécharger
                </button>
                <button className="px-3 py-2.5 border border-[#222222] rounded-xl text-sm hover:border-red-500/50 hover:text-red-400 transition-all">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
