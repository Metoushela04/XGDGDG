// Bouton déclencheur de paiement Chariow
"use client";

import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";

export function SubscribeButton({ planId, label }: { planId: string; label: string }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chariow/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) {
        alert(data.error || "Erreur lors de la préparation du paiement");
        setLoading(false);
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      alert("Erreur de connexion avec la passerelle de paiement");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="w-full py-2.5 bg-accent text-background font-bold text-xs rounded-xl hover:bg-accent-dim transition-all flex items-center justify-center gap-1.5"
    >
      {loading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Redirection...</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </>
      )}
    </button>
  );
}
