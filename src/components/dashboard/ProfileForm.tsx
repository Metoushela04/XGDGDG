"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Mail, Save, User } from "lucide-react";

export function ProfileForm({ fullName, email, memberSince, save }: {
  fullName: string;
  email: string;
  memberSince: string;
  save: (formData: FormData) => Promise<{ error?: string }>;
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const submit = async (formData: FormData) => {
    setPending(true);
    try {
      const result = await save(formData);
      window.dispatchEvent(new CustomEvent("vendix:action", { detail: result.error
        ? { message: result.error, error: true }
        : { message: "Profil mis à jour avec succès." } }));
      if (!result.error) router.refresh();
    } catch {
      window.dispatchEvent(new CustomEvent("vendix:action", { detail: { message: "Impossible de modifier votre profil.", error: true } }));
    } finally {
      setPending(false);
    }
  };
  return <form action={submit} className="space-y-4">
    <div><label htmlFor="profile-name" className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted"><User className="h-3.5 w-3.5 text-accent" /> Nom complet</label>
      <input id="profile-name" name="fullName" type="text" required maxLength={100} defaultValue={fullName} placeholder="Votre nom complet" className="w-full rounded-xl border border-[#222222] bg-surface2 px-4 py-2.5 text-sm focus:border-accent/50 focus:outline-none" /></div>
    <div><label htmlFor="profile-email" className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted"><Mail className="h-3.5 w-3.5 text-accent" /> Adresse e-mail (non modifiable)</label>
      <input id="profile-email" type="email" disabled value={email} className="w-full cursor-not-allowed rounded-xl border border-[#222222] bg-surface2/50 px-4 py-2.5 font-mono text-xs text-muted" /></div>
    <div className="flex items-center justify-between gap-3 pt-2"><div className="flex items-center gap-1.5 text-xs text-muted"><Calendar className="h-3.5 w-3.5" /> Membre depuis {memberSince}</div>
      <button type="submit" disabled={pending} className="flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-background disabled:opacity-50"><Save className="h-3.5 w-3.5" />{pending ? "Enregistrement..." : "Enregistrer"}</button></div>
  </form>;
}
