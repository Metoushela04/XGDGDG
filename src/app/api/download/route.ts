// Entitlement, quota, and audit are committed atomically before returning a signed R2 URL.
import { NextRequest, NextResponse } from "next/server";
import { isIP } from "node:net";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkAccess } from "@/lib/access";
import { getSignedDownloadUrl, getFileMeta } from "@/lib/storage/r2";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";

const schema = z.object({ productId: z.string().uuid() });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Produit invalide" }, { status: 400 });

  const access = await checkAccess();
  if (!access.allowed) {
    return NextResponse.json(
      { error: access.reason === "unauthenticated" ? "Connexion requise" : "Abonnement actif requis", code: access.reason },
      { status: access.reason === "unauthenticated" ? 401 : 403 }
    );
  }
  const ip = await getClientIp();
  if (!rateLimit(`download:${access.userId}:${ip}`, 30, 60_000).ok) {
    return NextResponse.json({ error: "Trop de demandes de téléchargement" }, { status: 429 });
  }

  const admin = createAdminClient();
  const { data: product, error: productError } = await admin.from("products")
    .select("id,r2_file_key,is_published").eq("id", parsed.data.productId).maybeSingle();
  if (productError) return NextResponse.json({ error: "Catalogue indisponible" }, { status: 503 });
  if (!product?.is_published || !product.r2_file_key) {
    return NextResponse.json({ error: "Produit indisponible" }, { status: 404 });
  }

  try {
    const file = await getFileMeta(product.r2_file_key);
    if (!file.exists) return NextResponse.json({ error: "Archive indisponible" }, { status: 404 });
    // Sign first, but do not expose the URL until Postgres has reserved the download.
    const downloadUrl = await getSignedDownloadUrl(product.r2_file_key, 60);
    const { data, error } = await admin.rpc("reserve_product_download", {
      p_user: access.userId,
      p_product: product.id,
      p_ip: isIP(ip) ? ip : null,
      p_user_agent: req.headers.get("user-agent") || "",
    });
    if (error || !data?.length) {
      console.error("[download] Reservation impossible:", error?.message);
      return NextResponse.json({ error: "Téléchargement temporairement indisponible" }, { status: 503 });
    }
    const result = data[0] as { allowed: boolean; reason: string; used: number; quota_limit: number; is_redownload: boolean };
    if (!result.allowed) {
      const status = result.reason === "PRODUCT_NOT_FOUND" ? 404 : 403;
      return NextResponse.json({
        error: result.reason === "QUOTA_EXCEEDED" ? "Quota mensuel atteint" : "Accès refusé",
        code: result.reason, used: result.used, limit: result.quota_limit,
      }, { status });
    }
    return NextResponse.json({ success: true, downloadUrl, expiresIn: 60, isRedownload: result.is_redownload },
      { headers: { "Cache-Control": "private, no-store" } });
  } catch (err) {
    console.error("[download] Stockage indisponible:", err);
    return NextResponse.json({ error: "Archive temporairement indisponible" }, { status: 503 });
  }
}
