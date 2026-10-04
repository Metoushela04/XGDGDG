// Empêche les redirections ouvertes (open redirect) via ?next=...
// On n'accepte que des chemins internes : "/quelque-chose", jamais "//site.com" ni "https://...".
export function safeNext(value: string | null | undefined, fallback = "/dashboard"): string {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}
