// Modal / Dialog détaillé pour produit PLR (PRD §7.2, §7.3)
"use client";

import { useState } from "react";
import { X, Download, ShieldCheck, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category_name?: string;
  required_tools: string[];
  thumbnail_url: string;
  file_size_bytes: number | null;
  file_list: { name: string; size?: string; type?: string }[];
  created_at: string;
  is_favorite?: boolean;
}

interface ProductDialogProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  isSubscriber: boolean;
}

export function ProductDialog({ product, isOpen, onClose, isSubscriber }: ProductDialogProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const sizeMb = product.file_size_bytes
    ? `${(product.file_size_bytes / (1024 * 1024)).toFixed(1)} Mo`
    : null;

  const handleDownload = async () => {
    if (!isSubscriber) {
      window.location.href = "/tarifs";
      return;
    }

    setDownloading(true);
    setDownloadError(null);

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      const data = await res.json();
      if (!res.ok || !data.downloadUrl) {
        throw new Error(data.error || "Erreur lors du téléchargement");
      }

      // Déclenche le téléchargement direct dans le navigateur
      const a = document.createElement("a");
      a.href = data.downloadUrl;
      a.download = `${product.slug}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      setDownloadError(err.message || "Impossible de télécharger le fichier");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-surface border border-[#222222] rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header avec bouton fermer */}
        <div className="p-4 sm:p-6 border-b border-[#222222] flex items-start justify-between gap-4">
          <div>
            <span className="text-xs text-accent font-semibold uppercase tracking-wider">
              {product.category_name || "Produit PLR"}
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-text mt-1">
              {product.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-text rounded-xl hover:bg-surface2 transition-colors shrink-0"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Mockup visuel */}
          {product.thumbnail_url && (
            <div className="aspect-[16/9] w-full bg-surface2 rounded-xl overflow-hidden border border-[#222222] relative">
              <img
                src={product.thumbnail_url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Outils requis & Taille */}
          <div className="flex flex-wrap items-center gap-3">
            {sizeMb && (
              <span className="px-3 py-1 bg-surface2 border border-[#222222] rounded-lg text-xs font-mono text-muted">
                Taille : {sizeMb}
              </span>
            )}
            {product.required_tools && product.required_tools.map((tool) => (
              <span
                key={tool}
                className="px-3 py-1 bg-surface2 border border-[#222222] rounded-lg text-xs font-medium text-text"
              >
                {tool}
              </span>
            ))}
            <span className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-lg text-xs font-semibold text-accent flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Licence PLR incluse
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                À propos de ce produit
              </h3>
              <p className="text-sm text-text leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Fichiers inclus dans le ZIP */}
          <div>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              Contenu du pack ZIP
            </h3>
            {product.file_list && product.file_list.length > 0 ? (
              <ul className="rounded-xl border border-[#222222] bg-surface2/50 divide-y divide-[#222222]/50 text-xs">
                {product.file_list.map((file, i) => (
                  <li key={i} className="px-4 py-2.5 flex items-center justify-between">
                    <span className="font-mono text-text flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                      {file.name}
                    </span>
                    {file.size && <span className="text-muted">{file.size}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted">Archive complète prête à l&apos;emploi.</p>
            )}
          </div>

          {downloadError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{downloadError}</span>
            </div>
          )}
        </div>

        {/* Footer / Action */}
        <div className="p-4 sm:p-6 border-t border-[#222222] bg-surface flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-muted text-center sm:text-left">
            {isSubscriber
              ? "Téléchargement immédiat sous licence PLR"
              : "Abonnement requis pour télécharger ce kit"}
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              isSubscriber
                ? "bg-accent text-background hover:bg-accent-dim glow-accent-strong"
                : "bg-surface2 border border-[#222222] hover:border-accent/40 text-text"
            }`}
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Génération du lien sécurisé...</span>
              </>
            ) : isSubscriber ? (
              <>
                <Download className="w-4 h-4" />
                <span>Télécharger le Pack ZIP</span>
              </>
            ) : (
              <span>Débloquer ce Pack (Passer VIP)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
