// Vendix - Abonnement
"use client";

import { motion } from "framer-motion";
import { CreditCard, Check } from "lucide-react";
import Link from "next/link";

export default function AbonnementPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Mon <span className="text-accent">abonnement</span>
        </h1>
        <p className="text-muted">Gérez votre plan et votre facturation</p>
      </motion.div>

      {/* Current status — no subscription */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
        <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-muted" />
            </div>
            <div>
              <div className="text-sm text-muted">Statut actuel</div>
              <div className="font-display font-bold text-lg text-muted">Aucun abonnement actif</div>
            </div>
          </div>
          <p className="text-sm text-muted mb-4">
            Abonnez-vous pour accéder au catalogue complet et télécharger les produits.
          </p>
          <Link
            href="/tarifs"
            className="inline-block px-6 py-3 bg-accent text-background font-medium rounded-xl hover:bg-accent-dim transition-all text-sm"
          >
            Voir les plans et s&apos;abonner
          </Link>
        </div>
      </motion.div>

      {/* VIP advantages preview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-display text-xl font-semibold mb-4">Avantages avec un abonnement</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "Téléchargements illimités",
            "Accès prioritaire",
            "Support dédié",
            "Certificats PLR",
          ].map((advantage) => (
            <div key={advantage} className="rounded-2xl border border-[#222222] bg-surface/50 p-4 text-center">
              <Check className="w-5 h-5 text-muted mx-auto mb-2" />
              <div className="text-sm font-medium text-muted">{advantage}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
