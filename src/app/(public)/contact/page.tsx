// Vendix - Page Contact
"use client";

import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
            <span className="text-accent">Contact</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Une question ? Un problème ? Notre équipe est là pour vous aider.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          <SpotlightCard className="p-8 text-center">
            <div className="text-4xl mb-4"></div>
            <h3 className="font-display text-xl font-semibold mb-2">Email</h3>
            <p className="text-sm text-muted mb-4">Réponse sous 24h</p>
            <a
              href="mailto:support@vendix.com"
              className="text-accent hover:text-accent-dim transition-colors"
            >
              support@vendix.com
            </a>
          </SpotlightCard>

          <SpotlightCard className="p-8 text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="font-display text-xl font-semibold mb-2">WhatsApp</h3>
            <p className="text-sm text-muted mb-4">Réponse rapide</p>
            <a
              href="https://wa.me/243000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-dim transition-colors"
            >
              +243 000 000 000
            </a>
          </SpotlightCard>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SpotlightCard className="p-8">
            <h2 className="font-display text-2xl font-semibold mb-6">Envoyez-nous un message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-surface2 border border-[#222222] rounded-xl focus:border-accent/50 focus:outline-none transition-colors"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-surface2 border border-[#222222] rounded-xl focus:border-accent/50 focus:outline-none transition-colors"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 bg-surface2 border border-[#222222] rounded-xl focus:border-accent/50 focus:outline-none transition-colors"
                  placeholder="Objet de votre message"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-4 py-3 bg-surface2 border border-[#222222] rounded-xl focus:border-accent/50 focus:outline-none transition-colors resize-none"
                  placeholder="Votre message..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-accent text-background font-medium rounded-xl hover:bg-accent-dim transition-all glow-accent"
              >
                Envoyer le message
              </button>
            </form>
          </SpotlightCard>
        </motion.div>
      </div>
    </div>
  );
}
