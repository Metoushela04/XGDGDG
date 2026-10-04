// Vendix - Page Tarifs
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export default function TarifsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
            Tarifs <span className="text-accent">transparents</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Un seul plan, deux options de paiement. Sans engagement.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Mensuel */}
          <SpotlightCard className="p-8">
            <div className="mb-8">
              <h3 className="font-display text-2xl font-semibold mb-2">Mensuel</h3>
              <p className="text-sm text-muted">Flexibilité totale, sans engagement</p>
            </div>
            <div className="mb-8">
              <span className="font-display text-6xl font-bold">29$</span>
              <span className="text-muted text-lg">/mois</span>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "Accès complet au catalogue",
                "Téléchargements illimités",
                "Nouveautés chaque semaine",
                "Licence PLR complète",
                "Support par email",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span className="text-accent text-lg">✓</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/inscription"
              className="block text-center py-4 border border-[#222222] rounded-xl hover:border-accent/50 hover:bg-accent/5 transition-all font-medium"
            >
              Choisir ce plan
            </Link>
          </SpotlightCard>

          {/* Annuel */}
          <SpotlightCard className="p-8 border-accent/30 glow-accent relative">
            <div className="absolute top-4 right-4 px-3 py-1 bg-accent text-background text-xs font-medium rounded-full">
              Économisez 40%
            </div>
            <div className="mb-8">
              <h3 className="font-display text-2xl font-semibold mb-2">Annuel</h3>
              <p className="text-sm text-muted">Meilleur rapport qualité-prix</p>
            </div>
            <div className="mb-8">
              <span className="font-display text-6xl font-bold text-accent">19$</span>
              <span className="text-muted text-lg">/mois</span>
              <div className="text-xs text-muted mt-2">Facturé 228$/an</div>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "Tout du plan mensuel",
                "Accès prioritaire aux nouveautés",
                "Support prioritaire",
                "Certificats de licence",
                "Économie de 120$/an",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span className="text-accent text-lg">✓</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/inscription"
              className="block text-center py-4 bg-accent text-background font-medium rounded-xl hover:bg-accent-dim transition-all glow-accent-strong"
            >
              Choisir ce plan
            </Link>
          </SpotlightCard>
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-16"
        >
          <p className="text-sm text-muted mb-4">Moyens de paiement acceptés</p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {["M-Pesa", "Orange Money", "Airtel Money", "Carte bancaire"].map((method) => (
              <div key={method} className="px-4 py-2 border border-[#222222] rounded-lg text-sm">
                {method}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <SpotlightCard className="p-8 max-w-2xl mx-auto">
            <h3 className="font-display text-xl font-semibold mb-3">Garantie satisfaction</h3>
            <p className="text-sm text-muted leading-relaxed">
              Testez Vendix pendant 7 jours. Si le catalogue ne vous convient pas,
              nous vous remboursons intégralement, sans question.
            </p>
          </SpotlightCard>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 max-w-2xl mx-auto"
        >
          <h2 className="font-display text-3xl font-bold text-center mb-8">
            Questions sur les tarifs
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Puis-je changer de plan ?",
                a: "Oui, à tout moment. Le changement prend effet à la prochaine facturation.",
              },
              {
                q: "Y a-t-il un engagement ?",
                a: "Non. Vous pouvez annuler à tout moment. Vous gardez l'accès jusqu'à la fin de votre période.",
              },
              {
                q: "Les prix sont-ils en dollars ?",
                a: "Oui, tous les prix sont en USD. Le paiement Mobile Money convertit automatiquement.",
              },
            ].map((faq) => (
              <SpotlightCard key={faq.q} className="p-6">
                <h3 className="font-medium mb-2">{faq.q}</h3>
                <p className="text-sm text-muted">{faq.a}</p>
              </SpotlightCard>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
