// Vendix - Aperçu du catalogue
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BookOpen, GraduationCap, Palette, Code, Mail, Package } from "lucide-react";

const catIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, GraduationCap, Palette, Code, Mail,
};

export default function CatalogueApercuPage() {
  const categories = [
    { name: "Ebooks", count: 45, icon: "BookOpen" },
    { name: "Formations", count: 23, icon: "GraduationCap" },
    { name: "Templates Canva", count: 67, icon: "Palette" },
    { name: "Scripts", count: 31, icon: "Code" },
    { name: "Kits Marketing", count: 18, icon: "Mail" },
  ];

  const products = [
    {
      title: "Pack Ebooks Business 2026",
      category: "Ebooks",
      description: "10 ebooks complets sur l'entrepreneuriat digital",
      badge: "Nouveau",
    },
    {
      title: "Formation Marketing Digital Complète",
      category: "Formations",
      description: "Module vidéo + supports PDF + exercices pratiques",
      badge: "Populaire",
    },
    {
      title: "50 Templates Canva Professionnels",
      category: "Templates Canva",
      description: "Posts Instagram, stories, carrousels, bannières",
      badge: null,
    },
    {
      title: "Scripts de Vente Haute Conversion",
      category: "Scripts",
      description: "Scripts pour WhatsApp, email, landing pages",
      badge: null,
    },
    {
      title: "Kit Email Marketing Automation",
      category: "Kits Marketing",
      description: "Séquences email prêtes à l'emploi",
      badge: "Nouveau",
    },
    {
      title: "Guide SEO & Référencement 2026",
      category: "Ebooks",
      description: "Strategies complètes pour ranker sur Google",
      badge: null,
    },
    {
      title: "Formation Création de Contenu",
      category: "Formations",
      description: "Devenez créateur de contenu professionnel",
      badge: null,
    },
    {
      title: "Templates Présentation Business",
      category: "Templates Canva",
      description: "Pitch decks, propositions commerciales",
      badge: null,
    },
    {
      title: "Scripts Cold Outreach B2B",
      category: "Scripts",
      description: "Templates LinkedIn, email, téléphone",
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
            Aperçu du <span className="text-accent">catalogue</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
            Des centaines de produits digitaux prêts à vendre. Nouveaux ajouts chaque semaine.
          </p>
          <Link
            href="/inscription"
            className="inline-block px-8 py-3 bg-accent text-background font-medium rounded-xl hover:bg-accent-dim transition-all glow-accent"
          >
            Débloquer l'accès complet
          </Link>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="font-display text-2xl font-semibold mb-6">Catégories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <SpotlightCard key={cat.name} className="p-6 text-center">
                <div className="text-accent mb-2">
                  {(() => { const Icon = catIconMap[cat.icon]; return Icon ? <Icon className="w-7 h-7 mx-auto" /> : null; })()}
                </div>
                <div className="font-medium text-sm mb-1">{cat.name}</div>
                <div className="text-xs text-muted">{cat.count} produits</div>
              </SpotlightCard>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-semibold mb-6">Produits populaires</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
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
                      <div className="text-4xl opacity-20">📦</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-muted mb-2">{product.category}</div>
                    <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-sm text-muted">{product.description}</p>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <SpotlightCard className="p-12 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl font-bold mb-4">
              Accédez à tout le catalogue
            </h2>
            <p className="text-muted mb-8">
              Abonnez-vous pour débloquer des centaines de produits et télécharger sans limite.
            </p>
            <Link
              href="/inscription"
              className="inline-block px-12 py-4 bg-accent text-background font-medium rounded-xl hover:bg-accent-dim transition-all glow-accent-strong"
            >
              Commencer maintenant
            </Link>
          </SpotlightCard>
        </motion.div>
      </div>
    </div>
  );
}
