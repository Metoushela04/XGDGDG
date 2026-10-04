// Vendix Landing Page - Atmospheric Dark with Lime Accent
// Cinematic animations, grain texture, asymmetric layouts

"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GlowEffect, LightStreak } from "@/components/ui/GlowEffect";
import { AnimatedText, AnimatedParagraph } from "@/components/ui/AnimatedText";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Package, DollarSign, Smartphone, Shield, Sparkles, Headphones, ShoppingBag, BookOpen, Palette, Code, Mail, Search } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Package, DollarSign, Smartphone, Shield, Sparkles, Headphones,
  ShoppingBag, BookOpen, Palette, Code, Mail, Search,
};

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Social Proof */}
      <SocialProof />
      
      {/* How it Works */}
      <HowItWorks />
      
      {/* Features */}
      <Features />
      
      {/* Catalog Preview */}
      <CatalogPreview />
      
      {/* Pricing */}
      <Pricing />
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* FAQ */}
      <FAQ />
      
      {/* Final CTA */}
      <FinalCTA />
    </div>
  );
}

function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div
          className="absolute w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
            left: "10%",
            top: "20%",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] bg-accent/3 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px)`,
            right: "15%",
            bottom: "20%",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_70%)]" />
      </div>

      {/* Light Streak */}
      <LightStreak className="top-1/3 left-0 right-0 h-px" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge supprimé - pas professionnel */}

        {/* Main Headline */}
      <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-8">
  <AnimatedText delay={0.3}>
    <span className="block text-text">
      Votre stock{" "}
      <span className="text-accent text-glow-accent">illimité</span>
    </span>
  </AnimatedText>

  <AnimatedText delay={0.5}>
    <span className="block text-text">de produits digitaux</span>
  </AnimatedText>
        </h1>

        {/* Subheadline */}
        <AnimatedParagraph
          delay={0.6}
          className="text-lg md:text-xl text-muted max-w-3xl mx-auto leading-relaxed mb-12"
        >
          Débloquez la première banque de produits digitaux sous licence de revente.
          Téléchargez nos ressources clés en main, déployez-les en 3 clics sans aucune
          compétence technique, et conservez 100% de votre chiffre d'affaires.
        </AnimatedParagraph>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/inscription"
            className="group relative px-8 py-4 bg-accent text-background font-medium rounded-xl hover:bg-accent-dim transition-all glow-accent-strong"
          >
            <span className="relative z-10">Commencer maintenant</span>
          </Link>
          <Link
            href="/catalogue-apercu"
            className="px-8 py-4 border border-[#222222] text-text font-medium rounded-xl hover:border-accent/50 hover:bg-accent/5 transition-all"
          >
            Voir le catalogue
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-accent">100%</div>
            <div className="text-xs text-muted mt-1">Revenus conservés</div>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-accent">3 clics</div>
            <div className="text-xs text-muted mt-1">Pour déployer</div>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-accent">24/7</div>
            <div className="text-xs text-muted mt-1">Accès catalogue</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-[#222222] rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-1 bg-accent rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="py-20 border-t border-[#222222]/50">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs text-muted uppercase tracking-widest mb-12">
          Ils ont déjà choisi Vendix
        </p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 opacity-50">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-center h-12">
              <div className="h-8 w-24 bg-border/30 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Abonnez-vous",
      description: "Choisissez votre plan mensuel ou annuel. Accès immédiat au catalogue complet.",
    },
    {
      number: "02",
      title: "Téléchargez",
      description: "Récupérez les packs ZIP prêts à l'emploi. Ebooks, formations, templates, scripts.",
    },
    {
      number: "03",
      title: "Revendez",
      description: "Personnalisez, rebrandez, déployez. Gardez 100% de vos revenus, partout.",
    },
  ];

  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Comment ça <span className="text-accent">marche</span>
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Trois étapes simples pour lancer votre business de produits digitaux
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <SpotlightCard className="p-8 h-full">
                <div className="font-mono text-xs text-accent mb-4">{step.number}</div>
                <h3 className="font-display text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted leading-relaxed">{step.description}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: "Package", title: "Clés en main", description: "Produits complets, prêts à vendre immédiatement. Aucune compétence technique requise." },
    { icon: "DollarSign", title: "100% des revenus", description: "Vous gardez tout ce que vous gagnez. Pas de commission, pas de partage." },
    { icon: "Smartphone", title: "Mobile-first", description: "Plateforme optimisée pour mobile. Gérez votre business depuis votre téléphone." },
    { icon: "Shield", title: "Licence PLR", description: "Droit de revente complet. Modifiez, rebrandez, redistribuez comme bon vous semble." },
    { icon: "Sparkles", title: "Catalogue vivant", description: "Nouveaux produits ajoutés chaque semaine. Votre stock ne cesse de croître." },
    { icon: "Headphones", title: "Support dédié", description: "Équipe disponible pour vous accompagner. Guides, tutoriels, assistance." },
  ];

  return (
    <section className="py-32 relative border-t border-[#222222]/50">
      <GlowEffect className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Pourquoi <span className="text-accent">Vendix</span>
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour réussir dans la vente de produits digitaux
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <SpotlightCard className="p-8 h-full group hover:border-accent/30 transition-all">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform text-accent">
                {(() => {
                  const Icon = iconMap[feature.icon as keyof typeof iconMap];
                  return Icon ? <Icon className="w-8 h-8" /> : null;
                })()}
              </div>
                <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CatalogPreview() {
  const products = [
    { title: "Pack Ebooks Business", category: "Ebooks", badge: "Nouveau" },
    { title: "Formation Marketing Digital", category: "Formations", badge: null },
    { title: "Templates Canva Pro", category: "Templates", badge: "Populaire" },
    { title: "Scripts de Vente", category: "Scripts", badge: null },
    { title: "Kit Email Marketing", category: "Templates", badge: "Nouveau" },
    { title: "Guide SEO Complet", category: "Ebooks", badge: null },
  ];

  return (
    <section className="py-32 border-t border-[#222222]/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Aperçu du <span className="text-accent">catalogue</span>
            </h2>
            <p className="text-lg text-muted max-w-xl">
              Des centaines de produits digitaux prêts à vendre
            </p>
          </div>
          <Link
            href="/catalogue-apercu"
            className="hidden md:block text-sm text-accent hover:text-accent-dim transition-colors"
          >
            Voir tout →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <SpotlightCard className="group cursor-pointer">
                <div className="aspect-[4/3] bg-surface2 rounded-t-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                  {product.badge && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-accent text-background text-xs font-medium rounded-full">
                      {product.badge}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-xs text-muted mb-2">{product.category}</div>
                  <h3 className="font-display text-lg font-semibold group-hover:text-accent transition-colors">
                    {product.title}
                  </h3>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="py-32 relative border-t border-[#222222]/50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Tarifs <span className="text-accent">simples</span>
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Un seul plan, deux options de paiement
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <SpotlightCard className="p-8">
            <div className="mb-8">
              <h3 className="font-display text-2xl font-semibold mb-2">Mensuel</h3>
              <p className="text-sm text-muted">Flexibilité totale</p>
            </div>
            <div className="mb-8">
              <span className="font-display text-5xl font-bold">29$</span>
              <span className="text-muted">/mois</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm">
                <span className="text-accent">✓</span>
                <span>Accès complet au catalogue</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="text-accent">✓</span>
                <span>Téléchargements illimités</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="text-accent">✓</span>
                <span>Nouveautés chaque semaine</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="text-accent">✓</span>
                <span>Licence PLR complète</span>
              </li>
            </ul>
            <Link
              href="/inscription"
              className="block text-center py-3 border border-[#222222] rounded-lg hover:border-accent/50 hover:bg-accent/5 transition-all"
            >
              Choisir ce plan
            </Link>
          </SpotlightCard>

          <SpotlightCard className="p-8 border-accent/30 glow-accent">
            <div className="absolute top-4 right-4 px-3 py-1 bg-accent text-background text-xs font-medium rounded-full">
              Économisez 40%
            </div>
            <div className="mb-8">
              <h3 className="font-display text-2xl font-semibold mb-2">Annuel</h3>
              <p className="text-sm text-muted">Meilleur rapport qualité-prix</p>
            </div>
            <div className="mb-8">
              <span className="font-display text-5xl font-bold">19$</span>
              <span className="text-muted">/mois</span>
              <div className="text-xs text-muted mt-1">Facturé 228$/an</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm">
                <span className="text-accent">✓</span>
                <span>Tout du plan mensuel</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="text-accent">✓</span>
                <span>Accès prioritaire aux nouveautés</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="text-accent">✓</span>
                <span>Support prioritaire</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="text-accent">✓</span>
                <span>Certificats de licence</span>
              </li>
            </ul>
            <Link
              href="/inscription"
              className="block text-center py-3 bg-accent text-background font-medium rounded-lg hover:bg-accent-dim transition-all glow-accent-strong"
            >
              Choisir ce plan
            </Link>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      quote: "J'ai lancé ma boutique en 2 jours. Les produits sont de qualité pro.",
      author: "Marie K.",
      role: "Entrepreneure, Kinshasa",
    },
    {
      quote: "Le meilleur investissement pour mon business digital. ROI en 1 semaine.",
      author: "Jean-Paul M.",
      role: "Marketer, Lubumbashi",
    },
    {
      quote: "Catalogue riche, interface clean. Exactement ce qu'il me fallait.",
      author: "Sarah L.",
      role: "Freelance, Goma",
    },
  ];

  return (
    <section className="py-32 border-t border-[#222222]/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Ils en <span className="text-accent">parlent</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <SpotlightCard className="p-8 h-full">
                <div className="text-accent text-2xl mb-4">"</div>
                <p className="text-muted leading-relaxed mb-6">{testimonial.quote}</p>
                <div>
                  <div className="font-medium text-sm">{testimonial.author}</div>
                  <div className="text-xs text-muted">{testimonial.role}</div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      question: "C'est quoi la licence PLR ?",
      answer: "PLR (Private Label Rights) vous donne le droit de revendre les produits comme les vôtres. Vous pouvez les modifier, rebrander, et garder 100% des revenus.",
    },
    {
      question: "Dois-je avoir des compétences techniques ?",
      answer: "Non. Tous nos produits sont clés en main. Vous téléchargez, personnalisez si vous voulez, et vous vendez.",
    },
    {
      question: "Comment fonctionne le paiement ?",
      answer: "Nous acceptons Mobile Money (M-Pesa, Orange Money, Airtel Money) et les cartes bancaires via Chariow.",
    },
    {
      question: "Puis-je annuler mon abonnement ?",
      answer: "Oui, à tout moment. Vous gardez l'accès jusqu'à la fin de votre période de facturation.",
    },
  ];

  return (
    <section className="py-32 border-t border-[#222222]/50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Questions <span className="text-accent">fréquentes</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <SpotlightCard className="p-6">
                <h3 className="font-display text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-sm text-muted leading-relaxed">{faq.answer}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      <GlowEffect className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]" />
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
          Prêt à <span className="text-accent text-glow-accent">lancer</span> ?
        </h2>
        <p className="text-lg text-muted max-w-2xl mx-auto mb-12">
          Rejoignez Vendix aujourd'hui et accédez instantanément à des centaines de produits digitaux prêts à vendre.
        </p>
        <Link
          href="/inscription"
          className="inline-block px-12 py-5 bg-accent text-background font-medium text-lg rounded-xl hover:bg-accent-dim transition-all glow-accent-strong"
        >
          Commencer maintenant
        </Link>
      </div>
    </section>
  );
}
