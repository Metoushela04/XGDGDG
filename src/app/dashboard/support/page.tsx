// Vendix - Support
"use client";

import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { MessageCircle, Mail, Clock, CheckCircle, Send } from "lucide-react";
import { useState } from "react";

export default function SupportPage() {
  const [message, setMessage] = useState("");

  const tickets = [
    { subject: "Problème de téléchargement", status: "Résolu", date: "28 sept.", icon: CheckCircle },
    { subject: "Question sur la licence PLR", status: "En cours", date: "2 oct.", icon: Clock },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          <span className="text-accent">Support</span> & aide
        </h1>
        <p className="text-muted">Contactez notre équipe ou consultez vos tickets</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SpotlightCard className="p-6 text-center">
            <MessageCircle className="w-8 h-8 text-accent mx-auto mb-3" />
            <div className="font-display font-semibold mb-1">Chat en direct</div>
            <div className="text-xs text-muted">Réponse en &lt; 5 min</div>
          </SpotlightCard>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <SpotlightCard className="p-6 text-center">
            <Mail className="w-8 h-8 text-accent mx-auto mb-3" />
            <div className="font-display font-semibold mb-1">Email</div>
            <div className="text-xs text-muted">support@vendix.com</div>
          </SpotlightCard>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <SpotlightCard className="p-6 text-center">
            <Clock className="w-8 h-8 text-accent mx-auto mb-3" />
            <div className="font-display font-semibold mb-1">Disponibilité</div>
            <div className="text-xs text-muted">Lun-Sam, 8h-20h</div>
          </SpotlightCard>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
        <h2 className="font-display text-xl font-semibold mb-4">Envoyer un message</h2>
        <SpotlightCard className="p-6">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Décrivez votre problème ou question..."
            className="w-full h-32 bg-surface2 border border-[#222222] rounded-xl p-4 text-sm focus:border-accent/50 focus:outline-none transition-colors resize-none"
          />
          <div className="mt-4 flex justify-end">
            <button className="flex items-center gap-2 px-6 py-3 bg-accent text-background font-medium rounded-xl text-sm hover:bg-accent-dim transition-all">
              <Send className="w-4 h-4" /> Envoyer
            </button>
          </div>
        </SpotlightCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="font-display text-xl font-semibold mb-4">Mes tickets</h2>
        <div className="space-y-3">
          {tickets.map((ticket, i) => (
            <SpotlightCard key={ticket.subject} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ticket.icon className={`w-5 h-5 ${ticket.status === "Résolu" ? "text-green-500" : "text-accent"}`} />
                  <div>
                    <div className="font-medium text-sm">{ticket.subject}</div>
                    <div className="text-xs text-muted">{ticket.date}</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${ticket.status === "Résolu" ? "bg-green-500/10 text-green-500" : "bg-accent/10 text-accent"}`}>
                  {ticket.status}
                </span>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
