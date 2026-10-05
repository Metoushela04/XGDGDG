// URL de téléversement signée R2 pour fichier ZIP (PRD §7.9, §9)
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkAdmin } from "@/lib/access";
import { getSignedUploadUrl } from "@/lib/storage/r2";

const zipUploadSchema = z.object({
  filename: z.string().min(1, "Le nom du fichier est requis"),
  contentType: z.string().default("application/zip"),
});

export async function POST(req: NextRequest) {
  // 1. Vérification des droits administrateur
  const adminCheck = await checkAdmin();
  if (!adminCheck.isAdmin) {
    return NextResponse.json(
      { error: "Accès refusé. Réservé aux administrateurs.", code: "FORBIDDEN" },
      { status: 403 }
    );
  }

  // 2. Validation
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Format JSON invalide", code: "INVALID_JSON" },
      { status: 400 }
    );
  }

  const parsed = zipUploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Données invalides", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const { filename, contentType } = parsed.data;

  // 3. Clé sécurisée unique sur Cloudflare R2
  const sanitizedName = filename
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, "-")
    .replace(/-+/g, "-");
  const key = `products/${Date.now()}-${sanitizedName}`;

  try {
    const uploadUrl = await getSignedUploadUrl(key, contentType, 600); // 10 minutes pour uploader
    return NextResponse.json({
      success: true,
      uploadUrl,
      key,
    });
  } catch (err: any) {
    console.error("Erreur génération URL R2 upload:", err);
    return NextResponse.json(
      { error: "Erreur lors de la préparation du téléversement vers R2", code: "STORAGE_ERROR" },
      { status: 500 }
    );
  }
}
