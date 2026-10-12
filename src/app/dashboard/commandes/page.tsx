import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function CommandesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: payments, error } = await supabase.from("payments")
    .select("id,amount,currency,status,created_at,plans:plan_id(name)")
    .eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
  return <div className="max-w-3xl space-y-6">
    <div><h1 className="font-display text-3xl font-bold">Mes commandes</h1><p className="mt-2 text-sm text-muted">Historique de vos paiements d’abonnement. Vos produits se trouvent dans <Link href="/dashboard/telechargements" className="text-violet-300 underline">mes téléchargements</Link>.</p></div>
    {error ? <p role="alert" className="rounded-2xl border border-red-500/30 p-6 text-sm text-red-300">Impossible de charger vos commandes pour le moment.</p> : !payments?.length ? <div className="rounded-2xl border border-white/10 bg-[#121219] p-8 text-center text-sm text-muted">Aucun paiement enregistré pour le moment.</div> :
    <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-[#121219]">{payments.map((payment) => <div key={payment.id} className="flex items-center justify-between gap-4 p-5"><div><p className="font-medium">{(Array.isArray(payment.plans) ? payment.plans[0] : payment.plans)?.name || "Abonnement Vendix"}</p><p className="mt-1 text-xs text-muted">{new Date(payment.created_at).toLocaleDateString("fr-FR")}</p></div><div className="text-right"><p className="font-semibold">{payment.amount != null ? `${payment.amount} ${payment.currency || ""}` : "—"}</p><p className="text-xs text-muted">{payment.status === "succeeded" ? "Payé" : payment.status === "failed" ? "Échoué" : payment.status === "refunded" ? "Remboursé" : "En cours"}</p></div></div>)}</div>}
  </div>;
}
