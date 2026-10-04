// Vendix - Page À propos
"use client";

import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export default function AProposPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
            À <span className="text-accent">propos</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Notre mission : démocratiser l'entrepreneuriat digital en Afrique
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <SpotlightCard className="p-8 md:p-12">
            <h2 className="font-display text-3xl font-semibold mb-6">Notre histoire</h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                Vendix est né d'un constat simple : en Afrique francophone, des milliers
                d'entrepreneurs veulent se lancer dans le digital mais manquent de ressources
                de qualité et de temps pour créer leurs propres produits.
              </p>
              <p>
                Nous avons décidé de créer la première banque de produits digitaux sous licence
                de revente, spécialement conçue pour le marché africain. Des produits prêts à
                l'emploi, adaptés aux réalités locales, accessibles via Mobile Money.
              </p>
              <p>
                Aujourd'hui, Vendix accompagne des centaines d'entrepreneurs dans leur parcours
                vers l'indépendance financière digitale.
              </p>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <SpotlightCard className="p-8 md:p-12">
            <h2 className="font-display text-3xl font-semibold mb-6">Notre mission</h2>
            <p className="text-lg text-muted leading-relaxed">
              Permettre à chaque entrepreneur africain de lancer son business digital
              en quelques clics, sans compétence technique, sans investissement initial
              massif, et en gardant 100% de ses revenus.
            </p>
          </SpotlightCard>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-display text-2xl font-semibold mb-6">Nos valeurs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Accessibilité",
                description: "Des produits abordables, accessibles via Mobile Money, utilisables sur mobile.",
              },
              {
                title: "Qualité",
                description: "Des produits professionnels, testés, prêts à l'emploi. Pas de contenu généré à la hâte.",
              },
              {
                title: "Transparence",
                description: "Prix clairs, licence claire, pas de coûts cachés. Vous savez exactement ce que vous achetez.",
              },
            ].map((value, i) => (
              <SpotlightCard key={value.title} className="p-6">
                <h3 className="font-display text-xl font-semibold mb-3 text-accent">
                  {value.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{value.description}</p>
              </SpotlightCard>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
