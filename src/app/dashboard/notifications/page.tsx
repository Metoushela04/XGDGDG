import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const revalidate = 0;
export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: notifications, error } = await supabase.from("notifications")
    .select("id,title,body,link,created_at,is_read").eq("user_id", user.id)
    .order("created_at", { ascending: false }).limit(100);
  return <div className="max-w-3xl space-y-6"><div><h1 className="font-display text-3xl font-bold">Notifications</h1><p className="mt-2 text-sm text-muted">Publications et informations importantes pour votre compte.</p></div>
    {error ? <p role="alert" className="text-sm text-red-300">Impossible de charger vos notifications.</p> : !notifications?.length ? <p className="rounded-2xl border border-white/10 bg-[#121219] p-8 text-center text-muted">Aucune notification pour le moment.</p> : <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-[#121219]">{notifications.map((n) => <div key={n.id} className={`p-5 ${n.is_read ? "" : "bg-violet-500/5"}`}><div className="flex items-center justify-between gap-3"><h2 className="font-semibold">{n.title}</h2><time className="text-xs text-muted">{new Date(n.created_at).toLocaleDateString("fr-FR")}</time></div>{n.body && <p className="mt-1 text-sm text-muted">{n.body}</p>}{n.link?.startsWith("/dashboard/") && <Link className="mt-2 inline-block text-xs text-violet-300 hover:underline" href={n.link}>Voir la page →</Link>}</div>)}</div>}
  </div>;
}
