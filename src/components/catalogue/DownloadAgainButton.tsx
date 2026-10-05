// Bouton pour re-télécharger un produit depuis l'historique
"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

export function DownloadAgainButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!res.ok || !data.downloadUrl) {
        alert(data.error || "Erreur lors du téléchargement");
        return;
      }
      const a = document.createElement("a");
      a.href = data.downloadUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      alert("Impossible de récupérer le fichier. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="px-4 py-2 bg-surface2 border border-[#222222] hover:border-accent/40 rounded-xl text-xs font-semibold text-text flex items-center gap-1.5 transition-colors shrink-0"
    >
      {loading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Chargement...</span>
        </>
      ) : (
        <>
          <Download className="w-3.5 h-3.5" />
          <span>Retélécharger</span>
        </>
      )}
    </button>
  );
}
