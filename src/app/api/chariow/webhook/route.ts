// Chariow Pulse receiver: verify raw bytes, validate the event, commit atomically in Postgres.
import { NextRequest, NextResponse } from "next/server";
import { parseBillingPulse } from "@/lib/payments/pulse-event";
import { readLimitedBody } from "@/lib/payments/read-body";
import { createAdminClient } from "@/lib/supabase/admin";
import { chariow } from "@/lib/payments/chariow";

export async function POST(req: NextRequest) {
  const body = await readLimitedBody(req, 256_000);
  if (!body) return NextResponse.json({ error: "Payload trop volumineux" }, { status: 413 });
  if (!chariow.verifyPulseSignature(body, req.headers.get("x-chariow-signature"))) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
  }
  const deliveryId = req.headers.get("x-pulse-delivery-id");
  const headerEvent = req.headers.get("x-pulse-event");
  if (!deliveryId || !/^[a-zA-Z0-9_-]{6,200}$/.test(deliveryId) || !headerEvent) {
    return NextResponse.json({ error: "En-têtes Pulse manquants" }, { status: 400 });
  }
  let payload: unknown;
  try { payload = JSON.parse(body.toString("utf8")); }
  catch { return NextResponse.json({ error: "JSON invalide" }, { status: 400 }); }
  if (!payload || typeof payload !== "object" || !("event" in payload) || payload.event !== headerEvent) {
    return NextResponse.json({ error: "Événement incohérent" }, { status: 400 });
  }
  // Signed test pulses are samples, not payments. Never grant access from them.
  if (deliveryId.startsWith("test_") ||
    ("sale" in payload && typeof payload.sale === "object" && payload.sale !== null &&
      "id" in payload.sale && typeof payload.sale.id === "string" && payload.sale.id.startsWith("test_"))) {
    return NextResponse.json({ received: true, test: true });
  }
  if (headerEvent !== "successful.sale" && headerEvent !== "failed.sale") {
    return NextResponse.json({ received: true, ignored: true });
  }
  const event = parseBillingPulse(payload, headerEvent);
  if (!event) return NextResponse.json({ error: "Vente invalide" }, { status: 400 });
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("process_chariow_sale", {
    p_delivery_id: deliveryId,
    p_intent_id: event.sale.custom_metadata.order_ref,
    p_sale_id: event.sale.id,
    p_product_id: event.product.id,
    p_customer_email: event.customer.email,
    p_amount: event.sale.amount.value,
    p_currency: event.sale.amount.currency,
    p_event: event.event,
    p_payload: event,
  });
  if (error) {
    console.error("[chariow pulse] Transaction rejetée:", error.code, error.message);
    return NextResponse.json({ error: "Traitement non confirmé, réessai nécessaire" }, { status: 500 });
  }
  return NextResponse.json({ received: true, result: data });
}
