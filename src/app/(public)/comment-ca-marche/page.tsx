// Vendix - Page Comment ça marche
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export default function CommentCaMarchePage() {
  const steps = [
    {
      number: "01",
      title: "Créez votre compte",
      description: "Inscription en 30 secondes. Email, mot de passe, c'est tout.",
      details: [
        "Remplissez le formulaire d'inscription",
        "Vérifiez votre adresse email",
        "Acceptez les conditions d'utilisation",
      ],
    },
    {
      number: "02",
      title: "Choisissez votre plan",
      description: "Mensuel (29$/mois) ou annuel (19$/mois, -40%).",
      details: [
        "Sélectionnez votre formule",
        "Payez par Mobile Money ou carte",
        "Accès immédiat au catalogue",
      ],
    },
    {
      number: "03",
      title: "Téléchargez les packs",
      description: "Parcourez le catalogue et téléchargez les produits qui vous intéressent.",
      details: [
        "Filtrez par catégorie ou outil",
        "Téléchargez le pack ZIP complet",
        "Recevez votre certificat de licence",
      ],
    },
    {
      number: "04",
      title: "Personnalisez",
      description: "Modifiez les produits selon vos besoins. Ajoutez votre marque.",
      details: [
        "Rebrandez avec votre logo",
        "Adaptez le contenu à votre audience",
        "Modifiez les couleurs et le style",
      ],
    },
    {
      number: "05",
      title: "Vendez et gardez 100%",
      description: "Déployez sur votre plateforme de vente favorite.",
      details: [
        "Vendez sur Webvente, Selar, WhatsApp",
        "Fixez vos propres prix",
        "Gardez 100% de vos revenus",
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
            Comment ça <span className="text-accent">marche</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            De l'inscription à vos premiers revenus en 5 étapes simples
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <SpotlightCard className="p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <div className="font-mono text-6xl font-bold text-accent/20 mb-2">
                      {step.number}
                    </div>
                    <h2 className="font-display text-2xl font-semibold">{step.title}</h2>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-lg text-muted mb-6">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-3 text-sm">
                          <span className="text-accent mt-1">→</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-20"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Prêt à commencer ?
          </h2>
          <Link
            href="/inscription"
            className="inline-block px-12 py-4 bg-accent text-background font-medium rounded-xl hover:bg-accent-dim transition-all glow-accent-strong"
          >
            Créer mon compte
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
