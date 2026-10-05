// Route de création de session de paiement Chariow (PRD §7.5, §9)
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { chariow } from "@/lib/payments/chariow";

const checkoutSchema = z.object({
  planId: z.string().uuid("Identifiant de plan invalide"),
});

export async function POST(req: NextRequest) {
  // 1. Authentification
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Vous devez être connecté pour vous abonner", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  // 2. Validation
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Format JSON invalide", code: "INVALID_JSON" },
      { status: 400 }
    );
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Données invalides", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const { planId } = parsed.data;

  // 3. Récupération du plan actif
  const adminClient = createAdminClient();
  const { data: plan, error: planError } = await adminClient
    .from("plans")
    .select("id, code, name, price_amount, currency, duration_days, is_active")
    .eq("id", planId)
    .single();

  if (planError || !plan || !plan.is_active) {
    return NextResponse.json(
      { error: "Plan d'abonnement introuvable ou inactif", code: "PLAN_NOT_FOUND" },
      { status: 404 }
    );
  }

  // Récupérer le nom du profil
  const { data: profile } = await adminClient
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const result = await chariow.createCheckout({
      planId: plan.id,
      planCode: plan.code as "monthly" | "yearly",
      planName: plan.name,
      amount: Number(plan.price_amount),
      currency: plan.currency || "USD",
      userId: user.id,
      userEmail: user.email || "",
      fullName: profile?.full_name || undefined,
      successUrl: `${appUrl}/dashboard/abonnement?status=success`,
      cancelUrl: `${appUrl}/tarifs?status=canceled`,
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: result.checkoutUrl,
    });
  } catch (err: any) {
    console.error("Erreur checkout Chariow:", err);
    return NextResponse.json(
      { error: err.message || "Erreur lors de la création de la session de paiement", code: "PAYMENT_ERROR" },
      { status: 500 }
    );
  }
}
