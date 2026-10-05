// Vendix - Profil Utilisateur
"use client";

import { motion } from "framer-motion";
import { User, Mail, Camera, Save } from "lucide-react";
import { useState } from "react";

export default function ProfilPage() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
  });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Mon <span className="text-accent">profil</span>
        </h1>
        <p className="text-muted">Gérez vos informations personnelles</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Avatar card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-1">
          <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-surface2 border-2 border-[#222222] flex items-center justify-center mx-auto">
                <User className="w-10 h-10 text-muted" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-accent text-background rounded-full flex items-center justify-center hover:bg-accent-dim transition-all">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="font-display font-semibold text-lg text-muted">{form.nom || "—"}</div>
            <div className="text-sm text-muted">{form.email || "—"}</div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="md:col-span-2">
          <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6">
            <h2 className="font-display font-semibold text-lg mb-6">Informations personnelles</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-muted" /> Nom complet
                </label>
                <input
                  type="text"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  placeholder="Votre nom complet"
                  className="w-full px-4 py-3 bg-surface2 border border-[#222222] rounded-xl focus:border-accent/50 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted" /> Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 bg-surface2 border border-[#222222] rounded-xl focus:border-accent/50 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="flex items-center gap-2 px-6 py-3 bg-accent text-background font-medium rounded-xl hover:bg-accent-dim transition-all">
                <Save className="w-4 h-4" /> Sauvegarder
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
