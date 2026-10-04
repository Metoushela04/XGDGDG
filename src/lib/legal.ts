// Enregistrement de l'acceptation des conditions (table legal_acceptances, PRD §7.1).
import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// document (table legal_acceptances) -> slug de la page (table legal_pages)
const REQUIRED_DOCUMENTS = {
  cgu: "conditions-generales-utilisation",
  cgv: "conditions-generales-vente",
  privacy: "politique-de-confidentialite",
} as const;

export async function recordSignupAcceptances(userId: string, ip: string) {
  const admin = createAdminClient();

  const { data: pages } = await admin
    .from("legal_pages")
    .select("slug, version")
    .in("slug", Object.values(REQUIRED_DOCUMENTS));

  const versionOf = (slug: string) => pages?.find((p) => p.slug === slug)?.version ?? "1.0";
  const ipAddress = ip === "unknown" ? null : ip;

  const rows = Object.entries(REQUIRED_DOCUMENTS).map(([document, slug]) => ({
    user_id: userId,
    document,
    version: versionOf(slug),
    ip_address: ipAddress,
  }));

  const { error } = await admin.from("legal_acceptances").insert(rows);
  if (error) console.error("[legal] échec d'enregistrement des acceptations :", error.message);
}
