// Signature Cloudinary pour avatar de membre (PRD §9)
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateUploadSignature } from "@/lib/storage/cloudinary";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      { error: "Non authentifié", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  try {
    const signatureData = generateUploadSignature(`vendix/avatars/${user.id}`, {
      maxFileSize: 3_000_000, // 3 Mo max pour avatar
    });

    return NextResponse.json({
      success: true,
      ...signatureData,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erreur Cloudinary", code: "STORAGE_ERROR" },
      { status: 500 }
    );
  }
}
