// Chariow checkout & signed Pulses. Contract: https://chariow.dev/en/guides/pulse-security
import "server-only";
import { verifyPulseSignature } from "./pulse-signature";
import type { PaymentProvider, CheckoutOptions, CheckoutResult } from "./provider";

export class ChariowProvider implements PaymentProvider {
  name = "chariow";

  async createCheckout(options: CheckoutOptions): Promise<CheckoutResult> {
    const apiKey = process.env.CHARIOW_API_KEY;
    if (!apiKey) throw new Error("Configuration Chariow absente");
    const names = (options.fullName || options.userEmail.split("@")[0] || "Membre").trim().split(/\s+/);
    const firstName = names[0]?.slice(0, 50) || "Membre";
    const lastName = names.slice(1).join(" ").slice(0, 50) || "Vendix";

    const res = await fetch("https://api.chariow.com/v1/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        product_id: options.productId,
        email: options.userEmail,
        first_name: firstName,
        last_name: lastName,
        phone: { number: options.phoneNumber, country_code: options.countryCode },
        payment_currency: options.currency,
        redirect_url: options.redirectUrl,
        custom_metadata: { order_ref: options.orderRef },
      }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Checkout Chariow indisponible (${res.status})`);
    const payload: unknown = await res.json();
    if (!payload || typeof payload !== "object" || !("data" in payload)) throw new Error("Réponse Chariow invalide");
    const data = payload.data as { step?: string; purchase?: { id?: string }; payment?: { checkout_url?: string } };
    // Never interpret a redirect or a free/completed step as proof of payment.
    if (data.step !== "payment" || !data.purchase?.id || !data.payment?.checkout_url) {
      throw new Error("Aucune session de paiement valide créée par Chariow");
    }
    const url = new URL(data.payment.checkout_url);
    if (url.protocol !== "https:") throw new Error("URL de paiement non sécurisée");
    return { checkoutUrl: url.toString(), saleId: data.purchase.id };
  }

  verifyPulseSignature(rawBody: Buffer, signature: string | null): boolean {
    return verifyPulseSignature(rawBody, signature, process.env.CHARIOW_PULSE_SECRET);
  }
}

export const chariow = new ChariowProvider();
