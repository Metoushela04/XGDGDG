// Gestion des quotas de téléchargement mensuels
import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

const DEFAULT_MONTHLY_QUOTA = 30;

/**
 * Récupère le quota mensuel configuré dans app_settings ou la valeur par défaut.
 */
export async function getMonthlyQuotaLimit(): Promise<number> {
  const adminClient = createAdminClient();
  try {
    const { data, error } = await adminClient
      .from("app_settings")
      .select("value")
      .eq("key", "monthly_download_quota")
      .single();

    if (error && error.code !== "PGRST116") throw error;
    if (data && typeof data.value === "number" && Number.isInteger(data.value) && data.value >= 0) {
      return data.value;
    }
    if (data && data.value && typeof data.value.limit === "number" &&
      Number.isInteger(data.value.limit) && data.value.limit >= 0) {
      return data.value.limit;
    }
    if (data) throw new Error("Configuration de quota invalide");
  } catch (error) {
    // Never display a fabricated safe quota if the database is unavailable.
    throw error;
  }
  return DEFAULT_MONTHLY_QUOTA;
}

/**
 * Compte les produits distincts téléchargés par le membre pour le mois en cours.
 * Règle PRD §7.4 : Un même produit re-téléchargé ne consomme pas de quota supplémentaire dans le mois.
 */
export async function getUserMonthlyDistinctDownloadsCount(userId: string): Promise<number> {
  const adminClient = createAdminClient();

  const { data, error } = await adminClient.rpc("monthly_download_count", { p_user: userId });
  if (error || typeof data !== "number") throw error || new Error("Quota indisponible");
  return data;
}

/**
 * Vérifie si le membre a déjà téléchargé ce produit ce mois-ci.
 */
export async function hasDownloadedProductThisMonth(userId: string, productId: string): Promise<boolean> {
  const adminClient = createAdminClient();

  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();

  const { data, error } = await adminClient
    .from("downloads")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .gte("downloaded_at", startOfMonth)
    .limit(1);

  if (error || !data) throw error || new Error("Quota indisponible");
  return data.length > 0;
}

/**
 * Vérifie si l'utilisateur a le droit de télécharger un produit donné :
 * - Si le produit a déjà été téléchargé ce mois-ci : autorisé (re-téléchargement gratuit).
 * - Sinon : vérifie le nombre de produits distincts téléchargés vs quota mensuel.
 */
export async function checkUserQuota(userId: string, productId?: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
  isRedownload: boolean;
}> {
  const [used, limit] = await Promise.all([
    getUserMonthlyDistinctDownloadsCount(userId),
    getMonthlyQuotaLimit(),
  ]);

  if (productId) {
    const isRedownload = await hasDownloadedProductThisMonth(userId, productId);
    if (isRedownload) {
      return {
        allowed: true,
        used,
        limit,
        isRedownload: true,
      };
    }
  }

  return {
    allowed: used < limit,
    used,
    limit,
    isRedownload: false,
  };
}
