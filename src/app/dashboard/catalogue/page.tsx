// Catalogue membre connecté à la base de données Supabase (PRD §7.2, §17 étape 5)
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { ProductItem } from "@/components/catalogue/ProductDialog";
import { Search, Package } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

interface CataloguePageProps {
  searchParams: Promise<{
    q?: string;
    cat?: string;
  }>;
}

export default async function MemberCataloguePage({ searchParams }: CataloguePageProps) {
  const { q: searchQuery, cat: selectedCat } = await searchParams;
  const supabase = await createClient();

  // 1. Récupérer l'utilisateur courant et son statut d'abonnement
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

    // Récupérer les favoris de l'utilisateur
    const { data: favs } = await supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id);

    if (favs) {
      userFavoriteIds = new Set(favs.map((f) => f.product_id));
    }
  }

  // 2. Récupérer les catégories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order");

  // 3. Récupérer les produits publiés (colonnes sélectionnées explicitement selon DECISIONS.md)
  let query = supabase
    .from("products")
    .select(`
      id,
      title,
      slug,
      description,
      category_id,
      required_tools,
      thumbnail_url,
      file_size_bytes,
      file_list,
      is_featured,
      is_published,
      created_at,
      categories:category_id (name, slug)
    `)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (selectedCat) {
    const matchedCategory = categories?.find((c) => c.slug === selectedCat);
    if (matchedCategory) {
      query = query.eq("category_id", matchedCategory.id);
    }
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data: rawProducts } = await query;

  // Mapper les produits pour l'interface
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            Catalogue <span className="text-accent">produits PLR</span>
          </h1>
          <p className="text-sm text-muted">
            Ressources prêtes à l&apos;emploi avec droit de revente complet
          </p>
        </div>

        {!isSubscriber && (
          <Link
            href="/tarifs"
            className="px-5 py-2.5 bg-accent text-background font-bold text-xs rounded-xl hover:bg-accent-dim transition-all shadow-sm"
          >
            Activer mon accès VIP illimité
          </Link>
        )}
      </div>

      {/* Barre de recherche & filtres par catégorie */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Filtres par catégorie */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <Link
            href="/dashboard/catalogue"
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              !selectedCat
                ? "bg-accent text-background"
                : "bg-surface2 text-muted hover:text-text border border-[#222222]"
            }`}
          >
            Tous les formats
          </Link>
          {categories?.map((cat) => {
            const isActive = selectedCat === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/dashboard/catalogue?cat=${cat.slug}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-accent text-background font-semibold"
                    : "bg-surface2 text-muted hover:text-text border border-[#222222]"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

        {/* Barre de recherche */}
        <form method="GET" action="/dashboard/catalogue" className="relative shrink-0 md:w-72">
          {selectedCat && <input type="hidden" name="cat" value={selectedCat} />}
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            name="q"
            defaultValue={searchQuery || ""}
            placeholder="Rechercher un produit..."
            className="w-full pl-10 pr-4 py-2 bg-surface2 border border-[#222222] rounded-xl text-xs focus:border-accent/50 focus:outline-none"
          />
        </form>
      </div>

      {/* Grille de produits */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-[#222222] bg-surface/50 p-16 text-center">
          <Package className="w-12 h-12 text-muted mx-auto mb-3 opacity-30" />
          <div className="font-display font-medium text-base text-text mb-1">
            Aucun produit trouvé
          </div>
          <p className="text-xs text-muted max-w-sm mx-auto">
            {searchQuery
              ? `Aucun résultat ne correspond à "${searchQuery}". Essayez un autre terme ou réinitialisez les filtres.`
              : "Le catalogue est en cours d'alimentation par notre équipe. Les premiers packs seront disponibles sous peu."}
          </p>
          {(searchQuery || selectedCat) && (
            <Link
              href="/dashboard/catalogue"
              className="inline-block mt-4 px-4 py-2 border border-[#222222] text-xs text-muted hover:text-text rounded-xl"
            >
              Réinitialiser la recherche
            </Link>
          )}
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
