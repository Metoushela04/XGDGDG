// Nouveautés du catalogue Vendix connectées à Supabase (PRD §5, §7.2)
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { ProductItem } from "@/components/catalogue/ProductDialog";
import { ArrowRight, ChevronRight } from "lucide-react";
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
      (!!sub.current_period_end && new Date(sub.current_period_end) > new Date())
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
      published_at,
      categories:category_id (name)
    `)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(16);

  const products: ProductItem[] = (rawProducts || []).map((p) => {
    const category = p.categories as { name: string } | { name: string }[] | null;
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      category_name: Array.isArray(category) ? category[0]?.name : category?.name,
      required_tools: p.required_tools || [],
      thumbnail_url: p.thumbnail_url,
      file_size_bytes: p.file_size_bytes,
      file_list: p.file_list || [],
      created_at: p.published_at || p.created_at,
      is_favorite: userFavoriteIds.has(p.id),
    };
  });

  return (
    <div className="mx-auto w-full max-w-6xl space-y-7 md:space-y-9">
      <nav aria-label="Fil d’Ariane" className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#aab5a4]">
        <Link href="/dashboard" className="hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">
          Tableau de bord
        </Link>
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-[#72816d]" />
        <span aria-current="page" className="text-accent">Nouveautés</span>
      </nav>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Les dernières <span className="text-accent">nouveautés.</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#aab5a4]">
            Retrouvez ici les ressources dès qu’elles sont publiées dans le catalogue.
          </p>
        </div>
        <span className="hidden shrink-0 rounded-full border border-[#4b5c43] px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-wide text-[#cfdbc9] sm:inline-flex">
          Votre catalogue
        </span>
      </div>

      {products.length === 0 ? (
        <>
          <section aria-labelledby="nouveautes-vide" className="grid overflow-hidden rounded-2xl border border-[#303a2c] bg-[#111610] md:min-h-[320px] md:grid-cols-[minmax(0,1fr)_42%]">
            <div className="order-2 flex flex-col items-start justify-center p-6 sm:p-9 md:order-1 lg:p-12">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent">Pour le moment</span>
              <h2 id="nouveautes-vide" className="mt-3 max-w-md font-display text-[27px] font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                La prochaine ressource n’est pas encore là.
              </h2>
              <p className="mt-3 mb-6 max-w-md text-sm leading-relaxed text-[#b6c2b0]">
                Les nouveaux produits apparaîtront ici après leur publication. En attendant, vous pouvez parcourir les ressources déjà disponibles.
              </p>
              <Link href="/dashboard/catalogue" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-center text-sm font-bold text-background transition-colors hover:bg-accent-dim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto">
                Explorer tout le catalogue <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative order-1 flex min-h-44 items-center justify-center overflow-hidden border-b border-[#303a2c] bg-[radial-gradient(circle_at_center,#8eb12818,transparent_65%)] md:order-2 md:min-h-full md:border-b-0 md:border-l">
              <svg aria-hidden="true" viewBox="0 0 280 210" className="h-40 w-56 sm:h-52 sm:w-72" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="64" y="25" width="120" height="159" rx="7" transform="rotate(-17 64 25)" fill="#1E2A1B" stroke="#60765A" />
                <rect x="78" y="21" width="120" height="159" rx="7" transform="rotate(15 78 21)" fill="#1E2A1B" stroke="#78936C" />
                <rect x="70" y="18" width="130" height="167" rx="7" fill="#293922" stroke="#99B288" />
                <path d="M89 45h44" stroke="#C8FF00" strokeWidth="3" strokeLinecap="round" />
                <path d="M89 134h89M89 145h65M89 156h76" stroke="#96B385" strokeOpacity=".75" strokeWidth="2" strokeLinecap="round" />
                <circle cx="207" cy="39" r="23" fill="#C8FF00" fillOpacity=".14" />
                <circle cx="207" cy="39" r="17" fill="#C8FF00" />
                <path d="M207 32v14m-7-7h14" stroke="#142008" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span className="absolute bottom-3 font-mono text-[10px] font-medium tracking-wide text-[#a6b69f] sm:bottom-5">
                DE NOUVELLES RESSOURCES, ICI.
              </span>
            </div>
          </section>
          <div>
            <h2 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-[#9baa94]">Continuer à explorer</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/dashboard" className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-[#303a2c] bg-[#111510] px-5 py-4 text-sm font-semibold transition-colors hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-accent">
                Retour au tableau de bord <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
              </Link>
              <Link href="/dashboard/favoris" className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-[#303a2c] bg-[#111510] px-5 py-4 text-sm font-semibold transition-colors hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-accent">
                Voir mes favoris <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} isSubscriber={isSubscriber} />
          ))}
        </div>
      )}
    </div>
  );
}
