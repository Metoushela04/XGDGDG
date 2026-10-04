// Vendix - Certificat de Licence PLR
"use client";

import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { FileText, Download, Shield, CheckCircle } from "lucide-react";

export default function CertificatPage() {
  const certificates = [
    { product: "Pack Ebooks Business", date: "2 oct. 2026", license: "PLR Complète" },
    { product: "Formation Marketing Digital", date: "28 sept. 2026", license: "PLR Complète" },
    { product: "Templates Canva Pro", date: "25 sept. 2026", license: "PLR Complète" },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Mes <span className="text-accent">certificats</span>
        </h1>
        <p className="text-muted">Licences PLR de vos produits téléchargés</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
        <SpotlightCard className="p-6 border-accent/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <div>
              <div className="font-display font-semibold text-lg mb-1">Licence PLR Active</div>
              <p className="text-sm text-muted leading-relaxed">
                Chaque produit téléchargé vient avec un certificat de licence PLR (Private Label Rights).
                Vous avez le droit de revendre, modifier et redistribuer ces produits sous votre marque.
              </p>
            </div>
          </div>
        </SpotlightCard>
      </motion.div>

      <div className="space-y-3">
        {certificates.map((cert, i) => (
          <motion.div key={cert.product} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
            <SpotlightCard className="p-4 md:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm md:text-base truncate">{cert.product}</div>
                    <div className="text-xs text-muted">{cert.date} · {cert.license}</div>
                  </div>
                </div>
                <button className="shrink-0 flex items-center gap-2 px-4 py-2 border border-[#222222] rounded-xl text-sm hover:border-accent/50 hover:text-accent transition-all">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
