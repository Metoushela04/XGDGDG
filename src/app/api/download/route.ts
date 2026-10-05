// Route de téléchargement sécurisé de produits PLR (PRD §7.3)
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkAccess } from "@/lib/access";
import { checkUserQuota } from "@/lib/quota";
import { getSignedDownloadUrl } from "@/lib/storage/r2";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";

const downloadSchema = z.object({
  productId: z.string().uuid("Identifiant de produit invalide"),
});

export async function POST(req: NextRequest) {
  // 1. Rate limiting (anti-abus / anti-moissonnage)
  const clientIp = await getClientIp();
  const limiter = rateLimit(`download:${clientIp}`, 30, 60 * 1000); // max 30 requêtes par minute
  if (!limiter.ok) {
    return NextResponse.json(
      { error: "Trop de requêtes. Veuillez patienter un instant.", code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  // 2. Validation du payload
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Format JSON invalide", code: "INVALID_JSON" },
      { status: 400 }
    );
  }

  const parsed = downloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Données invalides", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const { productId } = parsed.data;

  // 3. Vérification de l'authentification et de l'abonnement
  const access = await checkAccess();
  if (!access.allowed) {
    if (access.reason === "unauthenticated") {
      return NextResponse.json(
        { error: "Vous devez être connecté pour télécharger", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }
    if (access.reason === "suspended") {
      return NextResponse.json(
        { error: "Votre compte est suspendu. Veuillez contacter le support.", code: "SUSPENDED" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      {
        error: "Un abonnement actif est requis pour télécharger ce produit",
        code: "SUBSCRIPTION_REQUIRED",
      },
      { status: 403 }
    );
  }

  const userId = access.userId;

  // 4. Vérification du quota mensuel (un même produit re-téléchargé est gratuit)
  const quota = await checkUserQuota(userId, productId);
  if (!quota.allowed) {
    return NextResponse.json(
      {
        error: `Quota mensuel de téléchargements atteint (${quota.used}/${quota.limit}). Votre quota se renouvelle le 1er du mois prochain.`,
        code: "QUOTA_EXCEEDED",
        used: quota.used,
        limit: quota.limit,
      },
      { status: 403 }
    );
  }

  // 5. Récupération du produit avec la clé R2 (via adminClient car r2_file_key n'est pas lisible par le client)
  const adminClient = createAdminClient();
  const { data: product, error: prodError } = await adminClient
    .from("products")
    .select("id, title, r2_file_key, is_published")
    .eq("id", productId)
    .single();

  if (prodError || !product) {
    return NextResponse.json(
      { error: "Produit introuvable", code: "PRODUCT_NOT_FOUND" },
      { status: 404 }
    );
  }

  if (!product.is_published) {
    return NextResponse.json(
      { error: "Ce produit n'est pas encore disponible", code: "PRODUCT_NOT_PUBLISHED" },
      { status: 404 }
    );
  }

  if (!product.r2_file_key) {
    return NextResponse.json(
      { error: "Fichier du produit indisponible", code: "FILE_MISSING" },
      { status: 500 }
    );
  }

  // 6. Génération de l'URL signée R2 (60 secondes)
  let downloadUrl: string;
  try {
    downloadUrl = await getSignedDownloadUrl(product.r2_file_key, 60);
  } catch (err: any) {
    console.error("Erreur génération URL R2:", err);
    return NextResponse.json(
      { error: "Impossible de générer le lien de téléchargement. Réessayez.", code: "STORAGE_ERROR" },
      { status: 500 }
    );
  }

  // 7. Enregistrement dans la table downloads
  const userAgent = req.headers.get("user-agent") || undefined;
  await adminClient.from("downloads").insert({
    user_id: userId,
    product_id: productId,
    ip_address: clientIp || null,
    user_agent: userAgent ? userAgent.slice(0, 500) : null,
  });

  return NextResponse.json({
    success: true,
    downloadUrl,
    expiresIn: 60,
    isRedownload: quota.isRedownload,
  });
}
