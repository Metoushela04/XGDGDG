// Gestion de l'abonnement membre Vendix (PRD §7.5)
import { createClient } from "@/lib/supabase/server";
import { CreditCard, Check, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import { SubscribeButton } from "@/components/payments/SubscribeButton";

export const revalidate = 0;

export default async function AbonnementPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Récupérer l'abonnement et le plan
  const { data: sub } = await supabase
    .from("subscriptions")
    .select(`
      status,
      current_period_end,
      cancel_at_period_end,
      plan_id,
      plans:plan_id (id, code, name, price_amount, currency, duration_days)
    `)
    .eq("user_id", user.id)
    .maybeSingle();

  // Récupérer les plans disponibles
  const { data: availablePlans } = await supabase
    .from("plans")
    .select("id, code, name, price_amount, currency, duration_days")
    .eq("is_active", true)
    .order("price_amount");

  const isSubActive =
    sub?.status === "active" &&
    (!sub.current_period_end || new Date(sub.current_period_end) > new Date());

  const daysRemaining = sub?.current_period_end
    ? Math.max(
        0,
        Math.ceil(
          (new Date(sub.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  const planInfo = (sub as any)?.plans;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">
          Mon <span className="text-accent">abonnement</span>
        </h1>
        <p className="text-sm text-muted">Gérez votre plan VIP et votre facturation</p>
      </div>

      {status === "success" && (
        <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-3">
          <Sparkles className="w-5 h-5 shrink-0" />
          <div>
            <div className="font-bold">Paiement validé avec succès !</div>
            <div className="text-xs text-green-300/80">
              Votre accès VIP est actif. Vous pouvez dès maintenant explorer le catalogue et télécharger sans limite.
            </div>
          </div>
        </div>
      )}

      {/* État de l'abonnement actuel */}
      <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#222222]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-surface2 border border-[#222222] flex items-center justify-center text-accent">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-muted font-medium">Statut de votre compte</div>
              <div className="font-display font-bold text-lg sm:text-xl text-text flex items-center gap-2">
                {isSubActive ? (
                  <>
                    <span>VIP Actif — {planInfo?.name || "Pass VIP"}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  </>
                ) : (
                  <span className="text-muted">Aucun abonnement actif</span>
                )}
              </div>
            </div>
          </div>

          {isSubActive && (
            <div className="text-right">
              <div className="text-xs text-muted">Temps restant</div>
              <div className="font-display font-bold text-lg text-accent">
                {daysRemaining} jour{daysRemaining > 1 ? "s" : ""}
              </div>
            </div>
          )}
        </div>

        {isSubActive ? (
          <div className="pt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 text-xs text-muted">
              <div>
                <span className="font-medium text-text">Prochain renouvellement / fin :</span>{" "}
                {sub?.current_period_end
                  ? new Date(sub.current_period_end).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Illimité"}
              </div>
              <div>
                <span className="font-medium text-text">Mode de facturation :</span> Chariow
                (Mobile Money / Carte bancaire)
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/dashboard/catalogue"
                className="inline-block px-6 py-2.5 bg-accent text-background font-bold text-xs rounded-xl hover:bg-accent-dim transition-all"
              >
                Accéder au catalogue complet
              </Link>
            </div>
          </div>
        ) : (
          <div className="pt-6 space-y-4">
            <p className="text-sm text-muted">
              Abonnez-vous à Vendix pour débloquer l&apos;accès immédiat à l&apos;intégralité du catalogue,
              télécharger sans limite et revendre les produits avec 100% des bénéfices pour vous.
            </p>

            {/* Plans de souscription */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {availablePlans?.map((plan) => {
                const isYearly = plan.code === "yearly";
                return (
                  <div
                    key={plan.id}
                    className={`rounded-xl border p-5 flex flex-col justify-between space-y-4 ${
                      isYearly
                        ? "border-accent/40 bg-accent/5 relative"
                        : "border-[#222222] bg-surface2/50"
                    }`}
                  >
                    {isYearly && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 bg-accent text-background text-[10px] font-bold rounded-full">
                        Économisez 40%
                      </span>
                    )}
                    <div>
                      <div className="font-display font-bold text-base text-text">{plan.name}</div>
                      <div className="font-display text-2xl font-bold text-accent mt-2">
                        {isYearly ? "19$" : `${plan.price_amount}$`}
                        <span className="text-xs text-muted font-normal">/mois</span>
                      </div>
                      <p className="text-[11px] text-muted mt-1">
                        {isYearly
                          ? "Facturé 228$/an en une fois. Mobile Money & Carte."
                          : "Paiement mensuel sans engagement."}
                      </p>
                    </div>

                    <SubscribeButton planId={plan.id} label={`Choisir le plan ${plan.name}`} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Avantages inclus */}
      <div>
        <h2 className="font-display font-semibold text-lg mb-4">Avantages VIP inclus</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "Téléchargements mensuels",
            "Droits de revente PLR",
            "Fichiers sources inclus",
            "Certificats nominatifs",
          ].map((item) => (
            <div
              key={item}
              className="p-4 rounded-xl border border-[#222222] bg-surface/50 flex items-center gap-2.5 text-xs text-text"
            >
              <Check className="w-4 h-4 text-accent shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
