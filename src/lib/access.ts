// Vérification d'accès — un membre doit avoir un abonnement actif et ne pas être suspendu.
import "server-only";

import { createClient } from "@/lib/supabase/server";

export type AccessResult =
  | { allowed: true; userId: string }
  | { allowed: false; reason: "unauthenticated" | "suspended" | "no_subscription" | "expired" };

/**
 * Vérifie que l'utilisateur authentifié a le droit de télécharger :
 * 1. Il est connecté.
 * 2. Son profil n'est pas suspendu.
 * 3. Son abonnement est actif et non expiré.
 */
export async function checkAccess(): Promise<AccessResult> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || !user.email_confirmed_at) {
    return { allowed: false, reason: "unauthenticated" };
  }

  // Vérifier le profil (suspension)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_suspended")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.is_suspended) {
    return { allowed: false, reason: "suspended" };
  }

  // Vérifier l'abonnement
  const { data: sub, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", user.id)
    .single();

  if (subscriptionError || !sub || sub.status !== "active") {
    return { allowed: false, reason: "no_subscription" };
  }

  // Vérifier l'expiration réelle même si le statut n'a pas encore été mis à jour
  if (!sub.current_period_end || new Date(sub.current_period_end).getTime() <= Date.now()) {
    return { allowed: false, reason: "expired" };
  }

  return { allowed: true, userId: user.id };
}

/**
 * Vérifie que l'utilisateur est un admin.
 */
export async function checkAdmin(): Promise<{ isAdmin: true; userId: string } | { isAdmin: false }> {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || !user.email_confirmed_at) {
    return { isAdmin: false };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_suspended")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin" || profile.is_suspended) {
    return { isAdmin: false };
  }

  return { isAdmin: true, userId: user.id };
}
