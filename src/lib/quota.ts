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
    const { data } = await adminClient
      .from("app_settings")
      .select("value")
      .eq("key", "monthly_download_quota")
      .single();

    if (data && typeof data.value === "number") {
      return data.value;
    }
    if (data && data.value && typeof data.value.limit === "number") {
      return data.value.limit;
    }
  } catch {
    // Fallback par défaut
  }
  return DEFAULT_MONTHLY_QUOTA;
}

/**
 * Compte les produits distincts téléchargés par le membre pour le mois en cours.
 * Règle PRD §7.4 : Un même produit re-téléchargé ne consomme pas de quota supplémentaire dans le mois.
 */
export async function getUserMonthlyDistinctDownloadsCount(userId: string): Promise<number> {
  const adminClient = createAdminClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { data, error } = await adminClient
    .from("downloads")
    .select("product_id")
    .eq("user_id", userId)
    .gte("downloaded_at", startOfMonth);

  if (error || !data) {
    return 0;
  }

  // Set pour décompter les produits distincts
  const distinctProductIds = new Set(data.map((d) => d.product_id));
  return distinctProductIds.size;
}

/**
 * Vérifie si le membre a déjà téléchargé ce produit ce mois-ci.
 */
export async function hasDownloadedProductThisMonth(userId: string, productId: string): Promise<boolean> {
  const adminClient = createAdminClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { data, error } = await adminClient
    .from("downloads")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .gte("downloaded_at", startOfMonth)
    .limit(1);

  if (error || !data || data.length === 0) {
    return false;
  }

  return true;
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
