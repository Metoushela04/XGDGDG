// Vendix Landing Page - High Performance Dark Theme
// Optimized for mobile: 0 heavy blur filters, 0 scroll lag, pure CSS layouts

import Link from "next/link";
import { GlowEffect } from "@/components/ui/GlowEffect";
import { Package, DollarSign, Smartphone, Shield, Sparkles, Headphones, Check } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Package, DollarSign, Smartphone, Shield, Sparkles, Headphones,
};

export default function LandingPage() {
  return (
    <div className="relative">
      <HeroSection />
      <HowItWorks />
      <Features />
      <CatalogPreview />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
      {/* Background radial gradients — 0 blur filter, 0 GPU strain */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] rounded-full"
          style={{
            left: "10%",
            top: "15%",
            background: "radial-gradient(circle, rgba(200, 255, 0, 0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] rounded-full"
          style={{
            right: "10%",
            bottom: "15%",
            background: "radial-gradient(circle, rgba(200, 255, 0, 0.04) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_70%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center w-full">
        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight md:leading-[1] tracking-tight mb-6 md:mb-8">
          <span className="block text-text">
            Votre stock{" "}
            <span className="text-accent text-glow-accent">illimité</span>
          </span>
          <span className="block text-text">de produits digitaux</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted max-w-3xl mx-auto leading-relaxed mb-8 md:mb-12">
          Débloquez la première banque de produits digitaux sous licence de revente.
          Téléchargez nos ressources clés en main, déployez-les en 3 clics sans aucune
          compétence technique, et conservez 100% de votre chiffre d&apos;affaires.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/inscription"
            className="w-full sm:w-auto text-center px-6 sm:px-8 py-3.5 sm:py-4 bg-accent text-background font-bold rounded-xl hover:bg-accent-dim transition-all glow-accent-strong text-sm sm:text-base"
          >
            Commencer maintenant
          </Link>
          <Link
            href="/catalogue-apercu"
            className="w-full sm:w-auto text-center px-6 sm:px-8 py-3.5 sm:py-4 border border-[#222222] text-text font-medium rounded-xl hover:border-accent/50 hover:bg-accent/5 transition-all text-sm sm:text-base"
          >
            Voir le catalogue
          </Link>
        </div>

        <div className="mt-12 md:mt-20 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
          <div className="text-center p-3 rounded-xl bg-surface/30 border border-[#222222]/40">
            <div className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-accent">100%</div>
            <div className="text-[11px] sm:text-xs text-muted mt-1">Revenus conservés</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-surface/30 border border-[#222222]/40">
            <div className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-accent">3 clics</div>
            <div className="text-[11px] sm:text-xs text-muted mt-1">Pour déployer</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-surface/30 border border-[#222222]/40">
            <div className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-accent">24/7</div>
            <div className="text-[11px] sm:text-xs text-muted mt-1">Accès catalogue</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { number: "01", title: "Abonnez-vous", description: "Choisissez votre plan mensuel ou annuel. Accès immédiat au catalogue complet." },
    { number: "02", title: "Téléchargez", description: "Récupérez les packs ZIP prêts à l'emploi. Ebooks, formations, templates, scripts." },
    { number: "03", title: "Revendez", description: "Personnalisez, rebrandez, déployez. Gardez 100% de vos revenus, partout." },
  ];

  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            Comment ça <span className="text-accent">marche</span>
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto">
            Trois étapes simples pour lancer votre business de produits digitaux
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-[#222222] bg-surface/50 p-6 md:p-8 hover:border-accent/30 transition-colors"
            >
              <div className="font-mono text-xs text-accent font-semibold mb-3">{step.number}</div>
              <h3 className="font-display text-lg md:text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.description}</p>
            </div>
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
    { icon: "Sparkles", title: "Catalogue vivant", description: "Nouveaux produits ajoutés régulièrement. Votre stock s'enrichit en continu." },
    { icon: "Headphones", title: "Support dédié", description: "Équipe disponible pour vous accompagner. Guides, tutoriels, assistance." },
  ];

  return (
    <section className="py-16 md:py-24 relative border-t border-[#222222]/50">
      <GlowEffect className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            Pourquoi <span className="text-accent">Vendix</span>
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour réussir dans la vente de produits digitaux
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-[#222222] bg-surface/50 p-6 md:p-8 hover:border-accent/30 transition-colors group"
            >
              <div className="mb-3 text-accent group-hover:scale-105 transition-transform">
                {(() => {
                  const Icon = iconMap[feature.icon as keyof typeof iconMap];
                  return Icon ? <Icon className="w-7 h-7" /> : null;
                })()}
              </div>
              <h3 className="font-display text-base md:text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CatalogPreview() {
  const products = [
    { title: "Pack Ebooks Business", category: "Ebooks" },
    { title: "Formation Marketing Digital", category: "Formations" },
    { title: "Templates Canva Pro", category: "Templates" },
    { title: "Scripts de Vente", category: "Scripts" },
    { title: "Kit Email Marketing", category: "Templates" },
    { title: "Guide SEO Complet", category: "Ebooks" },
  ];

  return (
    <section className="py-16 md:py-24 border-t border-[#222222]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 md:mb-14 gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-3">
              Aperçu du <span className="text-accent">catalogue</span>
            </h2>
            <p className="text-sm sm:text-base text-muted max-w-xl">
              Découvrez nos produits digitaux prêts à vendre
            </p>
          </div>
          <Link
            href="/catalogue-apercu"
            className="text-sm text-accent hover:text-accent-dim transition-colors whitespace-nowrap"
          >
            Voir tout →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {products.map((product) => (
            <div
              key={product.title}
              className="rounded-2xl border border-[#222222] bg-surface/50 overflow-hidden hover:border-accent/30 transition-colors"
            >
              <div className="aspect-[4/3] bg-surface2 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                <Package className="w-12 h-12 text-accent opacity-20" />
              </div>
              <div className="p-5 md:p-6">
                <div className="text-[10px] md:text-xs text-muted mb-1.5">{product.category}</div>
                <h3 className="font-display text-sm md:text-base font-semibold">
                  {product.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="py-16 md:py-24 relative border-t border-[#222222]/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-3">
            Tarifs <span className="text-accent">simples</span>
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto">
            Un seul plan, deux options de paiement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6 md:p-8">
            <div className="mb-6">
              <h3 className="font-display text-xl md:text-2xl font-semibold mb-1">Mensuel</h3>
              <p className="text-sm text-muted">Flexibilité totale</p>
            </div>
            <div className="mb-6">
              <span className="font-display text-3xl md:text-5xl font-bold">29$</span>
              <span className="text-muted text-sm md:text-base">/mois</span>
            </div>
            <ul className="space-y-2.5 mb-6">
              {[
                "Accès complet au catalogue",
                "Téléchargements illimités",
                "Nouveautés régulières",
                "Licence PLR complète",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/inscription"
              className="block text-center py-3 border border-[#222222] rounded-xl hover:border-accent/50 hover:bg-accent/5 transition-all text-sm font-medium"
            >
              Choisir ce plan
            </Link>
          </div>

          <div className="rounded-2xl border border-accent/30 bg-surface/50 p-6 md:p-8 relative glow-accent">
            <div className="absolute top-4 right-4 px-3 py-1 bg-accent text-background text-[11px] font-bold rounded-full">
              Économisez 40%
            </div>
            <div className="mb-6">
              <h3 className="font-display text-xl md:text-2xl font-semibold mb-1">Annuel</h3>
              <p className="text-sm text-muted">Meilleur rapport qualité-prix</p>
            </div>
            <div className="mb-6">
              <span className="font-display text-3xl md:text-5xl font-bold">19$</span>
              <span className="text-muted text-sm md:text-base">/mois</span>
              <div className="text-xs text-muted mt-1">Facturé 228$/an</div>
            </div>
            <ul className="space-y-2.5 mb-6">
              {[
                "Tout du plan mensuel",
                "Accès prioritaire aux nouveautés",
                "Support dédié",
                "Certificats de licence",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/inscription"
              className="block text-center py-3 bg-accent text-background font-bold rounded-xl hover:bg-accent-dim transition-all text-sm"
            >
              Choisir ce plan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { question: "C'est quoi la licence PLR ?", answer: "PLR (Private Label Rights) vous donne le droit de revendre les produits comme les vôtres. Vous pouvez les modifier, rebrander, et garder 100% des revenus." },
    { question: "Dois-je avoir des compétences techniques ?", answer: "Non. Tous nos produits sont clés en main. Vous téléchargez, personnalisez si vous voulez, et vous vendez." },
    { question: "Comment fonctionne le paiement ?", answer: "Nous acceptons Mobile Money (M-Pesa, Orange Money, Airtel Money) et les cartes bancaires via Chariow." },
    { question: "Puis-je annuler mon abonnement ?", answer: "Oui, à tout moment. Vous gardez l'accès jusqu'à la fin de votre période de facturation." },
  ];

  return (
    <section className="py-16 md:py-24 border-t border-[#222222]/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-3">
            Questions <span className="text-accent">fréquentes</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-[#222222] bg-surface/50 p-5 md:p-6"
            >
              <h3 className="font-display text-base md:text-lg font-semibold mb-2">{faq.question}</h3>
              <p className="text-sm text-muted leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden border-t border-[#222222]/50">
      <GlowEffect className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-4 md:mb-6">
          Prêt à <span className="text-accent text-glow-accent">lancer</span> votre business ?
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-muted max-w-2xl mx-auto mb-8">
          Rejoignez Vendix dès maintenant et accédez instantanément aux produits digitaux prêts à vendre.
        </p>
        <Link
          href="/inscription"
          className="inline-block px-8 py-3.5 sm:py-4 bg-accent text-background font-bold text-sm sm:text-base rounded-xl hover:bg-accent-dim transition-all glow-accent-strong"
        >
          Commencer maintenant
        </Link>
      </div>
    </section>
  );
}
