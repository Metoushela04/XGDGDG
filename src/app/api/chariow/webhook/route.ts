// Réception et traitement sécurisé des webhooks Chariow (PRD §7.5, §8, §10)
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { chariow } from "@/lib/payments/chariow";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature =
    req.headers.get("x-chariow-signature") ||
    req.headers.get("x-signature") ||
    req.headers.get("chariow-signature");

  // 1. Vérification de la signature
  const parsedWebhook = await chariow.verifyAndParseWebhook(rawBody, signature);
  if (!parsedWebhook.valid || !parsedWebhook.event) {
    console.error("Signature de webhook Chariow invalide:", parsedWebhook.error);
    return NextResponse.json(
      { error: parsedWebhook.error || "Signature invalide" },
      { status: 400 }
    );
  }

  const { event } = parsedWebhook;
  const adminClient = createAdminClient();

  // 2. Idempotence : vérifier si l'événement a déjà été traité (PRD §7.5, Critère #5)
  const { data: existingEvent } = await adminClient
    .from("webhook_events")
    .select("id")
    .eq("id", event.id)
    .single();

  if (existingEvent) {
    return NextResponse.json({ message: "Événement déjà traité (idempotent)" }, { status: 200 });
  }

  const userId = event.userId;
  if (!userId) {
    console.warn("Événement webhook reçu sans user_id dans les métadonnées:", event.id);
  }

  try {
    // 3. Traitement selon le type d'événement
    if (event.type === "payment.succeeded" || event.type === "subscription.renewed" || event.type === "order.paid") {
      if (userId) {
        // Déterminer la durée du plan (par défaut 30 jours si mensuel, 365 si annuel)
        let durationDays = 30;
        let planId = event.planId;

        if (planId) {
          const { data: plan } = await adminClient
            .from("plans")
            .select("id, duration_days")
            .eq("id", planId)
            .single();

          if (plan) {
            durationDays = plan.duration_days || 30;
          }
        }

        // Récupérer l'abonnement actuel pour prolonger si déjà actif
        const { data: currentSub } = await adminClient
          .from("subscriptions")
          .select("current_period_end, status")
          .eq("user_id", userId)
          .single();

        const now = new Date();
        let baseDate = now;

        if (
          currentSub?.current_period_end &&
          currentSub.status === "active" &&
          new Date(currentSub.current_period_end) > now
        ) {
          baseDate = new Date(currentSub.current_period_end);
        }

        const newPeriodEnd = new Date(baseDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

        // Mise à jour de l'abonnement via service_role
        await adminClient
          .from("subscriptions")
          .upsert({
            user_id: userId,
            plan_id: planId || null,
            status: "active",
            chariow_sub_id: event.chariowSubId || event.chariowPaymentId || null,
            current_period_end: newPeriodEnd.toISOString(),
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id" });

        // Enregistrement de la transaction de paiement
        await adminClient.from("payments").insert({
          user_id: userId,
          plan_id: planId || null,
          chariow_payment_id: event.chariowPaymentId || event.id,
          amount: event.amount ? Number(event.amount) : null,
          currency: event.currency || "USD",
          status: "succeeded",
        });

        // Notification in-app pour le membre
        await adminClient.from("notifications").insert({
          user_id: userId,
          title: "Abonnement VIP activé",
          body: "Votre abonnement Vendix est maintenant actif. Téléchargez vos produits dès aujourd'hui !",
          link: "/dashboard/catalogue",
        });
      }
    } else if (event.type === "subscription.canceled") {
      if (userId) {
        await adminClient
          .from("subscriptions")
          .update({
            cancel_at_period_end: true,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      }
    } else if (event.type === "payment.failed") {
      if (userId) {
        await adminClient.from("payments").insert({
          user_id: userId,
          plan_id: event.planId || null,
          chariow_payment_id: event.chariowPaymentId || event.id,
          amount: event.amount ? Number(event.amount) : null,
          currency: event.currency || "USD",
          status: "failed",
        });

        await adminClient.from("notifications").insert({
          user_id: userId,
          title: "Échec de paiement",
          body: "Le renouvellement de votre abonnement a échoué. Veuillez mettre à jour votre moyen de paiement.",
          link: "/dashboard/abonnement",
        });
      }
    }

    // 4. Enregistrement dans webhook_events pour garantir l'idempotence
    await adminClient.from("webhook_events").insert({
      id: event.id,
      provider: "chariow",
      event_type: event.type,
      payload: event.rawPayload as any,
    });

    return NextResponse.json({ success: true, processedEventId: event.id });
  } catch (err: any) {
    console.error("Erreur exécution webhook Chariow:", err);
    return NextResponse.json(
      { error: "Erreur lors du traitement de l'événement" },
      { status: 500 }
    );
  }
}
