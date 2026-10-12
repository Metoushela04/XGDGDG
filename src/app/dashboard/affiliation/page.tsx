import Link from "next/link";
export default function AffiliationPage() {
  return <div className="max-w-2xl space-y-4"><h1 className="font-display text-3xl font-bold">Affiliation</h1><p className="text-muted">Le programme d’affiliation est en préparation. Les liens de parrainage et commissions ne sont pas encore actifs.</p><Link href="/dashboard/support" className="inline-block rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white">Contacter le support</Link></div>;
}
