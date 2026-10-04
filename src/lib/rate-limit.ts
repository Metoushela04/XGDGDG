// Limiteur de débit en mémoire (fenêtre fixe).
// ⚠️ Limite connue : l'état est propre à chaque instance serverless (Vercel). C'est un frein
// de premier niveau, pas une garantie. Pour une protection globale, remplacer le stockage par
// Upstash Redis / Vercel KV en gardant la même signature (voir DECISIONS.md).
import "server-only";

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();

  if (store.size > 5000) {
    for (const [k, v] of store) if (v.resetAt <= now) store.delete(k);
  }

  const entry = store.get(key);
  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true as const, retryAfterSec: 0 };
  }

  entry.count += 1;
  if (entry.count > limit) {
    return { ok: false as const, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true as const, retryAfterSec: 0 };
}
