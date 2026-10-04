// Vendix - Dashboard Home
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Package, Download, Sparkles, Heart, FileText, CreditCard, MessageCircle, HelpCircle } from "lucide-react";

export default function DashboardHome() {
  const stats = [
    { label: "Statut", value: "VIP Actif", color: "text-green-500" },
    { label: "Téléchargements", value: "12", color: "text-accent" },
    { label: "Favoris", value: "5", color: "text-accent" },
    { label: "Quota restant", value: "18/30", color: "text-accent" },
  ];

  const recentProducts = [
    { title: "Pack Ebooks Business", category: "Ebooks", date: "Il y a 2 jours" },
    { title: "Formation Marketing", category: "Formations", date: "Il y a 5 jours" },
    { title: "Templates Canva Pro", category: "Templates", date: "Il y a 1 semaine" },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Bienvenue sur <span className="text-accent">Vendix</span>
        </h1>
        <p className="text-muted">Gérez votre business de produits digitaux</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <SpotlightCard className="p-6">
              <div className="text-xs text-muted mb-1">{stat.label}</div>
              <div className={`font-display text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Derniers téléchargements</h2>
          <Link href="/dashboard/telechargements" className="text-sm text-accent hover:text-accent-dim">
            Voir tout →
          </Link>
        </div>
        <div className="space-y-3">
          {recentProducts.map((product) => (
            <SpotlightCard key={product.title} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{product.title}</div>
                  <div className="text-xs text-muted">{product.category}</div>
                </div>
                <div className="text-xs text-muted">{product.date}</div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </motion.div>

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
              <SpotlightCard className="p-6 text-center hover:border-accent/30 transition-all cursor-pointer">
                <div className="text-accent mb-2">
                  <action.icon className="w-6 h-6 mx-auto" />
                </div>
                <div className="text-sm font-medium">{action.label}</div>
              </SpotlightCard>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
