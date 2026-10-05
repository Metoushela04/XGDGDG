// Route pour formulaire de contact public (PRD §7.8, §9)
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit comporter au moins 2 caractères").max(100),
  email: z.string().trim().email("Adresse email invalide").toLowerCase(),
  subject: z.string().trim().min(3, "Le sujet est trop court").max(200),
  message: z.string().trim().min(10, "Le message doit comporter au moins 10 caractères").max(3000),
});

export async function POST(req: NextRequest) {
  const clientIp = await getClientIp();
  const limiter = rateLimit(`contact:${clientIp}`, 5, 60 * 1000); // 5 messages max par minute
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

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Données invalides", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = parsed.data;
  const adminClient = createAdminClient();

  const { error } = await adminClient.from("contact_messages").insert({
    name,
    email,
    subject,
    message,
    is_handled: false,
  });

  if (error) {
    console.error("Erreur insertion contact_message:", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer votre message. Veuillez réessayer.", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Votre message a bien été envoyé. Notre équipe vous répondra dans les plus brefs délais.",
  });
}
