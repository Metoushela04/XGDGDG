// Carte produit interactive pour catalogue membre (PRD §7.2)
"use client";

import { useState } from "react";
import { Heart, Package, Download, Lock } from "lucide-react";
import { ProductItem, ProductDialog } from "./ProductDialog";
import { toggleFavoriteAction } from "@/app/dashboard/actions";

interface ProductCardProps {
  product: ProductItem;
  isSubscriber: boolean;
}

export function ProductCard({ product, isSubscriber }: ProductCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFav, setIsFav] = useState(product.is_favorite ?? false);
  const [favLoading, setFavLoading] = useState(false);

  // Badge "Nouveau" si créé il y a moins de 7 jours (PRD §7.2)
  const isNew = (() => {
    const createdDate = new Date(product.created_at).getTime();
    const now = Date.now();
    return now - createdDate < 7 * 24 * 60 * 60 * 1000;
  })();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favLoading) return;
    setFavLoading(true);
    const newFav = !isFav;
    setIsFav(newFav);
    try {
      const res = await toggleFavoriteAction(product.id);
      if (res.error) {
        setIsFav(!newFav); // Rollback
      }
    } catch {
      setIsFav(!newFav);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsDialogOpen(true)}
        className="rounded-2xl border border-[#222222] bg-surface/50 overflow-hidden hover:border-accent/40 transition-all cursor-pointer group flex flex-col h-full"
      >
        {/* Mockup image */}
        <div className="aspect-[4/3] bg-surface2 relative overflow-hidden flex items-center justify-center">
          {product.thumbnail_url ? (
            <img
              src={product.thumbnail_url}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <Package className="w-12 h-12 text-accent/20" />
          )}

          {/* Badges en haut à gauche */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {isNew && (
              <span className="px-2.5 py-0.5 bg-accent text-background font-bold text-[10px] rounded-full shadow-sm">
                Nouveau
              </span>
            )}
            {product.category_name && (
              <span className="px-2.5 py-0.5 bg-surface/80 backdrop-blur-sm text-text text-[10px] font-medium rounded-full border border-[#222222]">
                {product.category_name}
              </span>
            )}
          </div>

          {/* Bouton favori */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-surface/80 backdrop-blur-sm border border-[#222222] text-muted hover:text-red-400 transition-colors"
            aria-label="Ajouter aux favoris"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFav ? "fill-red-500 text-red-500" : "hover:scale-110"
              }`}
            />
          </button>
        </div>

        {/* Détails */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <h3 className="font-display font-semibold text-base text-text group-hover:text-accent transition-colors line-clamp-2">
              {product.title}
            </h3>
            {product.description && (
              <p className="text-xs text-muted line-clamp-2 mt-1 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* Badges d'outils requis */}
          <div className="space-y-3 pt-2">
            {product.required_tools && product.required_tools.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.required_tools.slice(0, 3).map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-0.5 bg-surface2 border border-[#222222] rounded text-[10px] text-muted"
                  >
                    {tool}
                  </span>
                ))}
                {product.required_tools.length > 3 && (
                  <span className="text-[10px] text-muted self-center">
                    +{product.required_tools.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Bouton action carte */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDialogOpen(true);
              }}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                isSubscriber
                  ? "bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-background"
                  : "bg-surface2 border border-[#222222] text-text hover:border-accent/40"
              }`}
            >
              {isSubscriber ? (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger le Pack ZIP</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Débloquer le Pack</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal détails */}
      <ProductDialog
        product={product}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        isSubscriber={isSubscriber}
      />
    </>
  );
}
