// Vendix - Page FAQ
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export default function FAQPage() {
  const faqGroups = [
    {
      title: "Abonnement",
      questions: [
        {
          q: "Comment m'abonner à Vendix ?",
          a: "Cliquez sur 'S'abonner', choisissez votre plan (mensuel ou annuel), et payez par Mobile Money ou carte bancaire. L'accès est immédiat.",
        },
        {
          q: "Puis-je annuler mon abonnement ?",
          a: "Oui, à tout moment depuis votre dashboard. Vous gardez l'accès jusqu'à la fin de votre période de facturation.",
        },
        {
          q: "Y a-t-il un engagement ?",
          a: "Non. L'abonnement mensuel est sans engagement. L'abonnement annuel est facturé pour 12 mois mais reste annulable.",
        },
      ],
    },
    {
      title: "Licence PLR",
      questions: [
        {
          q: "C'est quoi la licence PLR ?",
          a: "PLR (Private Label Rights) vous donne le droit de revendre les produits comme les vôtres. Vous pouvez les modifier, rebrander, et garder 100% des revenus.",
        },
        {
          q: "Que puis-je faire avec les produits ?",
          a: "Vous pouvez les revendre, les modifier, les rebrander, les utiliser pour vos clients. Vous ne pouvez pas redistribuer les fichiers sources gratuitement.",
        },
        {
          q: "Dois-je créditer Vendix ?",
          a: "Non. Une fois téléchargé, le produit est le vôtre. Vous n'avez aucune obligation de mentionner Vendix.",
        },
      ],
    },
    {
      title: "Paiement",
      questions: [
        {
          q: "Quels moyens de paiement acceptez-vous ?",
          a: "M-Pesa, Orange Money, Airtel Money, et les cartes bancaires (Visa, Mastercard) via Chariow.",
        },
        {
          q: "Les prix sont-ils en dollars ?",
          a: "Oui, tous les prix sont en USD. Le paiement Mobile Money convertit automatiquement selon le taux du jour.",
        },
        {
          q: "Reçois-je une facture ?",
          a: "Oui, une facture vous est envoyée par email après chaque paiement.",
        },
      ],
    },
    {
      title: "Téléchargements",
      questions: [
        {
          q: "Combien de téléchargements puis-je faire ?",
          a: "Les téléchargements sont illimités avec l'abonnement actif. Vous pouvez télécharger autant de produits que vous voulez.",
        },
        {
          q: "Les URL de téléchargement expirent-elles ?",
          a: "Oui, les liens signés expirent après 60 secondes pour des raisons de sécurité. Demandez un nouveau lien si nécessaire.",
        },
        {
          q: "Puis-je re-télécharger un produit ?",
          a: "Oui, tous vos téléchargements sont dans votre historique. Vous pouvez re-télécharger à tout moment.",
        },
      ],
    },
    {
      title: "Technique",
      questions: [
        {
          q: "Dois-je avoir des compétences techniques ?",
          a: "Non. Tous nos produits sont clés en main. Vous téléchargez, personnalisez si vous voulez, et vous vendez.",
        },
        {
          q: "Quels outils sont nécessaires ?",
          a: "Cela dépend des produits. Canva (gratuit) pour les templates, un lecteur PDF pour les ebooks, etc. Les prérequis sont indiqués sur chaque fiche produit.",
        },
        {
          q: "La plateforme fonctionne-t-elle sur mobile ?",
          a: "Oui, Vendix est 100% responsive. Vous pouvez parcourir, télécharger et gérer votre compte depuis votre téléphone.",
        },
      ],
    },
  ];

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
            Questions <span className="text-accent">fréquentes</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur Vendix
          </p>
        </motion.div>

        {/* FAQ Groups */}
        <div className="space-y-12">
          {faqGroups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <h2 className="font-display text-2xl font-semibold mb-6">{group.title}</h2>
              <div className="space-y-4">
                {group.questions.map((faq) => (
                  <SpotlightCard key={faq.q} className="p-6">
                    <h3 className="font-medium text-lg mb-3">{faq.q}</h3>
                    <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
                  </SpotlightCard>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-20"
        >
          <SpotlightCard className="p-12">
            <h2 className="font-display text-2xl font-semibold mb-4">
              Vous avez d'autres questions ?
            </h2>
            <p className="text-muted mb-8">
              Notre équipe est là pour vous aider.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-accent text-background font-medium rounded-xl hover:bg-accent-dim transition-all"
            >
              Nous contacter
            </Link>
          </SpotlightCard>
        </motion.div>
      </div>
    </div>
  );
}
