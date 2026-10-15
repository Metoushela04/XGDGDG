// A checkout is only a payment attempt; access is granted by a verified Pulse.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { chariow } from "@/lib/payments/chariow";
import { rateLimit } from "@/lib/rate-limit";
import { readLimitedBody } from "@/lib/payments/read-body";

const schema = z.object({
  planId: z.string().uuid(),
  phoneNumber: z.string().regex(/^\d{6,15}$/),
  countryCode: z.string().regex(/^[A-Z]{2}$/),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || !user.email_confirmed_at || !user.email) {
    return NextResponse.json({ error: "Connexion et e-mail vérifié requis" }, { status: 401 });
  }
  if (!rateLimit(`checkout:${user.id}`, 5, 10 * 60_000).ok) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez dans quelques minutes." }, { status: 429 });
  }
  const raw = await readLimitedBody(req, 4096);
  if (!raw) return NextResponse.json({ error: "Requête trop volumineuse" }, { status: 413 });
  let body: unknown;
  try { body = JSON.parse(raw.toString("utf8")); }
  catch { return NextResponse.json({ error: "JSON invalide" }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Plan ou numéro de téléphone invalide" }, { status: 400 });
  if (!process.env.CHARIOW_API_KEY || !process.env.CHARIOW_PULSE_SECRET) {
    return NextResponse.json({ error: "Paiement temporairement indisponible" }, { status: 503 });
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl || (process.env.NODE_ENV === "production" && !appUrl.startsWith("https://"))) {
    return NextResponse.json({ error: "URL publique du site non configurée" }, { status: 503 });
  }

  const admin = createAdminClient();
  const [{ data: profile, error: profileError }, { data: plan, error: planError }] = await Promise.all([
    admin.from("profiles").select("full_name, is_suspended").eq("id", user.id).single(),
    admin.from("plans").select("id,code,name,currency,is_active,chariow_product_id")
      .eq("id", parsed.data.planId).single(),
  ]);
  if (profileError || !profile || profile.is_suspended) {
    return NextResponse.json({ error: "Compte non autorisé" }, { status: 403 });
  }
  if (planError || !plan || !plan.is_active || !plan.chariow_product_id) {
    return NextResponse.json({ error: "Plan indisponible ou non configuré chez Chariow" }, { status: 503 });
  }

  const { data: intent, error: intentError } = await admin.from("checkout_intents")
    .insert({ user_id: user.id, plan_id: plan.id }).select("id").single();
  if (intentError || !intent) {
    return NextResponse.json({ error: "Impossible de préparer le paiement" }, { status: 503 });
  }
  try {
    const result = await chariow.createCheckout({
      productId: plan.chariow_product_id,
      userEmail: user.email,
      fullName: profile.full_name || undefined,
      phoneNumber: parsed.data.phoneNumber,
      countryCode: parsed.data.countryCode,
      currency: plan.currency,
      orderRef: intent.id,
      redirectUrl: `${appUrl.replace(/\/$/, "")}/dashboard/abonnement?status=pending&sale={sale_id}`,
    });
    const { error } = await admin.from("checkout_intents").update({ chariow_sale_id: result.saleId })
      .eq("id", intent.id).is("chariow_sale_id", null);
    // An early webhook can already have filled the sale id; the verified event stays authoritative.
    if (error) throw error;
    return NextResponse.json({ checkoutUrl: result.checkoutUrl }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[chariow checkout]", err);
    return NextResponse.json({ error: "Paiement indisponible. Aucun accès n’a été activé." }, { status: 502 });
  }
}
