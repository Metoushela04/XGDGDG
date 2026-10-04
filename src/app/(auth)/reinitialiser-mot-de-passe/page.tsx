// Vendix - Réinitialiser le mot de passe (atteinte via le lien e-mail → /auth/callback)
import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Nouveau mot de passe — Vendix", robots: { index: false } };

export default async function ReinitialiserMotDePassePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <ResetPasswordForm hasSession={!!user} />;
}
