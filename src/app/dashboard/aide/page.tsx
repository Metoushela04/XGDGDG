// Vendix - Centre d'aide
"use client";

import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BookOpen, Video, FileText, MessageCircle, Search, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AidePage() {
  const guides = [
    { title: "Premiers pas sur Vendix", desc: "Guide complet pour bien démarrer", icon: BookOpen },
    { title: "Comment télécharger un produit", desc: "Tutoriel étape par étape", icon: FileText },
    { title: "Utiliser la licence PLR", desc: "Vos droits et obligations", icon: FileText },
    { title: "Vendre vos produits", desc: "Stratégies de revente", icon: BookOpen },
  ];

  const videos = [
    { title: "Introduction à Vendix", duration: "5 min", icon: Video },
    { title: "Personnaliser un ebook PLR", duration: "12 min", icon: Video },
    { title: "Configurer votre boutique", duration: "8 min", icon: Video },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Centre d'<span className="text-accent">aide</span>
        </h1>
        <p className="text-muted">Guides, tutoriels et ressources pour réussir</p>
      </motion.div>

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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
        <h2 className="font-display text-xl font-semibold mb-4">Guides populaires</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {guides.map((guide, i) => (
            <SpotlightCard key={guide.title} className="p-6 group cursor-pointer hover:border-accent/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <guide.icon className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold mb-1 group-hover:text-accent transition-colors">{guide.title}</div>
                  <div className="text-sm text-muted">{guide.desc}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted group-hover:text-accent transition-colors shrink-0" />
              </div>
            </SpotlightCard>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-display text-xl font-semibold mb-4">Tutoriels vidéo</h2>
        <div className="space-y-3">
          {videos.map((video, i) => (
            <SpotlightCard key={video.title} className="p-4 group cursor-pointer hover:border-accent/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface2 flex items-center justify-center shrink-0">
                  <video.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm group-hover:text-accent transition-colors">{video.title}</div>
                  <div className="text-xs text-muted">{video.duration}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
              </div>
            </SpotlightCard>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
