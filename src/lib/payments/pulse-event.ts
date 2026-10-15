import { z } from "zod";

const pulseSchema = z.object({
  event: z.enum(["successful.sale", "failed.sale"]),
  sale: z.object({
    id: z.string().regex(/^sal_[a-zA-Z0-9_-]+$/),
    status: z.string(),
    amount: z.object({ value: z.number().nonnegative(), currency: z.string().length(3) }),
    custom_metadata: z.object({ order_ref: z.string().uuid() }),
  }),
  product: z.object({ id: z.string().min(1) }),
  customer: z.object({ email: z.email() }),
}).passthrough();

export function parseBillingPulse(payload: unknown, headerEvent: string) {
  const result = pulseSchema.safeParse(payload);
  if (!result.success || result.data.event !== headerEvent) return null;
  if (result.data.event === "successful.sale" && result.data.sale.status !== "completed") return null;
  if (result.data.event === "failed.sale" && result.data.sale.status !== "failed") return null;
  return result.data;
}
