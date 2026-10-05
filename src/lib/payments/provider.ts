// Interface d'abstraction des paiements (PRD §7.5)
import "server-only";

export interface CheckoutOptions {
  planId: string;
  planCode: "monthly" | "yearly";
  planName: string;
  amount: number;
  currency: string;
  userId: string;
  userEmail: string;
  fullName?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResult {
  checkoutUrl: string;
  sessionId?: string;
}

export interface WebhookResult {
  valid: boolean;
  event?: {
    id: string;
    type: "payment.succeeded" | "payment.failed" | "subscription.canceled" | "subscription.renewed" | string;
    userId?: string;
    planId?: string;
    chariowPaymentId?: string;
    chariowSubId?: string;
    amount?: number;
    currency?: string;
    currentPeriodEnd?: string;
    rawPayload: unknown;
  };
  error?: string;
}

export interface PaymentProvider {
  name: string;
  createCheckout(options: CheckoutOptions): Promise<CheckoutResult>;
  verifyAndParseWebhook(rawBody: string, signature: string | null): Promise<WebhookResult>;
}
