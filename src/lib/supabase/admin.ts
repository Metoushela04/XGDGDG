// Client Supabase "service_role" : contourne la RLS. SERVEUR UNIQUEMENT.
// À utiliser pour les écritures sensibles (abonnements, paiements, téléchargements,
// acceptations légales à l'inscription, actions admin…). Ne jamais l'importer dans un composant client.
import "server-only";
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant (.env.local).");
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
