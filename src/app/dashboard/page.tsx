import { serverNow } from "@/lib/server-clock";
import Link from "next/link";
import { ArrowRight, Download, Package, Sparkles, CreditCard, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { checkUserQuota } from "@/lib/quota";
import { ProductCard } from "@/components/catalogue/ProductCard";
import type { ProductItem } from "@/components/catalogue/ProductDialog";

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [subscriptionResult, quota, downloadsResult, productsResult, favoritesResult, downloadCountResult] = await Promise.all([
    supabase.from("subscriptions").select("status,current_period_end,plans:plan_id(name)").eq("user_id", user.id).maybeSingle(),
    checkUserQuota(user.id),
    supabase.from("downloads").select("id,downloaded_at,products:product_id(title)").eq("user_id", user.id).order("downloaded_at", { ascending: false }).limit(4),
    supabase.from("products").select("id,title,slug,description,required_tools,thumbnail_url,file_size_bytes,file_list,created_at,published_at,categories:category_id(name)").eq("is_published", true).order("published_at", { ascending: false }).limit(4),
    supabase.from("favorites").select("product_id").eq("user_id", user.id),
    supabase.from("downloads").select("id", { count: "exact", head: true }).eq("user_id", user.id),
  ]);
  const sub = subscriptionResult.data;
  const isSubscriber = sub?.status === "active" && !!sub.current_period_end && new Date(sub.current_period_end).getTime() > serverNow();
  const favoriteIds = new Set(favoritesResult.data?.map((f) => f.product_id) || []);
  const products: ProductItem[] = (productsResult.data || []).map((p) => ({
    id: p.id, title: p.title, slug: p.slug, description: p.description,
    category_name: (Array.isArray(p.categories) ? p.categories[0] : p.categories)?.name,
    required_tools: p.required_tools || [], thumbnail_url: p.thumbnail_url,
    file_size_bytes: p.file_size_bytes, file_list: p.file_list || [],
    created_at: p.published_at || p.created_at, is_favorite: favoriteIds.has(p.id),
  }));
  const plan = Array.isArray(sub?.plans) ? sub.plans[0] : sub?.plans;
  const downloads = downloadsResult.data || [];

  return (
    <div className="space-y-9">
      <div><p className="text-sm text-muted">Voici l’essentiel de votre espace Vendix.</p><h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Vue d’ensemble</h1></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/dashboard/abonnement" className="rounded-2xl border border-white/10 bg-[#121219] p-5 transition-colors hover:border-violet-400/40">
          <div className="flex items-center justify-between"><span className="text-sm text-muted">Mon abonnement</span><CreditCard className="h-5 w-5 text-violet-300" /></div>
          <p className="mt-6 font-display text-2xl font-bold">{isSubscriber ? plan?.name || "VIP" : "Inactif"}</p>
          <p className="mt-1 text-xs text-muted">{isSubscriber ? "Accès actif au catalogue" : "Découvrez les offres Vendix"}</p>
        </Link>
        <Link href="/dashboard/telechargements" className="rounded-2xl border border-white/10 bg-[#121219] p-5 transition-colors hover:border-violet-400/40">
          <div className="flex items-center justify-between"><span className="text-sm text-muted">Ce mois-ci</span><Download className="h-5 w-5 text-violet-300" /></div>
          <p className="mt-6 font-display text-2xl font-bold">{quota.used} <span className="text-sm font-normal text-muted">/ {quota.limit}</span></p>
          <p className="mt-1 text-xs text-muted">Produits téléchargés sur le quota</p>
        </Link>
        <Link href="/dashboard/commandes" className="rounded-2xl border border-white/10 bg-[#121219] p-5 transition-colors hover:border-violet-400/40">
          <div className="flex items-center justify-between"><span className="text-sm text-muted">Mes téléchargements</span><ShoppingBag className="h-5 w-5 text-violet-300" /></div>
          <p className="mt-6 font-display text-2xl font-bold">{downloadCountResult.count ?? 0}</p>
          <p className="mt-1 text-xs text-muted">Archives récupérées</p>
        </Link>
      </div>
      <section className="rounded-2xl border border-white/10 bg-[#121219]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 p-5"><div><h2 className="font-display text-lg font-semibold">Mes derniers téléchargements</h2><p className="mt-1 text-xs text-muted">Vos packs récemment récupérés</p></div><Link href="/dashboard/telechargements" className="inline-flex shrink-0 items-center gap-1 text-xs text-violet-300 hover:text-white">Voir tout <ArrowRight className="h-4 w-4" /></Link></div>
        {downloads.length === 0 ? <div className="p-8 text-center text-sm text-muted"><Package className="mx-auto mb-3 h-8 w-8 opacity-50" />Aucun téléchargement pour le moment. <Link href="/dashboard/catalogue" className="text-violet-300 underline">Explorer le catalogue</Link></div> :
          <div className="divide-y divide-white/5">{downloads.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 px-5 py-4"><span className="truncate text-sm font-medium">{(Array.isArray(item.products) ? item.products[0] : item.products)?.title || "Produit archivé"}</span><time className="shrink-0 text-xs text-muted">{new Date(item.downloaded_at).toLocaleDateString("fr-FR")}</time></div>)}</div>}
      </section>
      <section>
        <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="flex items-center gap-2 font-display text-lg font-semibold"><Sparkles className="h-5 w-5 text-violet-300" />Nouveautés</h2><p className="mt-1 text-xs text-muted">Les derniers produits publiés par Vendix</p></div><Link href="/dashboard/nouveautes" className="inline-flex items-center gap-1 text-xs text-violet-300 hover:text-white">Voir tout <ArrowRight className="h-4 w-4" /></Link></div>
        {products.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{products.map((p) => <ProductCard key={p.id} product={p} isSubscriber={isSubscriber} />)}</div> : <div className="rounded-2xl border border-white/10 bg-[#121219] p-8 text-center text-sm text-muted">Aucun produit publié pour le moment.</div>}
      </section>
    </div>
  );
}
