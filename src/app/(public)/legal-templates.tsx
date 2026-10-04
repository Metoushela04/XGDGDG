// Vendix - Shared Legal Page Layout
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-sm text-muted mb-12">Dernière mise à jour : {lastUpdated}</p>

          <div className="prose prose-invert max-w-none space-y-6 text-muted leading-relaxed">
            {children}
          </div>

          <div className="mt-16 p-6 border border-yellow-500/20 bg-yellow-500/5 rounded-xl">
            <p className="text-sm text-yellow-500 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Ces textes sont des modèles à faire valider par un juriste avant la mise en production.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
