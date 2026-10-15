import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifyPulseSignature } from "../src/lib/payments/pulse-signature";
import { parseBillingPulse } from "../src/lib/payments/pulse-event";
import { readLimitedBody } from "../src/lib/payments/read-body";

const raw = Buffer.from('{"event":"successful.sale","url":"https:\\/\\/example.com"}');
const secret = "whsec_test_secret";
const signature = `sha256=${createHmac("sha256", secret).update(raw).digest("hex")}`;

test("accepts Chariow raw-byte HMAC only", () => {
  assert.equal(verifyPulseSignature(raw, signature, secret), true);
  assert.equal(verifyPulseSignature(Buffer.from(raw.toString().replace("\\/", "/")), signature, secret), false);
  assert.equal(verifyPulseSignature(raw, signature, "another secret"), false);
  assert.equal(verifyPulseSignature(raw, signature.slice(7), secret), false);
  assert.equal(verifyPulseSignature(raw, "sha256=bad", secret), false);
  assert.equal(verifyPulseSignature(raw, signature, undefined), false);
});

const event = {
  event: "successful.sale",
  sale: {
    id: "sal_abc123", status: "completed",
    amount: { value: 29, currency: "USD" },
    custom_metadata: { order_ref: "24377256-a33b-46cc-abd5-a13d9122af76" },
  },
  product: { id: "prd_vendix_monthly" },
  customer: { email: "member@example.com" },
};

test("accepts a complete paid sale", () => {
  assert.equal(parseBillingPulse(event, "successful.sale")?.sale.id, "sal_abc123");
});
test("rejects forged/mislabelled sale statuses and event headers", () => {
  assert.equal(parseBillingPulse(event, "failed.sale"), null);
  assert.equal(parseBillingPulse({ ...event, sale: { ...event.sale, status: "awaiting_payment" } }, "successful.sale"), null);
  assert.equal(parseBillingPulse({ ...event, event: "failed.sale" }, "failed.sale"), null);
});
test("rejects a paid sale without checkout binding, amount or customer", () => {
  assert.equal(parseBillingPulse({ ...event, sale: { ...event.sale, custom_metadata: {} } }, "successful.sale"), null);
  assert.equal(parseBillingPulse({ ...event, sale: { ...event.sale, amount: { value: -1, currency: "USD" } } }, "successful.sale"), null);
  assert.equal(parseBillingPulse({ ...event, customer: {} }, "successful.sale"), null);
});

test("caps public request bodies, including chunked bodies", async () => {
  assert.equal((await readLimitedBody(new Request("https://example.com", { method: "POST", body: "okay" }), 4))?.toString(), "okay");
  assert.equal(await readLimitedBody(new Request("https://example.com", { method: "POST", body: "too long" }), 4), null);
});
