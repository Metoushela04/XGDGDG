// Accueil du Dashboard membre connecté à Supabase (PRD §5, §7.1)
import { createClient } from "@/lib/supabase/server";
import { checkUserQuota } from "@/lib/quota";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { ProductItem } from "@/components/catalogue/ProductDialog";
import {
  CreditCard,
  Download,
  Heart,
  Package,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Profil et abonnement
  const [
    { data: profile },
    { data: sub },
    { count: totalFavorites },
    quota,
  ] = await Promise.all([
    supabase.from("profiles").select("full_name, role").eq("id", user.id).single(),
    supabase.from("subscriptions").select("status, current_period_end, plans:plan_id(name)").eq("user_id", user.id).maybeSingle(),
    supabase.from("favorites").select("product_id", { count: "exact", head: true }).eq("user_id", user.id),
    checkUserQuota(user.id),
  ]);

  const isSubscriber =
    sub?.status === "active" &&
    (!sub.current_period_end || new Date(sub.current_period_end) > new Date());

  // 2. Favoris de l'utilisateur pour les coeurs
  const { data: favs } = await supabase
    .from("favorites")
    .select("product_id")
    .eq("user_id", user.id);
  const userFavoriteIds = new Set(favs?.map((f) => f.product_id) || []);

  // 3. Les 4 derniers produits publiés
  const { data: recentProductsRaw } = await supabase
    .from("products")
    .select(`
      id,
      title,
      slug,
      description,
      required_tools,
      thumbnail_url,
      file_size_bytes,
      file_list,
      created_at,
      categories:category_id (name)
    `)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(4);

  const recentProducts: ProductItem[] = (recentProductsRaw || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    category_name: p.categories?.name,
    required_tools: p.required_tools || [],
    thumbnail_url: p.thumbnail_url,
    file_size_bytes: p.file_size_bytes,
    file_list: p.file_list || [],
    created_at: p.created_at,
    is_favorite: userFavoriteIds.has(p.id),
  }));

  const remainingDownloads = Math.max(0, quota.limit - quota.used);

  return (
    <div className="space-y-8">
      {/* Header de bienvenue */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            Bonjour,{" "}
            <span className="text-accent">
              {profile?.full_name ? profile.full_name.split(" ")[0] : "Membre"}
            </span>
          </h1>
          <p className="text-sm text-muted">
            Bienvenue sur votre espace Vendix. Accédez à vos ressources PLR prêtes à vendre.
          </p>
        </div>

        {!isSubscriber && (
          <Link
            href="/tarifs"
            className="flex items-center gap-2 px-5 py-2.5 bg-accent text-background font-bold text-xs rounded-xl hover:bg-accent-dim transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Activer l&apos;accès VIP</span>
          </Link>
        )}
      </div>

      {/* Cartes métriques réelles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Statut abonnement */}
        <Link
          href="/dashboard/abonnement"
          className="p-5 rounded-2xl border border-[#222222] bg-surface/50 hover:border-accent/40 transition-colors group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            {isSubscriber ? (
              <span className="px-2.5 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-semibold rounded-full border border-green-500/20">
                Actif
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-surface2 text-muted text-[10px] font-medium rounded-full">
                Inactif
              </span>
            )}
          </div>
          <div className="font-display text-xl font-bold mb-1">
            {isSubscriber ? (sub as any)?.plans?.name || "VIP" : "Aucun plan"}
          </div>
          <div className="text-xs text-muted">Statut de votre compte</div>
        </Link>

        {/* Quota téléchargements */}
        <Link
          href="/dashboard/telechargements"
          className="p-5 rounded-2xl border border-[#222222] bg-surface/50 hover:border-accent/40 transition-colors group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-muted">
              {remainingDownloads} restant{remainingDownloads > 1 ? "s" : ""}
            </span>
          </div>
          <div className="font-display text-xl font-bold mb-1">
            {quota.used} <span className="text-xs text-muted font-normal">/ {quota.limit}</span>
          </div>
          <div className="text-xs text-muted">Téléchargements ce mois</div>
        </Link>

        {/* Favoris */}
        <Link
          href="/dashboard/favoris"
          className="p-5 rounded-2xl border border-[#222222] bg-surface/50 hover:border-accent/40 transition-colors group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xs text-muted font-mono">{totalFavorites || 0}</span>
          </div>
          <div className="font-display text-xl font-bold mb-1">
            {totalFavorites || 0}
          </div>
          <div className="text-xs text-muted">Packs favoris enregistrés</div>
        </Link>
      </div>

      {/* Nouveautés récentes du catalogue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg">Derniers ajouts au catalogue</h2>
          <Link
            href="/dashboard/catalogue"
            className="text-xs text-accent hover:text-accent-dim flex items-center gap-1 font-medium"
          >
            <span>Voir tout le catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentProducts.length === 0 ? (
          <div className="rounded-2xl border border-[#222222] bg-surface/50 p-12 text-center">
            <Package className="w-10 h-10 text-muted mx-auto mb-2 opacity-30" />
            <p className="text-xs text-muted">
              Aucun produit disponible actuellement. Rendez-vous bientôt pour les nouveautés !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                isSubscriber={isSubscriber}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
