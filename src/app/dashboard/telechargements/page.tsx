// Historique des téléchargements et suivi du quota (PRD §7.3, §7.4)
import { createClient } from "@/lib/supabase/server";
import { checkUserQuota } from "@/lib/quota";
import { Download, Package, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { DownloadAgainButton } from "@/components/catalogue/DownloadAgainButton";

export const revalidate = 0;

export default async function TelechargementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Récupérer le quota mensuel
  const quota = await checkUserQuota(user.id);

  // Récupérer l'historique complet des téléchargements
  const { data: downloads } = await supabase
    .from("downloads")
    .select(`
      id,
      downloaded_at,
      product_id,
      products:product_id (
        id,
        title,
        slug,
        thumbnail_url,
        file_size_bytes,
        categories:category_id (name)
      )
    `)
    .eq("user_id", user.id)
    .order("downloaded_at", { ascending: false });

  const remaining = Math.max(0, quota.limit - quota.used);
  const quotaPercent = Math.min(100, Math.round((quota.used / quota.limit) * 100));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">
          Mes <span className="text-accent">téléchargements</span>
        </h1>
        <p className="text-sm text-muted">
          Suivez votre consommation mensuelle et retrouvez vos archives ZIP
        </p>
      </div>

      {/* Carte du quota mensuel */}
      <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6 max-w-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <div className="text-xs text-muted font-medium uppercase tracking-wider">
              Quota mensuel de téléchargements
            </div>
            <div className="font-display font-bold text-2xl text-text mt-1">
              {quota.used} <span className="text-muted text-base font-normal">/ {quota.limit} produits ce mois</span>
            </div>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-surface2 border border-[#222222] text-xs font-semibold text-accent">
            {remaining} téléchargement{remaining > 1 ? "s" : ""} restant{remaining > 1 ? "s" : ""}
          </div>
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-surface2 rounded-full h-2 overflow-hidden mb-2">
          <div
            className={`h-2 transition-all duration-500 rounded-full ${
              quotaPercent > 85 ? "bg-red-500" : "bg-accent"
            }`}
            style={{ width: `${quotaPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-muted">
          Les re-téléchargements d&apos;un même produit dans le mois ne consomment aucun quota supplémentaire.
        </p>
      </div>

      {/* Liste de l'historique */}
      <div>
        <h2 className="font-display font-semibold text-lg mb-4">Historique des fichiers récupérés</h2>

        {!downloads || downloads.length === 0 ? (
          <div className="rounded-2xl border border-[#222222] bg-surface/50 p-16 text-center max-w-xl mx-auto">
            <Download className="w-12 h-12 text-muted mx-auto mb-3 opacity-30" />
            <div className="font-display font-semibold text-lg text-text mb-1">
              Aucun téléchargement enregistré
            </div>
            <p className="text-xs text-muted mb-6">
              Tous les packs et kits que vous téléchargez apparaîtront ici avec possibilité de les retélécharger à tout moment.
            </p>
            <Link
              href="/dashboard/catalogue"
              className="inline-block px-6 py-2.5 bg-accent text-background font-bold text-xs rounded-xl hover:bg-accent-dim transition-all"
            >
              Découvrir les produits
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#222222] bg-surface/50 overflow-hidden divide-y divide-[#222222]">
            {downloads.map((dl: any) => {
              const product = dl.products;
              const sizeMb = product?.file_size_bytes
                ? `${(product.file_size_bytes / (1024 * 1024)).toFixed(1)} Mo`
                : null;

              return (
                <div
                  key={dl.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-surface2/30 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    {product?.thumbnail_url ? (
                      <img
                        src={product.thumbnail_url}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover bg-surface2 border border-[#222222] shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-surface2 flex items-center justify-center text-muted shrink-0">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-sm text-text">
                        {product?.title || "Produit archivé"}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                        <span>{product?.categories?.name || "Pack PLR"}</span>
                        {sizeMb && <span>• {sizeMb}</span>}
                        <span>
                          • Téléchargé le{" "}
                          {new Date(dl.downloaded_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {product?.id && (
                    <DownloadAgainButton productId={product.id} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
