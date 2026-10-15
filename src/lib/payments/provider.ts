import "server-only";

// Period-fixed Chariow checkout. Renewals require another verified sale.
export interface CheckoutOptions {
  productId: string;
  userEmail: string;
  fullName?: string;
  countryCode: string;
  phoneNumber: string;
  orderRef: string;
  currency: string;
  redirectUrl: string;
}

export interface CheckoutResult {
  checkoutUrl: string;
  saleId: string;
}

export interface PaymentProvider {
  name: string;
  createCheckout(options: CheckoutOptions): Promise<CheckoutResult>;
  verifyPulseSignature(rawBody: Buffer, signature: string | null): boolean;
}
