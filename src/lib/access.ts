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
  if (authError || !user) {
    return { allowed: false, reason: "unauthenticated" };
  }

  // Vérifier le profil (suspension)
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_suspended")
    .eq("id", user.id)
    .single();

  if (profile?.is_suspended) {
    return { allowed: false, reason: "suspended" };
  }

  // Vérifier l'abonnement
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", user.id)
    .single();

  if (!sub || sub.status !== "active") {
    return { allowed: false, reason: "no_subscription" };
  }

  // Vérifier l'expiration réelle même si le statut n'a pas encore été mis à jour
  if (sub.current_period_end && new Date(sub.current_period_end) < new Date()) {
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
  if (error || !user) {
    return { isAdmin: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { isAdmin: false };
  }

  return { isAdmin: true, userId: user.id };
}
