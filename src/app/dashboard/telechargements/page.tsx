// Vendix - Mes Téléchargements
"use client";

import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Download, FileText, Calendar, HardDrive } from "lucide-react";

export default function TelechargementsPage() {
  const downloads = [
    { title: "Pack Ebooks Business", category: "Ebooks", date: "2 oct. 2026", size: "45 MB", format: "ZIP" },
    { title: "Formation Marketing Digital", category: "Formations", date: "28 sept. 2026", size: "120 MB", format: "ZIP" },
    { title: "Templates Canva Pro", category: "Templates", date: "25 sept. 2026", size: "32 MB", format: "ZIP" },
    { title: "Scripts de Vente", category: "Scripts", date: "20 sept. 2026", size: "12 MB", format: "ZIP" },
    { title: "Kit Email Marketing", category: "Kits", date: "15 sept. 2026", size: "8 MB", format: "ZIP" },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Mes <span className="text-accent">téléchargements</span>
        </h1>
        <p className="text-muted">Historique de tous vos produits téléchargés</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SpotlightCard className="p-4">
          <div className="text-xs text-muted mb-1 flex items-center gap-2"><HardDrive className="w-3 h-3" />Total téléchargé</div>
          <div className="font-display text-2xl font-bold text-accent">217 MB</div>
        </SpotlightCard>
        <SpotlightCard className="p-4">
          <div className="text-xs text-muted mb-1 flex items-center gap-2"><FileText className="w-3 h-3" />Produits</div>
          <div className="font-display text-2xl font-bold text-accent">{downloads.length}</div>
        </SpotlightCard>
        <SpotlightCard className="p-4">
          <div className="text-xs text-muted mb-1 flex items-center gap-2"><Calendar className="w-3 h-3" />Ce mois</div>
          <div className="font-display text-2xl font-bold text-accent">3</div>
        </SpotlightCard>
        <SpotlightCard className="p-4">
          <div className="text-xs text-muted mb-1 flex items-center gap-2"><Download className="w-3 h-3" />Quota restant</div>
          <div className="font-display text-2xl font-bold text-accent">18/30</div>
        </SpotlightCard>
      </motion.div>

      <div className="space-y-3">
        {downloads.map((item, i) => (
          <motion.div key={item.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
            <SpotlightCard className="p-4 md:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm md:text-base truncate">{item.title}</div>
                  <div className="text-xs text-muted mt-1">{item.category} · {item.size} · {item.date}</div>
                </div>
                <button className="shrink-0 flex items-center gap-2 px-4 py-2 bg-accent text-background font-medium rounded-xl text-xs md:text-sm hover:bg-accent-dim transition-all">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Re-télécharger</span>
                </button>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
