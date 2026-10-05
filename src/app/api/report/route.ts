// Route pour signalement de contenu (PRD §7.8, §9)
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";

const reportSchema = z.object({
  reporterName: z.string().trim().max(100).optional(),
  reporterEmail: z.string().trim().email("Adresse email invalide").toLowerCase(),
  productId: z.string().uuid("Identifiant de produit invalide").optional().nullable(),
  description: z.string().trim().min(10, "La description doit comporter au moins 10 caractères").max(3000),
});

export async function POST(req: NextRequest) {
  const clientIp = await getClientIp();
  const limiter = rateLimit(`report:${clientIp}`, 5, 60 * 1000);
  if (!limiter.ok) {
    return NextResponse.json(
      { error: "Trop de requêtes. Veuillez réessayer plus tard.", code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Format JSON invalide", code: "INVALID_JSON" },
      { status: 400 }
    );
  }

  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Données invalides", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const { reporterName, reporterEmail, productId, description } = parsed.data;
  const adminClient = createAdminClient();

  const { error } = await adminClient.from("content_reports").insert({
    reporter_name: reporterName || null,
    reporter_email: reporterEmail,
    product_id: productId || null,
    description,
    status: "new",
  });

  if (error) {
    console.error("Erreur insertion content_report:", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer votre signalement.", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Votre signalement a été enregistré. Notre équipe juridique va l'examiner.",
  });
}
