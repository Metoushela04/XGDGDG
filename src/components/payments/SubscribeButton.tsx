// Chariow requires a phone number and country to start a real checkout.
"use client";

import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";

export function SubscribeButton({ planId, label }: { planId: string; label: string }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("CD");
  const [error, setError] = useState("");

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/chariow/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, phoneNumber, countryCode: countryCode.toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) throw new Error(data.error || "Paiement indisponible");
      window.location.assign(data.checkoutUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Impossible de démarrer le paiement";
      setError(message);
      window.dispatchEvent(new CustomEvent("vendix:action", { detail: { message, error: true } }));
      setLoading(false);
    }
  };

  if (!expanded) return (
    <button type="button" onClick={() => setExpanded(true)}
      className="w-full py-2.5 bg-accent text-background font-bold text-xs rounded-xl hover:bg-accent-dim transition-all flex items-center justify-center gap-1.5">
      {label} <ArrowRight className="w-3.5 h-3.5" />
    </button>
  );

  return <form onSubmit={handleSubscribe} className="space-y-2">
    <label className="block text-xs text-muted" htmlFor={`country-${planId}`}>Pays (code ISO, ex. CD)</label>
    <input id={`country-${planId}`} autoComplete="country" required minLength={2} maxLength={2} pattern="[A-Za-z]{2}"
      value={countryCode} onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
      className="w-full rounded-lg border border-[#222222] bg-surface2 px-3 py-2 text-sm" />
    <label className="block text-xs text-muted" htmlFor={`phone-${planId}`}>Numéro de téléphone (chiffres sans indicatif)</label>
    <input id={`phone-${planId}`} type="tel" autoComplete="tel-national" required pattern="[0-9]{6,15}"
      value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
      className="w-full rounded-lg border border-[#222222] bg-surface2 px-3 py-2 text-sm" />
    {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
    <button type="submit" disabled={loading}
      className="w-full py-2.5 bg-accent text-background font-bold text-xs rounded-xl hover:bg-accent-dim transition-all flex items-center justify-center gap-1.5 disabled:opacity-50">
      {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Redirection...</> : <>Continuer vers le paiement <ArrowRight className="w-3.5 h-3.5" /></>}
    </button>
  </form>;
}
