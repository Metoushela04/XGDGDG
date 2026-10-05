// Vendix - Aperçu du catalogue
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, GraduationCap, Palette, Code, Mail, Package } from "lucide-react";

const catIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, GraduationCap, Palette, Code, Mail,
};

export default function CatalogueApercuPage() {
  const categories = [
    { name: "Ebooks", desc: "Guides et livres pratiques", icon: "BookOpen" },
    { name: "Formations", desc: "Modules vidéo et cours", icon: "GraduationCap" },
    { name: "Templates Canva", desc: "Modèles prêts à modifier", icon: "Palette" },
    { name: "Scripts", desc: "Scripts de vente et communication", icon: "Code" },
    { name: "Kits Marketing", desc: "Ressources et tunnels prêts à l'emploi", icon: "Mail" },
  ];

  const previewTypes = [
    {
      title: "Packs Ebooks Thématiques",
      category: "Ebooks",
      description: "Ebooks complets avec droits de revente pour lancer votre catalogue.",
    },
    {
      title: "Modules de Formations Vidéo",
      category: "Formations",
      description: "Supports pédagogiques, fiches récapitulatives et vidéos à commercialiser.",
    },
    {
      title: "Packs Templates Canva",
      category: "Templates Canva",
      description: "Posts réseaux sociaux, carrousels, bannières et visuels personnalisables.",
    },
    {
      title: "Scripts de Vente & Prospection",
      category: "Scripts",
      description: "Trames WhatsApp, emails de relance et pages de vente adaptables.",
    },
    {
      title: "Kits Marketing Clés en Main",
      category: "Kits Marketing",
      description: "Séquences email, visuels promotionnels et fiches produits prêtes à l'emploi.",
    },
    {
      title: "Guides Pratiques & Checklists",
      category: "Ebooks",
      description: "Outils méthodologiques et fiches d'action prêtes à être partagées ou vendues.",
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
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Aperçu du <span className="text-accent">catalogue</span>
          </h1>
          <p className="text-base md:text-lg text-muted max-w-2xl mx-auto mb-8">
            Explorez les formats et catégories de produits digitaux sous licence de revente (PLR).
          </p>
          <Link
            href="/inscription"
            className="inline-block px-8 py-3 bg-accent text-background font-medium rounded-xl hover:bg-accent-dim transition-all glow-accent text-sm md:text-base"
          >
            Débloquer l&apos;accès complet
          </Link>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="font-display text-2xl font-semibold mb-6">Catégories disponibles</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <div key={cat.name} className="rounded-2xl border border-[#222222] bg-surface/50 p-6 text-center">
                <div className="text-accent mb-2">
                  {(() => { const Icon = catIconMap[cat.icon]; return Icon ? <Icon className="w-7 h-7 mx-auto" /> : null; })()}
                </div>
                <div className="font-medium text-sm mb-1">{cat.name}</div>
                <div className="text-xs text-muted">{cat.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-semibold mb-6">Formats de ressources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewTypes.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="rounded-2xl border border-[#222222] bg-surface/50 overflow-hidden">
                  <div className="aspect-[4/3] bg-surface2 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                    <Package className="w-12 h-12 text-accent opacity-20" />
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-muted mb-2">{item.category}</div>
                    <h3 className="font-display text-lg font-semibold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="rounded-2xl border border-[#222222] bg-surface/50 p-10 max-w-2xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Accédez à tout le catalogue
            </h2>
            <p className="text-sm md:text-base text-muted mb-8">
              Abonnez-vous pour débloquer les ressources et télécharger directement avec licence de revente.
            </p>
            <Link
              href="/inscription"
              className="inline-block px-10 py-3.5 bg-accent text-background font-medium rounded-xl hover:bg-accent-dim transition-all glow-accent-strong text-sm md:text-base"
            >
              Commencer maintenant
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
