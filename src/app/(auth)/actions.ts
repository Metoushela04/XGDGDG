"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { recordSignupAcceptances } from "@/lib/legal";
import { rateLimit } from "@/lib/rate-limit";
import { getAppUrl, getClientIp } from "@/lib/request";
import { safeNext } from "@/lib/auth/safe-next";
import {
  forgotPasswordSchema,
  resendSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validation/auth";

export type ActionResult =
  | { ok: true; redirectTo?: string; message?: string }
  | { ok: false; error: string };

const MIN = 60 * 1000;
const tooMany = (sec: number): ActionResult => ({
  ok: false,
  error: `Trop de tentatives. Réessaie dans ${Math.max(1, Math.ceil(sec / 60))} min.`,
});

export async function signUpAction(input: unknown): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  const { fullName, email, password } = parsed.data;

  const ip = await getClientIp();
  const rl = rateLimit(`signup:${ip}`, 5, 60 * MIN);
  if (!rl.ok) return tooMany(rl.retryAfterSec);

  const supabase = await createClient();
  const appUrl = await getAppUrl();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${appUrl}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    if (error.code === "weak_password") return { ok: false, error: "Mot de passe trop faible. Choisis-en un plus long." };
    if (error.code === "over_email_send_rate_limit" || error.status === 429) {
      return { ok: false, error: "Trop d'e-mails envoyés. Réessaie dans quelques minutes." };
    }
    console.error("[auth] signUp:", error.code, error.message);
    return { ok: false, error: "Impossible de créer le compte pour le moment. Réessaie." };
  }

  // E-mail déjà inscrit : Supabase renvoie un faux utilisateur (identities vide) sans erreur,
  // pour ne pas révéler quels e-mails existent. On affiche donc la même page dans tous les cas.
  const isNewUser = !!data.user && (data.user.identities?.length ?? 0) > 0;
  if (isNewUser) await recordSignupAcceptances(data.user!.id, ip);

  return { ok: true, redirectTo: `/verifier-email?email=${encodeURIComponent(email)}` };
}

export async function signInAction(input: unknown): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  const { email, password, next } = parsed.data;

  const ip = await getClientIp();
  const rl = rateLimit(`signin:${ip}`, 10, 10 * MIN);
  if (!rl.ok) return tooMany(rl.retryAfterSec);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "email_not_confirmed") {
      return { ok: true, redirectTo: `/verifier-email?email=${encodeURIComponent(email)}` };
    }
    // Message volontairement identique que l'e-mail existe ou non.
    return { ok: false, error: "E-mail ou mot de passe incorrect." };
  }

  // Un compte suspendu ne peut pas se connecter (PRD §10).
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_suspended")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profile?.is_suspended) {
    await supabase.auth.signOut();
    return { ok: false, error: "Ce compte est suspendu. Contacte le support." };
  }

  return { ok: true, redirectTo: safeNext(next) };
}

export async function requestPasswordResetAction(input: unknown): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Adresse e-mail invalide." };

  const ip = await getClientIp();
  const rl = rateLimit(`reset:${ip}`, 3, 15 * MIN);
  if (!rl.ok) return tooMany(rl.retryAfterSec);

  const supabase = await createClient();
  const appUrl = await getAppUrl();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${appUrl}/auth/callback?next=/reinitialiser-mot-de-passe`,
  });
  if (error) console.error("[auth] resetPassword:", error.code, error.message);

  // Réponse identique que le compte existe ou non (pas d'énumération d'e-mails).
  return { ok: true, message: "Si un compte existe pour cette adresse, un lien vient d'être envoyé." };
}

export async function updatePasswordAction(input: unknown): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Le lien a expiré. Demande un nouveau lien de réinitialisation." };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    if (error.code === "same_password") return { ok: false, error: "Choisis un mot de passe différent de l'ancien." };
    if (error.code === "weak_password") return { ok: false, error: "Mot de passe trop faible." };
    console.error("[auth] updateUser:", error.code, error.message);
    return { ok: false, error: "Impossible de modifier le mot de passe. Réessaie." };
  }

  return { ok: true, redirectTo: "/dashboard" };
}

export async function resendVerificationAction(input: unknown): Promise<ActionResult> {
  const parsed = resendSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Adresse e-mail invalide." };

  const ip = await getClientIp();
  const rl = rateLimit(`resend:${ip}`, 3, 15 * MIN);
  if (!rl.ok) return tooMany(rl.retryAfterSec);

  const supabase = await createClient();
  const appUrl = await getAppUrl();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email,
    options: { emailRedirectTo: `${appUrl}/auth/callback?next=/dashboard` },
  });
  if (error) console.error("[auth] resend:", error.code, error.message);

  return { ok: true, message: "Si ce compte attend une confirmation, un nouvel e-mail vient d'être envoyé." };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/connexion");
}
