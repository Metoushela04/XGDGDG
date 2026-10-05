// Signature Cloudinary pour téléversement d'images produit (PRD §7.9, §9)
import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/access";
import { generateUploadSignature } from "@/lib/storage/cloudinary";

export async function POST(req: NextRequest) {
  const adminCheck = await checkAdmin();
  if (!adminCheck.isAdmin) {
    return NextResponse.json(
      { error: "Accès refusé. Réservé aux administrateurs.", code: "FORBIDDEN" },
      { status: 403 }
    );
  }

  try {
    const signatureData = generateUploadSignature("vendix/products", {
      maxFileSize: 10_000_000, // 10 Mo max
    });

    return NextResponse.json({
      success: true,
      ...signatureData,
    });
  } catch (err: any) {
    console.error("Erreur génération signature Cloudinary:", err);
    return NextResponse.json(
      { error: err.message || "Erreur de configuration Cloudinary", code: "STORAGE_ERROR" },
      { status: 500 }
    );
  }
}
