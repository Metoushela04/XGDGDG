import crypto from "node:crypto";

/** Chariow Pulse v1: HMAC-SHA256 of the raw request bytes, no JSON re-encoding. */
export function verifyPulseSignature(rawBody: Buffer, signature: string | null, secret: string | undefined): boolean {
  if (!secret || !signature || !/^sha256=[a-f0-9]{64}$/.test(signature)) return false;
  const expected = `sha256=${crypto.createHmac("sha256", secret).update(rawBody).digest("hex")}`;
  const received = Buffer.from(signature, "ascii");
  const signed = Buffer.from(expected, "ascii");
  return received.length === signed.length && crypto.timingSafeEqual(received, signed);
}
