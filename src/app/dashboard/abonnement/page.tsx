// Vendix - Abonnement
"use client";

import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { CreditCard, Calendar, CheckCircle, Clock } from "lucide-react";

export default function AbonnementPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Mon <span className="text-accent">abonnement</span>
        </h1>
        <p className="text-muted">Gérez votre plan et votre facturation</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SpotlightCard className="p-6 border-accent/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-sm text-muted">Plan actuel</div>
                <div className="font-display font-bold text-lg text-accent">Annuel — VIP</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Prochain renouvellement</span><span>2 oct. 2027</span></div>
              <div className="flex justify-between"><span className="text-muted">Montant</span><span className="text-accent font-medium">228$/an</span></div>
              <div className="flex justify-between"><span className="text-muted">Statut</span><span className="flex items-center gap-1 text-green-500"><CheckCircle className="w-3 h-3" />Actif</span></div>
            </div>
          </SpotlightCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <SpotlightCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-muted" />
              </div>
              <div>
                <div className="text-sm text-muted">Historique</div>
                <div className="font-display font-bold text-lg">3 factures</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Dernier paiement</span><span>2 oct. 2026</span></div>
              <div className="flex justify-between"><span className="text-muted">Mode de paiement</span><span>Mobile Money</span></div>
              <div className="flex justify-between"><span className="text-muted">Jours restants</span><span className="text-accent font-medium">365</span></div>
            </div>
          </SpotlightCard>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-display text-xl font-semibold mb-4">Avantages VIP</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "Téléchargements illimités",
            "Accès prioritaire",
            "Support dédié",
            "Certificats PLR",
          ].map((advantage) => (
            <SpotlightCard key={advantage} className="p-4 text-center">
              <CheckCircle className="w-5 h-5 text-accent mx-auto mb-2" />
              <div className="text-sm font-medium">{advantage}</div>
            </SpotlightCard>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
        <SpotlightCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display font-semibold mb-1">Annuler l'abonnement</div>
              <div className="text-sm text-muted">Vous gardez l'accès jusqu'à la fin de la période</div>
            </div>
            <button className="px-6 py-3 border border-red-500/30 text-red-400 rounded-xl text-sm hover:bg-red-500/10 transition-all">
              Annuler
            </button>
          </div>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}
