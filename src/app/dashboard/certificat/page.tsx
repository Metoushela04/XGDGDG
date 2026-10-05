// Vendix - Certificat de Licence PLR
"use client";

import { motion } from "framer-motion";
import { FileText, Shield } from "lucide-react";

export default function CertificatPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Mes <span className="text-accent">certificats</span>
        </h1>
        <p className="text-muted">Licences PLR de vos produits téléchargés</p>
      </motion.div>

      {/* Info banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
        <div className="rounded-2xl border border-accent/20 bg-surface/50 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <div>
              <div className="font-display font-semibold text-lg mb-1">Licence PLR</div>
              <p className="text-sm text-muted leading-relaxed">
                Chaque produit téléchargé vient avec un certificat de licence PLR (Private Label Rights).
                Vous avez le droit de revendre, modifier et redistribuer ces produits sous votre marque.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Empty state */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="rounded-2xl border border-[#222222] bg-surface/50 p-16 text-center">
          <FileText className="w-12 h-12 text-muted mx-auto mb-4" />
          <div className="font-display font-medium text-lg mb-2">Aucun certificat généré</div>
          <p className="text-sm text-muted max-w-md mx-auto">
            Les certificats apparaîtront ici après un téléchargement de produit.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
