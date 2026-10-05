// Favoris du membre connectés à Supabase (PRD §5)
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { ProductItem } from "@/components/catalogue/ProductDialog";
import { Heart } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function FavorisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Vérifier statut abonnement
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", user.id)
    .maybeSingle();

  const isSubscriber =
    sub?.status === "active" &&
    (!sub.current_period_end || new Date(sub.current_period_end) > new Date());

  // Récupérer les favoris avec les détails des produits
  const { data: rawFavs } = await supabase
    .from("favorites")
    .select(`
      product_id,
      products:product_id (
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
      )
    `)
    .eq("user_id", user.id);

  const products: ProductItem[] = (rawFavs || [])
    .filter((f: any) => f.products)
    .map((f: any) => {
      const p = f.products;
      return {
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
        is_favorite: true,
      };
    });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">
          Mes <span className="text-accent">favoris</span>
        </h1>
        <p className="text-sm text-muted">Retrouvez les produits que vous avez enregistrés</p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-[#222222] bg-surface/50 p-16 text-center max-w-xl mx-auto">
          <Heart className="w-12 h-12 text-muted mx-auto mb-3 opacity-30" />
          <div className="font-display font-semibold text-lg text-text mb-1">
            Aucun favori enregistré
          </div>
          <p className="text-xs text-muted mb-6">
            Explorez notre catalogue et cliquez sur le cœur pour sauvegarder les packs qui vous intéressent.
          </p>
          <Link
            href="/dashboard/catalogue"
            className="inline-block px-6 py-2.5 bg-accent text-background font-bold text-xs rounded-xl hover:bg-accent-dim transition-all"
          >
            Explorer le catalogue
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
