// Vendix - Support
"use client";

import { motion } from "framer-motion";
import { MessageCircle, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";

export default function SupportPage() {
  const [message, setMessage] = useState("");

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          <span className="text-accent">Support</span> & aide
        </h1>
        <p className="text-muted">Contactez notre équipe ou consultez vos tickets</p>
      </motion.div>

      {/* Contact options */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6 text-center">
            <MessageCircle className="w-8 h-8 text-accent mx-auto mb-3" />
            <div className="font-display font-semibold mb-1">Chat WhatsApp</div>
            <div className="text-xs text-muted">Assistance directe</div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6 text-center">
            <Mail className="w-8 h-8 text-accent mx-auto mb-3" />
            <div className="font-display font-semibold mb-1">Email</div>
            <div className="text-xs text-muted">support@vendix.com</div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6 text-center">
            <Clock className="w-8 h-8 text-accent mx-auto mb-3" />
            <div className="font-display font-semibold mb-1">Disponibilité</div>
            <div className="text-xs text-muted">Lun-Sam, 8h-20h</div>
          </div>
        </motion.div>
      </div>

      {/* Message form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
        <h2 className="font-display text-xl font-semibold mb-4">Envoyer un message</h2>
        <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6">
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
        </div>
      </motion.div>

      {/* Empty tickets */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="font-display text-xl font-semibold mb-4">Mes tickets</h2>
        <div className="rounded-2xl border border-[#222222] bg-surface/50 p-12 text-center">
          <MessageCircle className="w-12 h-12 text-muted mx-auto mb-4" />
          <div className="font-display font-medium text-lg mb-2">Aucun ticket de support</div>
          <p className="text-sm text-muted">Vos échanges avec le support apparaîtront ici.</p>
        </div>
      </motion.div>
    </div>
  );
}
