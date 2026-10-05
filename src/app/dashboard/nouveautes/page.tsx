// Nouveautés du catalogue Vendix connectées à Supabase (PRD §5, §7.2)
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { ProductItem } from "@/components/catalogue/ProductDialog";
import { Sparkles, Package } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function NouveautesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isSubscriber = false;
  let userFavoriteIds = new Set<string>();

  if (user) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("user_id", user.id)
      .maybeSingle();

    if (
      sub?.status === "active" &&
      (!sub.current_period_end || new Date(sub.current_period_end) > new Date())
    ) {
      isSubscriber = true;
    }

    const { data: favs } = await supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id);

    if (favs) {
      userFavoriteIds = new Set(favs.map((f) => f.product_id));
    }
  }

  // Récupérer les 16 derniers produits publiés
  const { data: rawProducts } = await supabase
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
    .limit(16);

  const products: ProductItem[] = (rawProducts || []).map((p: any) => ({
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

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-accent" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            Dernières <span className="text-accent">nouveautés</span>
          </h1>
        </div>
        <p className="text-sm text-muted">
          Les derniers kits, templates et ebooks ajoutés cette semaine
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-[#222222] bg-surface/50 p-16 text-center max-w-xl mx-auto">
          <Package className="w-12 h-12 text-muted mx-auto mb-3 opacity-30" />
          <div className="font-display font-semibold text-lg text-text mb-1">
            Aucun nouveau produit cette semaine
          </div>
          <p className="text-xs text-muted mb-6">
            Notre équipe ajoute régulièrement de nouvelles ressources prêtes à vendre. Revenez très bientôt !
          </p>
          <Link
            href="/dashboard/catalogue"
            className="inline-block px-6 py-2.5 bg-accent text-background font-bold text-xs rounded-xl hover:bg-accent-dim transition-all"
          >
            Explorer tout le catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSubscriber={isSubscriber}
            />
          ))}
        </div>
      )}
    </div>
  );
}
