import Link from "next/link";
export default function EspionnagePage() {
  return <div className="max-w-2xl space-y-4"><h1 className="font-display text-3xl font-bold">Espionnage</h1><p className="text-muted">Cet outil d’analyse n’est pas encore disponible dans Vendix. Aucune donnée de marché ne sera inventée.</p><Link href="/dashboard/catalogue" className="inline-block rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-background hover:bg-accent-dim">Explorer les produits disponibles</Link></div>;
}
