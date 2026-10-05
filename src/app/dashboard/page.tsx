// Vendix - Dashboard Home
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Package, Download, Sparkles, FileText, MessageCircle, Inbox } from "lucide-react";

export default function DashboardHome() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Bienvenue sur <span className="text-accent">Vendix</span>
        </h1>
        <p className="text-muted">Gérez votre business de produits digitaux</p>
      </motion.div>

      {/* Stats — empty state, will be filled from database later */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Statut", value: "—", sub: "Aucun abonnement" },
          { label: "Téléchargements", value: "0", sub: "ce mois" },
          { label: "Favoris", value: "0", sub: "produits" },
          { label: "Quota", value: "—", sub: "non actif" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6">
              <div className="text-xs text-muted mb-1">{stat.label}</div>
              <div className="font-display text-2xl font-bold text-muted">{stat.value}</div>
              <div className="text-[10px] text-muted mt-1">{stat.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent downloads — empty state */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Derniers téléchargements</h2>
          <Link href="/dashboard/telechargements" className="text-sm text-accent hover:text-accent-dim">
            Voir tout →
          </Link>
        </div>
        <div className="rounded-2xl border border-[#222222] bg-surface/50 p-12 text-center">
          <Inbox className="w-12 h-12 text-muted mx-auto mb-3" />
          <div className="font-medium text-lg text-muted mb-1">Aucun téléchargement récent</div>
          <p className="text-sm text-muted">Vos téléchargements apparaîtront ici.</p>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8">
        <h2 className="font-display text-xl font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Catalogue", href: "/dashboard/catalogue", icon: Package },
            { label: "Nouveautés", href: "/dashboard/nouveautes", icon: Sparkles },
            { label: "Certificat", href: "/dashboard/certificat", icon: FileText },
            { label: "Support", href: "/dashboard/support", icon: MessageCircle },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6 text-center hover:border-accent/30 transition-all cursor-pointer">
                <div className="text-accent mb-2">
                  <action.icon className="w-6 h-6 mx-auto" />
                </div>
                <div className="text-sm font-medium">{action.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
