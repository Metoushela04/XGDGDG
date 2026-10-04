// Vendix - Dashboard Catalogue
"use client";

import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Package } from "lucide-react";

export default function DashboardCatalogue() {
  const products = [
    {
      title: "Pack Ebooks Business 2026",
      category: "Ebooks",
      badge: "Nouveau",
      tools: ["PDF", "Word"],
      description: "10 ebooks complets sur l'entrepreneuriat digital",
    },
    {
      title: "Formation Marketing Digital",
      category: "Formations",
      badge: "Populaire",
      tools: ["Vidéo", "PDF"],
      description: "Module vidéo complet + supports PDF",
    },
    {
      title: "50 Templates Canva Pro",
      category: "Templates Canva",
      badge: null,
      tools: ["Canva"],
      description: "Posts, stories, carrousels professionnels",
    },
    {
      title: "Scripts de Vente",
      category: "Scripts",
      badge: null,
      tools: ["Word", "PDF"],
      description: "Scripts WhatsApp, email, landing pages",
    },
    {
      title: "Kit Email Marketing",
      category: "Kits Marketing",
      badge: "Nouveau",
      tools: ["HTML", "PDF"],
      description: "Séquences email automation complètes",
    },
    {
      title: "Guide SEO 2026",
      category: "Ebooks",
      badge: null,
      tools: ["PDF"],
      description: "Stratégies de référencement complètes",
    },
  ];

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

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, i) => (
          <motion.div
            key={product.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <SpotlightCard className="group cursor-pointer">
              <div className="aspect-[4/3] bg-surface2 rounded-t-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                {product.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-accent text-background text-xs font-medium rounded-full">
                    {product.badge}
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl opacity-20">📦</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  {product.tools.map((tool) => (
                    <span key={tool} className="px-2 py-0.5 bg-surface2 rounded text-xs text-muted border border-[#222222]">
                      {tool}
                    </span>
                  ))}
                </div>
                <h3 className="font-display text-lg font-semibold mb-1 group-hover:text-accent transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm text-muted mb-4">{product.description}</p>
                <button className="w-full py-3 bg-accent text-background font-medium rounded-xl hover:bg-accent-dim transition-all text-sm">
                  Télécharger le Pack ZIP
                </button>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
