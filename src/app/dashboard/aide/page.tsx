// Vendix - Centre d'aide
"use client";

import { motion } from "framer-motion";
import { BookOpen, FileText, Search, ArrowRight, Clock } from "lucide-react";

export default function AidePage() {
  const guides = [
    { title: "Premiers pas sur Vendix", desc: "Guide complet pour bien démarrer", icon: BookOpen },
    { title: "Comment télécharger un produit", desc: "Tutoriel étape par étape", icon: FileText },
    { title: "Utiliser la licence PLR", desc: "Vos droits et obligations", icon: FileText },
    { title: "Vendre vos produits", desc: "Stratégies de revente", icon: BookOpen },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Centre d&apos;<span className="text-accent">aide</span>
        </h1>
        <p className="text-muted">Guides, tutoriels et ressources pour réussir</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder="Rechercher dans l'aide..."
            className="w-full pl-12 pr-4 py-3.5 bg-surface border border-[#222222] rounded-xl text-sm focus:border-accent/50 focus:outline-none transition-colors"
          />
        </div>
      </motion.div>

      {/* Guides */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-display text-xl font-semibold mb-4">Guides</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {guides.map((guide) => (
            <div key={guide.title} className="rounded-2xl border border-[#222222] bg-surface/50 p-6 group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <guide.icon className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold mb-1">{guide.title}</div>
                  <div className="text-sm text-muted">{guide.desc}</div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted">
                    <Clock className="w-3 h-3" /> Bientôt disponible
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
